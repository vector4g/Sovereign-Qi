import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPilotSchema, insertGovernanceSignalSchema } from "@shared/schema";
import { randomBytes } from "crypto";
import { generateCouncilAdviceWithFallback } from "./lib/agents";
import { runQiSimulation } from "./lib/simulator";

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

  app.post("/api/pilots", requireAuth, async (req: any, res) => {
    try {
      const validatedData = insertPilotSchema.parse({
        ...req.body,
        ownerEmail: req.userEmail,
      });

      const pilot = await storage.createPilot(validatedData);
      res.status(201).json(pilot);
    } catch (error: any) {
      console.error("Create pilot error:", error);
      res.status(400).json({ error: error.message || "Invalid pilot data" });
    }
  });

  app.get("/api/pilots", requireAuth, async (req: any, res) => {
    try {
      const pilots = await storage.getPilotsByOwner(req.userEmail);
      res.json(pilots);
    } catch (error) {
      console.error("Get pilots error:", error);
      res.status(500).json({ error: "Failed to fetch pilots" });
    }
  });

  app.get("/api/pilots/:id", requireAuth, async (req: any, res) => {
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

  app.post("/api/pilots/:id/advise", requireAuth, async (req: any, res) => {
    try {
      const pilot = await storage.getPilot(req.params.id);
      if (!pilot) {
        return res.status(404).json({ error: "Pilot not found" });
      }
      if (pilot.ownerEmail !== req.userEmail) {
        return res.status(403).json({ error: "Access denied" });
      }

      // Fetch Morpheus governance signals for this pilot's org
      const rawSignals = await storage.getGovernanceSignalsByOrg(pilot.orgName);
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
  app.post("/api/signals", requireAuth, async (req: any, res) => {
    try {
      const validatedData = insertGovernanceSignalSchema.parse(req.body);
      
      // Authorization: user must own at least one pilot in this org to ingest signals
      const userPilots = await storage.getPilotsByOwner(req.userEmail);
      const hasOrgAccess = userPilots.some(p => p.orgName === validatedData.orgId);
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

  app.get("/api/signals/org/:orgId", requireAuth, async (req: any, res) => {
    try {
      // Authorization: user must own at least one pilot in this org
      const userPilots = await storage.getPilotsByOwner(req.userEmail);
      const hasOrgAccess = userPilots.some(p => p.orgName === req.params.orgId);
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

  return httpServer;
}
