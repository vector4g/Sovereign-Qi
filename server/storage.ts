import { 
  type Pilot, 
  type InsertPilot,
  type Session,
  type InsertSession,
  type Simulation,
  type InsertSimulation,
  type CouncilDecision,
  type InsertCouncilDecision,
  pilots,
  sessions,
  simulations,
  councilDecisions
} from "@shared/schema";
import { db } from "../db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // Session management (email-only auth)
  createSession(session: InsertSession): Promise<Session>;
  getSession(id: string): Promise<Session | undefined>;
  deleteSession(id: string): Promise<void>;
  
  // Pilot CRUD - purpose-limited to simulation configuration
  createPilot(pilot: InsertPilot): Promise<Pilot>;
  getPilotsByOwner(ownerEmail: string): Promise<Pilot[]>;
  getPilot(id: string): Promise<Pilot | undefined>;
  updatePilotStatus(id: string, status: "DRAFT" | "CONFIGURED" | "RUNNING" | "COMPLETED"): Promise<void>;
  
  // Simulation results
  createSimulation(simulation: InsertSimulation): Promise<Simulation>;
  getSimulationByPilot(pilotId: string): Promise<Simulation | undefined>;
  
  // Council decision log - governance trail
  createCouncilDecision(decision: InsertCouncilDecision): Promise<CouncilDecision>;
  getCouncilDecisionsByPilot(pilotId: string): Promise<CouncilDecision[]>;
}

export class DatabaseStorage implements IStorage {
  // Sessions
  async createSession(session: InsertSession): Promise<Session> {
    const [result] = await db.insert(sessions).values(session).returning();
    return result;
  }

  async getSession(id: string): Promise<Session | undefined> {
    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, id))
      .limit(1);
    return session;
  }

  async deleteSession(id: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, id));
  }

  // Pilots
  async createPilot(pilot: InsertPilot): Promise<Pilot> {
    const [result] = await db.insert(pilots).values(pilot).returning();
    return result;
  }

  async getPilotsByOwner(ownerEmail: string): Promise<Pilot[]> {
    return await db
      .select()
      .from(pilots)
      .where(eq(pilots.ownerEmail, ownerEmail))
      .orderBy(desc(pilots.createdAt));
  }

  async getPilot(id: string): Promise<Pilot | undefined> {
    const [pilot] = await db
      .select()
      .from(pilots)
      .where(eq(pilots.id, id))
      .limit(1);
    return pilot;
  }

  async updatePilotStatus(id: string, status: "DRAFT" | "CONFIGURED" | "RUNNING" | "COMPLETED"): Promise<void> {
    await db
      .update(pilots)
      .set({ status, updatedAt: new Date() })
      .where(eq(pilots.id, id));
  }

  // Simulations
  async createSimulation(simulation: InsertSimulation): Promise<Simulation> {
    const [result] = await db.insert(simulations).values(simulation).returning();
    return result;
  }

  async getSimulationByPilot(pilotId: string): Promise<Simulation | undefined> {
    const [simulation] = await db
      .select()
      .from(simulations)
      .where(eq(simulations.pilotId, pilotId))
      .limit(1);
    return simulation;
  }

  // Council Decisions - Governance Trail
  async createCouncilDecision(decision: InsertCouncilDecision): Promise<CouncilDecision> {
    const [result] = await db.insert(councilDecisions).values(decision).returning();
    return result;
  }

  async getCouncilDecisionsByPilot(pilotId: string): Promise<CouncilDecision[]> {
    return await db
      .select()
      .from(councilDecisions)
      .where(eq(councilDecisions.pilotId, pilotId))
      .orderBy(desc(councilDecisions.createdAt));
  }
}

export const storage = new DatabaseStorage();
