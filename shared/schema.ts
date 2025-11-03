import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const ledgers = pgTable("ledgers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  group: text("group").notNull(),
  balance: decimal("balance", { precision: 15, scale: 2 }).notNull().default("0"),
  type: text("type").notNull(), // 'Dr' or 'Cr'
});

export const parties = pgTable("parties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'Customer' or 'Vendor'
  gstin: text("gstin"),
  phone: text("phone"),
  email: text("email"),
  outstanding: decimal("outstanding", { precision: 15, scale: 2 }).notNull().default("0"),
});

export const vouchers = pgTable("vouchers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  voucherType: text("voucher_type").notNull(),
  date: text("date").notNull(),
  partyId: varchar("party_id"),
  ledgerId: varchar("ledger_id"),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  narration: text("narration"),
  cgst: decimal("cgst", { precision: 15, scale: 2 }).default("0"),
  sgst: decimal("sgst", { precision: 15, scale: 2 }).default("0"),
  igst: decimal("igst", { precision: 15, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const stockItems = pgTable("stock_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  code: text("code").notNull(),
  category: text("category").notNull(),
  unit: text("unit").notNull(),
  quantity: decimal("quantity", { precision: 15, scale: 2 }).notNull().default("0"),
  purchasePrice: decimal("purchase_price", { precision: 15, scale: 2 }).notNull(),
  salePrice: decimal("sale_price", { precision: 15, scale: 2 }).notNull(),
  reorderLevel: decimal("reorder_level", { precision: 15, scale: 2 }).default("0"),
  hsnCode: text("hsn_code"),
  gstRate: decimal("gst_rate", { precision: 5, scale: 2 }).default("0"),
});

export const apiKeys = pgTable("api_keys", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  keyPrefix: text("key_prefix").notNull(), // e.g., "sk_live" or "sk_test"
  keyHash: text("key_hash").notNull(), // Hashed API key for security
  lastFour: text("last_four").notNull(), // Last 4 characters for display
  createdAt: timestamp("created_at").defaultNow(),
  lastUsedAt: timestamp("last_used_at"),
  requestCount: integer("request_count").notNull().default(0),
  isActive: integer("is_active").notNull().default(1), // 1 = active, 0 = revoked
});

export const webhooks = pgTable("webhooks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  url: text("url").notNull(),
  events: text("events").array().notNull(), // Array of event types
  secret: text("secret").notNull(), // Webhook signing secret
  isActive: integer("is_active").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
  lastDeliveryAt: timestamp("last_delivery_at"),
  successCount: integer("success_count").notNull().default(0),
  failureCount: integer("failure_count").notNull().default(0),
});

export const insertLedgerSchema = createInsertSchema(ledgers).omit({
  id: true,
});

export const insertPartySchema = createInsertSchema(parties).omit({
  id: true,
});

export const insertVoucherSchema = createInsertSchema(vouchers).omit({
  id: true,
  createdAt: true,
});

export const insertStockItemSchema = createInsertSchema(stockItems).omit({
  id: true,
});

export const insertApiKeySchema = createInsertSchema(apiKeys).omit({
  id: true,
  keyHash: true,
  lastFour: true,
  createdAt: true,
  lastUsedAt: true,
  requestCount: true,
  isActive: true,
}).extend({
  name: z.string().min(1, "Name is required"),
  keyPrefix: z.string().regex(/^sk_(live|test)$/, "Invalid key prefix"),
});

export const insertWebhookSchema = createInsertSchema(webhooks).omit({
  id: true,
  createdAt: true,
  lastDeliveryAt: true,
  successCount: true,
  failureCount: true,
  isActive: true,
  secret: true,
}).extend({
  url: z.string().url("Must be a valid URL"),
  events: z.array(z.string()).min(1, "At least one event is required"),
});

export type InsertLedger = z.infer<typeof insertLedgerSchema>;
export type Ledger = typeof ledgers.$inferSelect;

export type InsertParty = z.infer<typeof insertPartySchema>;
export type Party = typeof parties.$inferSelect;

export type InsertVoucher = z.infer<typeof insertVoucherSchema>;
export type Voucher = typeof vouchers.$inferSelect;

export type InsertStockItem = z.infer<typeof insertStockItemSchema>;
export type StockItem = typeof stockItems.$inferSelect;

export type InsertApiKey = z.infer<typeof insertApiKeySchema>;
export type ApiKey = typeof apiKeys.$inferSelect;

export type InsertWebhook = z.infer<typeof insertWebhookSchema>;
export type Webhook = typeof webhooks.$inferSelect;
