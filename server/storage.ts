import { type Ledger, type InsertLedger, type Party, type InsertParty, type Voucher, type InsertVoucher, type StockItem, type InsertStockItem, type ApiKey, type InsertApiKey, type Webhook, type InsertWebhook } from "@shared/schema";
import { randomUUID } from "crypto";
import { createHash, randomBytes } from "crypto";
import { PostgresStorage } from "./storage-postgres";

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

export class MemStorage implements IStorage {

  private ledgers: Map<string, Ledger>;
  private parties: Map<string, Party>;
  private vouchers: Map<string, Voucher>;
  private stockItems: Map<string, StockItem>;
  private apiKeys: Map<string, ApiKey>;
  private webhooks: Map<string, Webhook>;

  constructor() {
    this.ledgers = new Map();
    this.parties = new Map();
    this.vouchers = new Map();
    this.stockItems = new Map();
    this.apiKeys = new Map();
    this.webhooks = new Map();
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample ledgers
    const sampleLedgers: Ledger[] = [
      { id: randomUUID(), name: "Cash in Hand", group: "Cash-in-Hand", balance: "125000", type: "Dr" },
      { id: randomUUID(), name: "HDFC Bank", group: "Bank Accounts", balance: "287500", type: "Dr" },
      { id: randomUUID(), name: "Sales Revenue", group: "Sales Accounts", balance: "1245000", type: "Cr" },
      { id: randomUUID(), name: "Purchase Account", group: "Purchase Accounts", balance: "832500", type: "Dr" },
      { id: randomUUID(), name: "Electricity Expense", group: "Indirect Expenses", balance: "15200", type: "Dr" },
      { id: randomUUID(), name: "Rent Expense", group: "Indirect Expenses", balance: "45000", type: "Dr" },
      { id: randomUUID(), name: "GST Input", group: "Duties & Taxes", balance: "62400", type: "Dr" },
      { id: randomUUID(), name: "GST Output", group: "Duties & Taxes", balance: "118800", type: "Cr" },
    ];
    sampleLedgers.forEach(ledger => this.ledgers.set(ledger.id, ledger));

    // Sample parties
    const sampleParties: Party[] = [
      {
        id: randomUUID(),
        name: "ABC Suppliers",
        type: "Vendor",
        gstin: "24AABCU9603R1ZM",
        phone: "+91 98765 43210",
        email: "contact@abcsuppliers.com",
        outstanding: "-45000",
      },
      {
        id: randomUUID(),
        name: "XYZ Customer",
        type: "Customer",
        gstin: "27AAPFU0939F1ZV",
        phone: "+91 98765 43211",
        email: "billing@xyzcustomer.com",
        outstanding: "65000",
      },
      {
        id: randomUUID(),
        name: "PQR Vendors",
        type: "Vendor",
        gstin: "29AABCT1332L1ZG",
        phone: "+91 98765 43212",
        email: "sales@pqrvendors.com",
        outstanding: "-28500",
      },
      {
        id: randomUUID(),
        name: "LMN Client",
        type: "Customer",
        gstin: "07AACCI3788N1Z1",
        phone: "+91 98765 43213",
        email: "accounts@lmnclient.com",
        outstanding: "92000",
      },
    ];
    sampleParties.forEach(party => this.parties.set(party.id, party));

    // Sample stock items
    const sampleStockItems: StockItem[] = [
      {
        id: randomUUID(),
        name: "Laptop - Dell XPS 15",
        code: "DELL-XPS-15",
        category: "Electronics",
        unit: "Pcs",
        quantity: "25",
        purchasePrice: "85000",
        salePrice: "95000",
        reorderLevel: "10",
        hsnCode: "8471",
        gstRate: "18",
      },
      {
        id: randomUUID(),
        name: "Office Chair - Executive",
        code: "CHAIR-EXE-001",
        category: "Furniture",
        unit: "Pcs",
        quantity: "50",
        purchasePrice: "4500",
        salePrice: "6500",
        reorderLevel: "15",
        hsnCode: "9401",
        gstRate: "18",
      },
      {
        id: randomUUID(),
        name: "A4 Paper - 500 Sheets",
        code: "PAPER-A4-500",
        category: "Stationery",
        unit: "Reams",
        quantity: "150",
        purchasePrice: "180",
        salePrice: "250",
        reorderLevel: "50",
        hsnCode: "4802",
        gstRate: "12",
      },
      {
        id: randomUUID(),
        name: "Wireless Mouse",
        code: "MOUSE-WL-001",
        category: "Electronics",
        unit: "Pcs",
        quantity: "8",
        purchasePrice: "350",
        salePrice: "550",
        reorderLevel: "20",
        hsnCode: "8471",
        gstRate: "18",
      },
      {
        id: randomUUID(),
        name: "Whiteboard Marker",
        code: "MARKER-WB-BLK",
        category: "Stationery",
        unit: "Pcs",
        quantity: "200",
        purchasePrice: "15",
        salePrice: "25",
        reorderLevel: "100",
        hsnCode: "9608",
        gstRate: "12",
      },
    ];
    sampleStockItems.forEach(item => this.stockItems.set(item.id, item));
  }

