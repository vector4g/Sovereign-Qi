import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage for email-only auth
export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey(),
  email: text("email").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const insertSessionSchema = createInsertSchema(sessions);
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;

// Pilot project types enum
export const pilotTypeEnum = pgEnum("pilot_type", ["ENTERPRISE", "CITY", "HEALTHCARE"]);
export const pilotStatusEnum = pgEnum("pilot_status", ["DRAFT", "CONFIGURED", "RUNNING", "COMPLETED"]);

// Pilot projects table - GDPR-aligned: minimal data, purpose-limited
export const pilots = pgTable("pilots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerEmail: text("owner_email").notNull(), // Email session identifier
  name: text("name").notNull(),
  type: pilotTypeEnum("type").notNull(),
  orgId: text("org_id").notNull().default(""), // Canonical org identifier for Morpheus signal matching
  orgName: text("org_name").notNull(), // Display name
  region: text("region").notNull(),
  primaryObjective: text("primary_objective").notNull(),
  majorityLogicDesc: text("majority_logic_desc").notNull(),
  qiLogicDesc: text("qi_logic_desc").notNull(),
  status: pilotStatusEnum("status").notNull().default("DRAFT"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPilotSchema = createInsertSchema(pilots).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectPilotSchema = createSelectSchema(pilots);

export type InsertPilot = z.infer<typeof insertPilotSchema>;
export type Pilot = typeof pilots.$inferSelect;

// Simulation results table
export const simulations = pgTable("simulations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pilotId: varchar("pilot_id").notNull().references(() => pilots.id, { onDelete: "cascade" }),
  scenarioAInnovation: text("scenario_a_innovation").notNull(),
  scenarioABurnout: text("scenario_a_burnout").notNull(),
  scenarioALiability: text("scenario_a_liability").notNull(),
  scenarioBInnovation: text("scenario_b_innovation").notNull(),
  scenarioBBurnout: text("scenario_b_burnout").notNull(),
  scenarioBLiability: text("scenario_b_liability").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSimulationSchema = createInsertSchema(simulations).omit({
  id: true,
  createdAt: true,
});

export type InsertSimulation = z.infer<typeof insertSimulationSchema>;
export type Simulation = typeof simulations.$inferSelect;

// Chat tables for Anthropic integration
export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// Council decision log - persistent governance trail
export const councilStatusEnum = pgEnum("council_status", ["APPROVE", "REVISE", "BLOCK"]);

export const councilDecisions = pgTable("council_decisions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pilotId: varchar("pilot_id").notNull().references(() => pilots.id, { onDelete: "cascade" }),
  status: councilStatusEnum("status").notNull(),
  adviceSummary: text("advice_summary").notNull(),
  requiredChanges: text("required_changes").array().notNull(),
  riskFlags: text("risk_flags").array().notNull(),
  curbCutBenefits: text("curb_cut_benefits").array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCouncilDecisionSchema = createInsertSchema(councilDecisions).omit({
  id: true,
  createdAt: true,
});

export type CouncilDecision = typeof councilDecisions.$inferSelect;
export type InsertCouncilDecision = z.infer<typeof insertCouncilDecisionSchema>;

// Governance signals from Morpheus pipeline - dog whistle detection
export const signalCategoryEnum = pgEnum("signal_category", [
  "dog_whistle",
  "identity_targeting", 
  "surveillance_concern",
  "policy_subversion",
  "queer_coded_hostility",
  "ableist_language",
  "racial_microaggression"
]);

export const governanceSignals = pgTable("governance_signals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orgId: text("org_id").notNull(),
  pilotId: varchar("pilot_id").references(() => pilots.id, { onDelete: "set null" }),
  sourceChannel: text("source_channel"),
  category: signalCategoryEnum("category").notNull(),
  score: text("score").notNull(),
  summary: text("summary").notNull(),
  patternCount: text("pattern_count").default("1"),
  timeWindow: text("time_window"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGovernanceSignalSchema = createInsertSchema(governanceSignals).omit({
  id: true,
  createdAt: true,
});

export type GovernanceSignal = typeof governanceSignals.$inferSelect;
export type InsertGovernanceSignal = z.infer<typeof insertGovernanceSignalSchema>;

// Anonymous testimony - zero-knowledge submission (no auth required)
export const anonymousTestimony = pgTable("anonymous_testimony", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orgId: text("org_id").notNull(), // Which org this testimony relates to
  harmCategory: text("harm_category").notNull(), // Type of harm experienced
  testimony: text("testimony").notNull(), // The actual testimony (max 2000 chars)
  accessibilityNeeds: text("accessibility_needs"), // Optional accessibility constraints
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  // Zero-knowledge: no IP, no user agent, no session - only content
});

export const insertAnonymousTestimonySchema = createInsertSchema(anonymousTestimony).omit({
  id: true,
  submittedAt: true,
});

export type AnonymousTestimony = typeof anonymousTestimony.$inferSelect;
export type InsertAnonymousTestimony = z.infer<typeof insertAnonymousTestimonySchema>;
