import { type Ledger, type InsertLedger, type Party, type InsertParty, type Voucher, type InsertVoucher, type StockItem, type InsertStockItem, type ApiKey, type InsertApiKey, type Webhook, type InsertWebhook } from "@shared/schema";
import { db } from "./db";
import { ledgers, parties, vouchers, stockItems, apiKeys, webhooks } from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";
import { createHash, randomBytes } from "crypto";
import { randomUUID } from "crypto";

export interface IStorage {
  // Ledgers
  getLedgers(): Promise<Ledger[]>;
  getLedger(id: string): Promise<Ledger | undefined>;
  createLedger(ledger: InsertLedger): Promise<Ledger>;
  updateLedgerBalance(id: string, balance: string): Promise<void>;

  // Parties
  getParties(): Promise<Party[]>;
  getParty(id: string): Promise<Party | undefined>;
  createParty(party: InsertParty): Promise<Party>;
  updatePartyOutstanding(id: string, outstanding: string): Promise<void>;

  // Vouchers
  getVouchers(): Promise<Voucher[]>;
  getVoucher(id: string): Promise<Voucher | undefined>;
  createVoucher(voucher: InsertVoucher): Promise<Voucher>;

  // Stock Items
  getStockItems(): Promise<StockItem[]>;
  getStockItem(id: string): Promise<StockItem | undefined>;
  createStockItem(stockItem: InsertStockItem): Promise<StockItem>;
  updateStockItem(id: string, updates: Partial<StockItem>): Promise<StockItem | undefined>;
  deleteStockItem(id: string): Promise<void>;

  // API Keys
  getApiKeys(): Promise<ApiKey[]>;
  getApiKey(id: string): Promise<ApiKey | undefined>;
  createApiKey(apiKey: InsertApiKey): Promise<{ apiKey: ApiKey; fullKey: string }>;
  revokeApiKey(id: string): Promise<void>;
  verifyApiKey(key: string): Promise<ApiKey | null>;
  incrementApiKeyUsage(id: string): Promise<void>;

  // Webhooks
  getWebhooks(): Promise<Webhook[]>;
  getWebhook(id: string): Promise<Webhook | undefined>;
  createWebhook(webhook: InsertWebhook): Promise<Webhook>;
  deleteWebhook(id: string): Promise<void>;
  updateWebhookStats(id: string, success: boolean): Promise<void>;
}

export class PostgresStorage implements IStorage {
  // Ledger methods
  async getLedgers(): Promise<Ledger[]> {
    return await db.select().from(ledgers);
  }

  async getLedger(id: string): Promise<Ledger | undefined> {
    const result = await db.select().from(ledgers).where(eq(ledgers.id, id));
    return result[0];
  }

  async createLedger(insertLedger: InsertLedger): Promise<Ledger> {
    const result = await db.insert(ledgers).values(insertLedger).returning();
    return result[0];
  }

  async updateLedgerBalance(id: string, balance: string): Promise<void> {
    await db.update(ledgers).set({ balance }).where(eq(ledgers.id, id));
  }

  // Party methods
  async getParties(): Promise<Party[]> {
    return await db.select().from(parties);
  }

  async getParty(id: string): Promise<Party | undefined> {
    const result = await db.select().from(parties).where(eq(parties.id, id));
    return result[0];
  }

  async createParty(insertParty: InsertParty): Promise<Party> {
    const result = await db.insert(parties).values(insertParty).returning();
    return result[0];
  }

  async updatePartyOutstanding(id: string, outstanding: string): Promise<void> {
    await db.update(parties).set({ outstanding }).where(eq(parties.id, id));
  }

  // Voucher methods
  async getVouchers(): Promise<Voucher[]> {
    return await db.select().from(vouchers).orderBy(sql`${vouchers.createdAt} desc`);
  }

  async getVoucher(id: string): Promise<Voucher | undefined> {
    const result = await db.select().from(vouchers).where(eq(vouchers.id, id));
    return result[0];
  }

  async createVoucher(insertVoucher: InsertVoucher): Promise<Voucher> {
    const result = await db.insert(vouchers).values(insertVoucher).returning();
    return result[0];
  }