  // Ledger methods
  async getLedgers(): Promise<Ledger[]> {
    return Array.from(this.ledgers.values());
  }

  async getLedger(id: string): Promise<Ledger | undefined> {
    return this.ledgers.get(id);
  }

  async createLedger(insertLedger: InsertLedger): Promise<Ledger> {
    const id = randomUUID();
    const ledger: Ledger = {
      id,
      name: insertLedger.name,
      group: insertLedger.group,
      balance: insertLedger.balance || "0",
      type: insertLedger.type,
    };
    this.ledgers.set(id, ledger);
    return ledger;
  }

  async updateLedgerBalance(id: string, balance: string): Promise<void> {
    const ledger = this.ledgers.get(id);
    if (ledger) {
      ledger.balance = balance;
      this.ledgers.set(id, ledger);
    }
  }

  // Party methods
  async getParties(): Promise<Party[]> {
    return Array.from(this.parties.values());
  }

  async getParty(id: string): Promise<Party | undefined> {
    return this.parties.get(id);
  }

  async createParty(insertParty: InsertParty): Promise<Party> {
    const id = randomUUID();
    const party: Party = {
      id,
      name: insertParty.name,
      type: insertParty.type,
      gstin: insertParty.gstin || null,
      phone: insertParty.phone || null,
      email: insertParty.email || null,
      outstanding: insertParty.outstanding || "0",
    };
    this.parties.set(id, party);
    return party;
  }

  async updatePartyOutstanding(id: string, outstanding: string): Promise<void> {
    const party = this.parties.get(id);
    if (party) {
      party.outstanding = outstanding;
      this.parties.set(id, party);
    }
  }

