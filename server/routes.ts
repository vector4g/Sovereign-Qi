import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPilotSchema } from "@shared/schema";
import { randomBytes } from "crypto";

// Session middleware
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
  
  // Email-only authentication
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || typeof email !== "string" || !email.includes("@")) {
        return res.status(400).json({ error: "Valid email required" });
      }

      const sessionId = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

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

  // Pilot endpoints - GDPR-aligned, purpose-limited
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

  // Simulation endpoint - generates A/B comparison
  app.post("/api/pilots/:id/run", requireAuth, async (req: any, res) => {
    try {
      const pilot = await storage.getPilot(req.params.id);
      if (!pilot) {
        return res.status(404).json({ error: "Pilot not found" });
      }
      if (pilot.ownerEmail !== req.userEmail) {
        return res.status(403).json({ error: "Access denied" });
      }

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate simulation results
      const simulation = await storage.createSimulation({
        pilotId: pilot.id,
        scenarioAInnovation: "1.0",
        scenarioABurnout: "0.8",
        scenarioALiability: "0.7",
        scenarioBInnovation: "1.4",
        scenarioBBurnout: "0.3",
        scenarioBLiability: "0.1",
      });

      await storage.updatePilotStatus(pilot.id, "COMPLETED");

      res.json({
        scenarioA: {
          label: "Majority Logic",
          innovationIndex: parseFloat(simulation.scenarioAInnovation),
          burnoutIndex: parseFloat(simulation.scenarioABurnout),
          liabilityIndex: parseFloat(simulation.scenarioALiability),
        },
        scenarioB: {
          label: "Qi Logic",
          innovationIndex: parseFloat(simulation.scenarioBInnovation),
          burnoutIndex: parseFloat(simulation.scenarioBBurnout),
          liabilityIndex: parseFloat(simulation.scenarioBLiability),
        },
      });
    } catch (error) {
      console.error("Run simulation error:", error);
      res.status(500).json({ error: "Simulation failed" });
    }
  });

  return httpServer;
}