  // Stock Item methods
  async getStockItems(): Promise<StockItem[]> {
    return await db.select().from(stockItems);
  }

  async getStockItem(id: string): Promise<StockItem | undefined> {
    const result = await db.select().from(stockItems).where(eq(stockItems.id, id));
    return result[0];
  }

  async createStockItem(insertStockItem: InsertStockItem): Promise<StockItem> {
    const result = await db.insert(stockItems).values(insertStockItem).returning();
    return result[0];
  }

  async updateStockItem(id: string, updates: Partial<StockItem>): Promise<StockItem | undefined> {
    const result = await db.update(stockItems).set(updates).where(eq(stockItems.id, id)).returning();
    return result[0];
  }

  async deleteStockItem(id: string): Promise<void> {
    await db.delete(stockItems).where(eq(stockItems.id, id));
  }

  // API Key methods
  async getApiKeys(): Promise<ApiKey[]> {
    return await db.select().from(apiKeys).where(eq(apiKeys.isActive, 1));
  }

  async getApiKey(id: string): Promise<ApiKey | undefined> {
    const result = await db.select().from(apiKeys).where(eq(apiKeys.id, id));
    return result[0];
  }

  async createApiKey(insertApiKey: InsertApiKey): Promise<{ apiKey: ApiKey; fullKey: string }> {
    const keyPrefix = insertApiKey.keyPrefix;
    const randomPart = randomBytes(24).toString('base64url'); // URL-safe base64
    const fullKey = `${keyPrefix}_${randomPart}`;
    const keyHash = createHash('sha256').update(fullKey).digest('hex');
    const lastFour = randomPart.slice(-4);

    const apiKeyData = {
      name: insertApiKey.name,
      keyPrefix: insertApiKey.keyPrefix,
      keyHash,
      lastFour,
      createdAt: new Date(),
      lastUsedAt: null,
      requestCount: 0,
      isActive: 1,
    };

    const result = await db.insert(apiKeys).values(apiKeyData).returning();
    return { apiKey: result[0], fullKey };
  }

  async revokeApiKey(id: string): Promise<void> {
    await db.update(apiKeys).set({ isActive: 0 }).where(eq(apiKeys.id, id));
  }

  async verifyApiKey(key: string): Promise<ApiKey | null> {
    const keyHash = createHash('sha256').update(key).digest('hex');
    const result = await db.select().from(apiKeys).where(
      and(eq(apiKeys.keyHash, keyHash), eq(apiKeys.isActive, 1))
    );
    return result[0] || null;
  }

  async incrementApiKeyUsage(id: string): Promise<void> {
    await db.update(apiKeys)
      .set({
        requestCount: sql`${apiKeys.requestCount} + 1`,
        lastUsedAt: new Date(),
      })
      .where(eq(apiKeys.id, id));
  }

  // Webhook methods
  async getWebhooks(): Promise<Webhook[]> {
    return await db.select().from(webhooks).where(eq(webhooks.isActive, 1));
  }

  async getWebhook(id: string): Promise<Webhook | undefined> {
    const result = await db.select().from(webhooks).where(eq(webhooks.id, id));
    return result[0];
  }

  async createWebhook(insertWebhook: InsertWebhook): Promise<Webhook> {
    const secret = randomBytes(32).toString('hex'); // Webhook signing secret

    const webhookData = {
      url: insertWebhook.url,
      events: insertWebhook.events,
      secret,
      isActive: 1,
      createdAt: new Date(),
      lastDeliveryAt: null,
      successCount: 0,
      failureCount: 0,
    };

    const result = await db.insert(webhooks).values(webhookData).returning();
    return result[0];
  }

  async deleteWebhook(id: string): Promise<void> {
    await db.update(webhooks).set({ isActive: 0 }).where(eq(webhooks.id, id));
  }

  async updateWebhookStats(id: string, success: boolean): Promise<void> {
    const updateData = {
      lastDeliveryAt: new Date(),
      ...(success
        ? { successCount: sql`${webhooks.successCount} + 1` }
        : { failureCount: sql`${webhooks.failureCount} + 1` }
      ),
    };

    await db.update(webhooks).set(updateData).where(eq(webhooks.id, id));
  }
}
