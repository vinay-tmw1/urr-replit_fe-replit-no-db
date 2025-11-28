import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  serial,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Enums
export const userRoleEnum = pgEnum('user_role', ['super_admin', 'admin', 'user', 'rd_engineer', 'scientist']);
export const diamondStatusEnum = pgEnum('diamond_status', ['available', 'reserved', 'in_production', 'sold', 'grading']);
export const locationEnum = pgEnum('location', ['mumbai', 'hong_kong', 'dubai', 'antwerp', 'new_york', 'odisha']);
export const certificationEnum = pgEnum('certification', ['gia', 'igi', 'hrd', 'ggtl', 'sgl']);
export const shapeEnum = pgEnum('shape', ['round', 'princess', 'oval', 'marquise', 'emerald', 'heart', 'pear', 'cushion', 'radiant', 'asscher']);
export const colorGradeEnum = pgEnum('color_grade', ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']);
export const clarityGradeEnum = pgEnum('clarity_grade', ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'SI3']);
export const cutGradeEnum = pgEnum('cut_grade', ['excellent', 'very_good', 'good', 'fair', 'poor']);
export const projectStatusEnum = pgEnum('project_status', ['planning', 'active', 'on_hold', 'completed', 'cancelled']);
export const industrialApplicationEnum = pgEnum('industrial_application', ['semiconductor', 'cutting_tools', 'medical', 'optical', 'military', 'space', 'quantum_computing']);
export const growingMethodEnum = pgEnum('growing_method', ['cvd', 'hpht']);
export const equipmentStatusEnum = pgEnum('equipment_status', ['running', 'maintenance', 'offline']);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").default('user'),
  location: locationEnum("location").default('mumbai'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Diamond inventory
export const diamonds = pgTable("diamonds", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  diamondId: varchar("diamond_id").unique().notNull(), // DM-789123
  carat: decimal("carat", { precision: 6, scale: 3 }).notNull(),
  shape: shapeEnum("shape").notNull(),
  color: colorGradeEnum("color").notNull(),
  clarity: clarityGradeEnum("clarity").notNull(),
  cut: cutGradeEnum("cut"),
  certification: certificationEnum("certification"),
  certificateNumber: varchar("certificate_number"),
  location: locationEnum("location").notNull(),
  status: diamondStatusEnum("status").default('available'),
  price: decimal("price", { precision: 10, scale: 2 }),
  isRough: boolean("is_rough").default(false),
  parentRoughId: varchar("parent_rough_id"), // For tracking which rough diamond this came from
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// R&D Projects
export const rdProjects = pgTable("rd_projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  category: industrialApplicationEnum("category").notNull(),
  status: projectStatusEnum("status").default('planning'),
  leadResearcherId: varchar("lead_researcher_id").references(() => users.id),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  budget: decimal("budget", { precision: 12, scale: 2 }),
  progress: integer("progress").default(0), // 0-100
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Project team members
export const projectTeamMembers = pgTable("project_team_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => rdProjects.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  role: varchar("role"), // researcher, scientist, engineer
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Manufacturing planning
export const roughDiamonds = pgTable("rough_diamonds", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roughId: varchar("rough_id").unique().notNull(), // RD-2847
  carat: decimal("carat", { precision: 6, scale: 3 }).notNull(),
  color: colorGradeEnum("color"),
  clarity: clarityGradeEnum("clarity"),
  certification: certificationEnum("certification"),
  location: locationEnum("location").notNull(),
  status: varchar("status").default('planning'), // planning, in_production, completed
  estimatedYield: decimal("estimated_yield", { precision: 6, scale: 3 }),
  priority: varchar("priority").default('medium'), // low, medium, high, critical
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Cutting plans
export const cuttingPlans = pgTable("cutting_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roughDiamondId: varchar("rough_diamond_id").references(() => roughDiamonds.id).notNull(),
  planNumber: integer("plan_number").notNull(),
  targetShape: shapeEnum("target_shape").notNull(),
  estimatedCarat: decimal("estimated_carat", { precision: 6, scale: 3 }).notNull(),
  estimatedYield: decimal("estimated_yield", { precision: 5, scale: 2 }).notNull(), // percentage
  estimatedValue: decimal("estimated_value", { precision: 10, scale: 2 }),
  roi: decimal("roi", { precision: 8, scale: 2 }), // return on investment percentage
  isSelected: boolean("is_selected").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Growing equipment
export const growingEquipment = pgTable("growing_equipment", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  type: growingMethodEnum("type").notNull(),
  location: locationEnum("location").notNull(),
  status: equipmentStatusEnum("status").default('offline'),
  temperature: decimal("temperature", { precision: 6, scale: 2 }), // Celsius
  pressure: decimal("pressure", { precision: 6, scale: 2 }), // Torr
  runtime: integer("runtime"), // hours
  estimatedYield: decimal("estimated_yield", { precision: 6, scale: 3 }),
  capacity: decimal("capacity", { precision: 6, scale: 3 }), // carats per cycle
  nextMaintenanceDate: timestamp("next_maintenance_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Industrial applications tracking
export const industrialAllocations = pgTable("industrial_allocations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  application: industrialApplicationEnum("application").notNull(),
  allocatedCarats: decimal("allocated_carats", { precision: 8, scale: 3 }).notNull(),
  value: decimal("value", { precision: 12, scale: 2 }).notNull(),
  growthRate: decimal("growth_rate", { precision: 5, scale: 2 }), // percentage
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// University collaborations
export const collaborations = pgTable("collaborations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  institutionName: varchar("institution_name").notNull(),
  contactPerson: varchar("contact_person"),
  email: varchar("email"),
  projectId: varchar("project_id").references(() => rdProjects.id),
  status: varchar("status").default('active'), // active, pending, completed, cancelled
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projectsLead: many(rdProjects),
  teamMemberships: many(projectTeamMembers),
}));

export const rdProjectsRelations = relations(rdProjects, ({ one, many }) => ({
  leadResearcher: one(users, {
    fields: [rdProjects.leadResearcherId],
    references: [users.id],
  }),
  teamMembers: many(projectTeamMembers),
  collaborations: many(collaborations),
}));

export const projectTeamMembersRelations = relations(projectTeamMembers, ({ one }) => ({
  project: one(rdProjects, {
    fields: [projectTeamMembers.projectId],
    references: [rdProjects.id],
  }),
  user: one(users, {
    fields: [projectTeamMembers.userId],
    references: [users.id],
  }),
}));

export const roughDiamondsRelations = relations(roughDiamonds, ({ many }) => ({
  cuttingPlans: many(cuttingPlans),
}));

export const cuttingPlansRelations = relations(cuttingPlans, ({ one }) => ({
  roughDiamond: one(roughDiamonds, {
    fields: [cuttingPlans.roughDiamondId],
    references: [roughDiamonds.id],
  }),
}));

export const collaborationsRelations = relations(collaborations, ({ one }) => ({
  project: one(rdProjects, {
    fields: [collaborations.projectId],
    references: [rdProjects.id],
  }),
}));

// Insert schemas
export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  role: true,
  location: true,
});

export const insertDiamondSchema = createInsertSchema(diamonds).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRdProjectSchema = createInsertSchema(rdProjects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRoughDiamondSchema = createInsertSchema(roughDiamonds).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCuttingPlanSchema = createInsertSchema(cuttingPlans).omit({
  id: true,
  createdAt: true,
});

export const insertGrowingEquipmentSchema = createInsertSchema(growingEquipment).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Export types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type Diamond = typeof diamonds.$inferSelect;
export type InsertDiamond = z.infer<typeof insertDiamondSchema>;
export type RdProject = typeof rdProjects.$inferSelect;
export type InsertRdProject = z.infer<typeof insertRdProjectSchema>;
export type RoughDiamond = typeof roughDiamonds.$inferSelect;
export type InsertRoughDiamond = z.infer<typeof insertRoughDiamondSchema>;
export type CuttingPlan = typeof cuttingPlans.$inferSelect;
export type InsertCuttingPlan = z.infer<typeof insertCuttingPlanSchema>;
export type GrowingEquipment = typeof growingEquipment.$inferSelect;
export type InsertGrowingEquipment = z.infer<typeof insertGrowingEquipmentSchema>;
export type ProjectTeamMember = typeof projectTeamMembers.$inferSelect;
export type IndustrialAllocation = typeof industrialAllocations.$inferSelect;
export type Collaboration = typeof collaborations.$inferSelect;
