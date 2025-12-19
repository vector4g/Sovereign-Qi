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
  orgName: text("org_name").notNull(),
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