  // Voucher methods
  async getVouchers(): Promise<Voucher[]> {
    return Array.from(this.vouchers.values()).sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    });
  }

  async getVoucher(id: string): Promise<Voucher | undefined> {
    return this.vouchers.get(id);
  }

  async createVoucher(insertVoucher: InsertVoucher): Promise<Voucher> {
    const id = randomUUID();
    const voucher: Voucher = {
      id,
      voucherType: insertVoucher.voucherType,
      date: insertVoucher.date,
      partyId: insertVoucher.partyId || null,
      ledgerId: insertVoucher.ledgerId || null,
      amount: insertVoucher.amount,
      narration: insertVoucher.narration || null,
      cgst: insertVoucher.cgst || null,
      sgst: insertVoucher.sgst || null,
      igst: insertVoucher.igst || null,
      createdAt: new Date(),
    };
    this.vouchers.set(id, voucher);
    return voucher;
  }

  // Stock Item methods
  async getStockItems(): Promise<StockItem[]> {
    return Array.from(this.stockItems.values());
  }

  async getStockItem(id: string): Promise<StockItem | undefined> {
    return this.stockItems.get(id);
  }

  async createStockItem(insertStockItem: InsertStockItem): Promise<StockItem> {
    const id = randomUUID();
    const stockItem: StockItem = {
      id,
      name: insertStockItem.name,
      code: insertStockItem.code,
      category: insertStockItem.category,
      unit: insertStockItem.unit,
      quantity: insertStockItem.quantity || "0",
      purchasePrice: insertStockItem.purchasePrice,
      salePrice: insertStockItem.salePrice,
      reorderLevel: insertStockItem.reorderLevel || "0",
      hsnCode: insertStockItem.hsnCode || null,
      gstRate: insertStockItem.gstRate || null,
    };
    this.stockItems.set(id, stockItem);
    return stockItem;
  }

  async updateStockItem(id: string, updates: Partial<StockItem>): Promise<StockItem | undefined> {
    const stockItem = this.stockItems.get(id);
    if (stockItem) {
      const updated = { ...stockItem, ...updates };
      this.stockItems.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async deleteStockItem(id: string): Promise<void> {
    this.stockItems.delete(id);
  }

  // API Key methods
  async getApiKeys(): Promise<ApiKey[]> {
    return Array.from(this.apiKeys.values()).filter(key => key.isActive === 1);
  }

  async getApiKey(id: string): Promise<ApiKey | undefined> {
    return this.apiKeys.get(id);
  }

  async createApiKey(insertApiKey: InsertApiKey): Promise<{ apiKey: ApiKey; fullKey: string }> {
    const id = randomUUID();
    const keyPrefix = insertApiKey.keyPrefix;
    const randomPart = randomBytes(24).toString('base64url'); // URL-safe base64
    const fullKey = `${keyPrefix}_${randomPart}`;
    const keyHash = createHash('sha256').update(fullKey).digest('hex');
    const lastFour = randomPart.slice(-4);

    const apiKey: ApiKey = {
      id,
      name: insertApiKey.name,
      keyPrefix: insertApiKey.keyPrefix,
      keyHash,
      lastFour,
      createdAt: new Date(),
      lastUsedAt: null,
      requestCount: 0,
      isActive: 1,
    };
    this.apiKeys.set(id, apiKey);
    return { apiKey, fullKey };
  }

  async revokeApiKey(id: string): Promise<void> {
    const apiKey = this.apiKeys.get(id);
    if (apiKey) {
      apiKey.isActive = 0;
      this.apiKeys.set(id, apiKey);
    }
  }

  async verifyApiKey(key: string): Promise<ApiKey | null> {
    const keyHash = createHash('sha256').update(key).digest('hex');
    const apiKeysList = Array.from(this.apiKeys.values());
    for (const apiKey of apiKeysList) {
      if (apiKey.keyHash === keyHash && apiKey.isActive === 1) {
        return apiKey;
      }
    }
    return null;
  }

  async incrementApiKeyUsage(id: string): Promise<void> {
    const apiKey = this.apiKeys.get(id);
    if (apiKey) {
      apiKey.requestCount++;
      apiKey.lastUsedAt = new Date();
      this.apiKeys.set(id, apiKey);
    }
  }

  // Webhook methods
  async getWebhooks(): Promise<Webhook[]> {
    return Array.from(this.webhooks.values()).filter(webhook => webhook.isActive === 1);
  }

  async getWebhook(id: string): Promise<Webhook | undefined> {
    return this.webhooks.get(id);
  }

  async createWebhook(insertWebhook: InsertWebhook): Promise<Webhook> {
    const id = randomUUID();
    const secret = randomBytes(32).toString('hex'); // Webhook signing secret

    const webhook: Webhook = {
      id,
      url: insertWebhook.url,
      events: insertWebhook.events,
      secret,
      isActive: 1,
      createdAt: new Date(),
      lastDeliveryAt: null,
      successCount: 0,
      failureCount: 0,
    };
    this.webhooks.set(id, webhook);
    return webhook;
  }

  async deleteWebhook(id: string): Promise<void> {
    const webhook = this.webhooks.get(id);
    if (webhook) {
      webhook.isActive = 0;
      this.webhooks.set(id, webhook);
    }
  }

  async updateWebhookStats(id: string, success: boolean): Promise<void> {
    const webhook = this.webhooks.get(id);
    if (webhook) {
      webhook.lastDeliveryAt = new Date();
      if (success) {
        webhook.successCount++;
      } else {
        webhook.failureCount++;
      }
      this.webhooks.set(id, webhook);
    }
  }
}

// Use PostgreSQL storage in production, in-memory storage for development
export let storage: IStorage;

if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
  storage = new PostgresStorage();
} else {
  storage = new MemStorage();
}
