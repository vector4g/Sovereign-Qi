import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPilotSchema, insertGovernanceSignalSchema, insertAnonymousTestimonySchema } from "@shared/schema";
import { randomBytes } from "crypto";
import { generateCouncilAdviceWithFallback } from "./lib/agents";
import { runQiSimulation } from "./lib/simulator";
import { pilotRateLimit, councilRateLimit, signalRateLimit, getRateLimitStats } from "./lib/rateLimit";
import { createSanitizationMiddleware } from "./lib/sanitize";
import { llmObservability } from "./lib/observability";

// Generate canonical orgId from org name for consistent Morpheus signal matching
function generateOrgId(orgName: string): string {
  return orgName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function requireAuth(req: any, res: any, next: any) {
  const sessionId = req.headers["x-session-id"];
  if (!sessionId) {
    return res.status(401).json({ error: "Unauthorized - No session" });
  }
  
  storage.getSession(sessionId as string).then((session) => {
    if (!session || new Date() > session.expiresAt) {
      return res.status(401).json({ error: "Unauthorized - Invalid or expired session" });
    }
    req.userEmail = session.email;
    next();
  }).catch(() => {
    res.status(500).json({ error: "Session validation failed" });
  });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Apply sanitization middleware globally for LLM output safety
  app.use(createSanitizationMiddleware());
  
  // Observability endpoints
  app.get("/api/observability/llm", requireAuth, (req, res) => {
    const sinceMs = parseInt(req.query.since as string) || 3600000;
    res.json({
      metrics: llmObservability.getMetrics(sinceMs),
      recentCalls: llmObservability.getRecentCalls(20),
    });
  });

  app.get("/api/observability/rate-limits", requireAuth, (req, res) => {
    res.json(getRateLimitStats());
  });
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || typeof email !== "string" || !email.includes("@")) {
        return res.status(400).json({ error: "Valid email required" });
      }

      const sessionId = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await storage.createSession({
        id: sessionId,
        email,
        expiresAt,
      });

      res.json({ sessionId, email });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try {
      const sessionId = req.headers["x-session-id"] as string;
      if (sessionId) {
        await storage.deleteSession(sessionId);
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ error: "Logout failed" });
    }
  });

  app.get("/api/auth/me", requireAuth, async (req: any, res) => {
    res.json({ email: req.userEmail });
  });

  app.post("/api/pilots", requireAuth, pilotRateLimit, async (req: any, res) => {
    try {
      // Auto-generate canonical orgId from orgName for Morpheus signal matching
      const orgId = generateOrgId(req.body.orgName || "");
      const validatedData = insertPilotSchema.parse({
        ...req.body,
        ownerEmail: req.userEmail,
        orgId,
      });

      const pilot = await storage.createPilot(validatedData);
      res.status(201).json(pilot);
    } catch (error: any) {
      console.error("Create pilot error:", error);
      res.status(400).json({ error: error.message || "Invalid pilot data" });
    }
  });

  app.get("/api/pilots", requireAuth, pilotRateLimit, async (req: any, res) => {
    try {
      const pilots = await storage.getPilotsByOwner(req.userEmail);
      res.json(pilots);
    } catch (error) {
      console.error("Get pilots error:", error);
      res.status(500).json({ error: "Failed to fetch pilots" });
    }
  });

  app.get("/api/pilots/:id", requireAuth, pilotRateLimit, async (req: any, res) => {
    try {
      const pilot = await storage.getPilot(req.params.id);
      if (!pilot) {
        return res.status(404).json({ error: "Pilot not found" });
      }
      if (pilot.ownerEmail !== req.userEmail) {
        return res.status(403).json({ error: "Access denied" });
      }
      res.json(pilot);
    } catch (error) {
      console.error("Get pilot error:", error);
      res.status(500).json({ error: "Failed to fetch pilot" });
    }
  });

  app.post("/api/pilots/:id/advise", requireAuth, councilRateLimit, async (req: any, res) => {
    try {
      const pilot = await storage.getPilot(req.params.id);
      if (!pilot) {
        return res.status(404).json({ error: "Pilot not found" });
      }
      if (pilot.ownerEmail !== req.userEmail) {
        return res.status(403).json({ error: "Access denied" });
      }

      // Fetch Morpheus governance signals for this pilot's org using canonical orgId
      const rawSignals = await storage.getGovernanceSignalsByOrg(pilot.orgId);
      const signalsByCategory = rawSignals.reduce((acc, s) => {
        if (!acc[s.category]) {
          acc[s.category] = { category: s.category, count: 0, examples: [] };
        }
        acc[s.category].count += parseInt(s.patternCount || "1", 10);
        if (acc[s.category].examples.length < 3) {
          acc[s.category].examples.push(s.summary.slice(0, 100));
        }
        return acc;
      }, {} as Record<string, { category: string; count: number; examples: string[] }>);
      
      const governanceSignals = Object.values(signalsByCategory);

      const advice = await generateCouncilAdviceWithFallback({
        primaryObjective: pilot.primaryObjective,
        majorityLogicDesc: pilot.majorityLogicDesc,
        qiLogicDesc: pilot.qiLogicDesc,
        communityVoices: req.body.communityVoices,
        harms: req.body.harms,
        governanceSignals: governanceSignals.length > 0 ? governanceSignals : undefined,
      });

      const sanitizeArray = (arr: string[], maxItems: number = 5, maxLen: number = 200) =>
        arr.slice(0, maxItems).map((s) => s.slice(0, maxLen));

      const logEntry = await storage.createCouncilDecision({
        pilotId: pilot.id,
        status: advice.status,
        adviceSummary: advice.qiPolicySummary.slice(0, 500),
        requiredChanges: sanitizeArray(advice.requiredChanges),
        riskFlags: sanitizeArray(advice.riskFlags),
        curbCutBenefits: sanitizeArray(advice.curbCutBenefits),
      });

      res.json({ 
        pilotId: pilot.id, 
        advice,
        loggedDecisionId: logEntry.id,
        loggedAt: logEntry.createdAt,
      });
    } catch (error) {
      console.error("Council advice error:", error);
      res.status(500).json({ error: "Council deliberation failed" });
    }
  });

  app.get("/api/pilots/:id/council-log", requireAuth, async (req: any, res) => {
    try {
      const pilot = await storage.getPilot(req.params.id);
      if (!pilot) {
        return res.status(404).json({ error: "Pilot not found" });
      }
      if (pilot.ownerEmail !== req.userEmail) {
        return res.status(403).json({ error: "Access denied" });
      }

      const entries = await storage.getCouncilDecisionsByPilot(req.params.id);
      res.json({ pilotId: pilot.id, entries });
    } catch (error) {
      console.error("Council log error:", error);
      res.status(500).json({ error: "Failed to fetch council log" });
    }
  });

  app.post("/api/pilots/:id/run", requireAuth, async (req: any, res) => {
    try {
      const pilot = await storage.getPilot(req.params.id);
      if (!pilot) {
        return res.status(404).json({ error: "Pilot not found" });
      }
      if (pilot.ownerEmail !== req.userEmail) {
        return res.status(403).json({ error: "Access denied" });
      }

      const result = await runQiSimulation({
        id: pilot.id,
        name: pilot.name,
        primaryObjective: pilot.primaryObjective,
        majorityLogicDesc: pilot.majorityLogicDesc,
        qiLogicDesc: pilot.qiLogicDesc,
        orgName: pilot.orgName,
        region: pilot.region,
      });

      await storage.createSimulation({
        pilotId: pilot.id,
        scenarioAInnovation: result.scenarioA.innovationIndex.toString(),
        scenarioABurnout: result.scenarioA.burnoutIndex.toString(),
        scenarioALiability: result.scenarioA.liabilityIndex.toString(),
        scenarioBInnovation: result.scenarioB.innovationIndex.toString(),
        scenarioBBurnout: result.scenarioB.burnoutIndex.toString(),
        scenarioBLiability: result.scenarioB.liabilityIndex.toString(),
      });

      await storage.updatePilotStatus(pilot.id, "COMPLETED");

      res.json(result);
    } catch (error) {
      console.error("Run simulation error:", error);
      res.status(500).json({ error: "Simulation failed" });
    }
  });

  // Morpheus Governance Signals - Ingest from GPU pipeline
  app.post("/api/signals", requireAuth, signalRateLimit, async (req: any, res) => {
    try {
      const validatedData = insertGovernanceSignalSchema.parse(req.body);
      
      // Authorization: user must own at least one pilot with matching canonical orgId
      const userPilots = await storage.getPilotsByOwner(req.userEmail);
      const hasOrgAccess = userPilots.some(p => p.orgId === validatedData.orgId);
      if (!hasOrgAccess) {
        return res.status(403).json({ error: "Access denied - no pilots in this organization" });
      }

      const signal = await storage.createGovernanceSignal(validatedData);
      res.status(201).json(signal);
    } catch (error: any) {
      console.error("Create signal error:", error);
      res.status(400).json({ error: error.message || "Invalid signal data" });
    }
  });

  app.get("/api/signals/org/:orgId", requireAuth, signalRateLimit, async (req: any, res) => {
    try {
      // Authorization: user must own at least one pilot with matching canonical orgId
      const userPilots = await storage.getPilotsByOwner(req.userEmail);
      const hasOrgAccess = userPilots.some(p => p.orgId === req.params.orgId);
      if (!hasOrgAccess) {
        return res.status(403).json({ error: "Access denied - no pilots in this organization" });
      }

      const signals = await storage.getGovernanceSignalsByOrg(req.params.orgId);
      res.json({ orgId: req.params.orgId, signals });
    } catch (error) {
      console.error("Get org signals error:", error);
      res.status(500).json({ error: "Failed to fetch signals" });
    }
  });

  app.get("/api/pilots/:id/signals", requireAuth, async (req: any, res) => {
    try {
      const pilot = await storage.getPilot(req.params.id);
      if (!pilot) {
        return res.status(404).json({ error: "Pilot not found" });
      }
      if (pilot.ownerEmail !== req.userEmail) {
        return res.status(403).json({ error: "Access denied" });
      }

      const signals = await storage.getGovernanceSignalsByPilot(req.params.id);
      res.json({ pilotId: pilot.id, signals });
    } catch (error) {
      console.error("Get pilot signals error:", error);
      res.status(500).json({ error: "Failed to fetch signals" });
    }
  });

  // Anonymous Testimony - Zero-Knowledge Submission (NO AUTH REQUIRED)
  // This endpoint intentionally does not log IP, user agent, or session
  app.post("/api/testimony", async (req, res) => {
    try {
      const validatedData = insertAnonymousTestimonySchema.parse(req.body);
      
      // Validate testimony length for data minimization
      if (validatedData.testimony.length > 2000) {
        return res.status(400).json({ error: "Testimony exceeds 2000 character limit" });
      }
      
      // Normalize orgId for consistent matching
      const orgId = validatedData.orgId.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
      
      const testimony = await storage.createAnonymousTestimony({
        ...validatedData,
        orgId,
      });
      
      // Return only confirmation, not the full record (privacy)
      res.status(201).json({ 
        received: true,
        message: "Your testimony has been recorded anonymously. Thank you for contributing to community safety."
      });
    } catch (error: any) {
      console.error("Create testimony error:", error);
      res.status(400).json({ error: "Invalid testimony data" });
    }
  });

  // Get testimony for an org (requires auth and pilot ownership)
  app.get("/api/testimony/org/:orgId", requireAuth, async (req: any, res) => {
    try {
      const userPilots = await storage.getPilotsByOwner(req.userEmail);
      const hasOrgAccess = userPilots.some(p => p.orgId === req.params.orgId);
      if (!hasOrgAccess) {
        return res.status(403).json({ error: "Access denied - no pilots in this organization" });
      }

      const testimonies = await storage.getAnonymousTestimonyByOrg(req.params.orgId);
      
      // Return only essential fields (no IDs for extra privacy)
      const sanitized = testimonies.map(t => ({
        harmCategory: t.harmCategory,
        testimony: t.testimony,
        accessibilityNeeds: t.accessibilityNeeds,
        submittedAt: t.submittedAt,
      }));
      
      res.json({ orgId: req.params.orgId, count: sanitized.length, testimonies: sanitized });
    } catch (error) {
      console.error("Get org testimony error:", error);
      res.status(500).json({ error: "Failed to fetch testimonies" });
    }
  });

  return httpServer;
}
