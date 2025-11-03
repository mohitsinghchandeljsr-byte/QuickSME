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

export type InsertLedger = z.infer<typeof insertLedgerSchema>;
export type Ledger = typeof ledgers.$inferSelect;

export type InsertParty = z.infer<typeof insertPartySchema>;
export type Party = typeof parties.$inferSelect;

export type InsertVoucher = z.infer<typeof insertVoucherSchema>;
export type Voucher = typeof vouchers.$inferSelect;

export type InsertStockItem = z.infer<typeof insertStockItemSchema>;
export type StockItem = typeof stockItems.$inferSelect;
