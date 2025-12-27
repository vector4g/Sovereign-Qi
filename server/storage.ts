import { 
  type Pilot, 
  type InsertPilot,
  type Session,
  type InsertSession,
  type Simulation,
  type InsertSimulation,
  type CouncilDecision,
  type InsertCouncilDecision,
  type GovernanceSignal,
  type InsertGovernanceSignal,
  type AnonymousTestimony,
  type InsertAnonymousTestimony,
  pilots,
  sessions,
  simulations,
  councilDecisions,
  governanceSignals,
  anonymousTestimony
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
  
  // Governance signals from Morpheus pipeline
  createGovernanceSignal(signal: InsertGovernanceSignal): Promise<GovernanceSignal>;
  getGovernanceSignalsByOrg(orgId: string): Promise<GovernanceSignal[]>;
  getGovernanceSignalsByPilot(pilotId: string): Promise<GovernanceSignal[]>;
  
  // Anonymous testimony - zero-knowledge
  createAnonymousTestimony(testimony: InsertAnonymousTestimony): Promise<AnonymousTestimony>;
  getAnonymousTestimonyByOrg(orgId: string): Promise<AnonymousTestimony[]>;
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

  // Governance Signals - Morpheus Pipeline Integration
  async createGovernanceSignal(signal: InsertGovernanceSignal): Promise<GovernanceSignal> {
    const [result] = await db.insert(governanceSignals).values(signal).returning();
    return result;
  }

  async getGovernanceSignalsByOrg(orgId: string): Promise<GovernanceSignal[]> {
    return await db
      .select()
      .from(governanceSignals)
      .where(eq(governanceSignals.orgId, orgId))
      .orderBy(desc(governanceSignals.createdAt));
  }

  async getGovernanceSignalsByPilot(pilotId: string): Promise<GovernanceSignal[]> {
    return await db
      .select()
      .from(governanceSignals)
      .where(eq(governanceSignals.pilotId, pilotId))
      .orderBy(desc(governanceSignals.createdAt));
  }

  // Anonymous Testimony - Zero-Knowledge
  async createAnonymousTestimony(testimony: InsertAnonymousTestimony): Promise<AnonymousTestimony> {
    const [result] = await db.insert(anonymousTestimony).values(testimony).returning();
    return result;
  }

  async getAnonymousTestimonyByOrg(orgId: string): Promise<AnonymousTestimony[]> {
    return await db
      .select()
      .from(anonymousTestimony)
      .where(eq(anonymousTestimony.orgId, orgId))
      .orderBy(desc(anonymousTestimony.submittedAt));
  }
}

export const storage = new DatabaseStorage();
