import type {
  Ledger,
  Party,
  Voucher,
  StockItem,
  ApiKey,
  Webhook,
  InsertLedger,
  InsertParty,
  InsertVoucher,
  InsertStockItem,
  InsertApiKey,
  InsertWebhook,
} from "@shared/schema";

// In-memory storage implementation
class MemoryStorage {
  private ledgers: Ledger[] = [];
  private parties: Party[] = [];
  private vouchers: Voucher[] = [];
  private stockItems: StockItem[] = [];
  private apiKeys: ApiKey[] = [];
  private webhooks: Webhook[] = [];

  private nextId = 1;

  // Ledger methods
  async getLedgers(): Promise<Ledger[]> {
    return [...this.ledgers];
  }

  async getLedger(id: string): Promise<Ledger | undefined> {
    return this.ledgers.find(l => l.id === id);
  }

  async createLedger(data: InsertLedger): Promise<Ledger> {
    const ledger: Ledger = {
      id: this.nextId.toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.ledgers.push(ledger);
    this.nextId++;
    return ledger;
  }

  // Party methods
  async getParties(): Promise<Party[]> {
    return [...this.parties];
  }

  async getParty(id: string): Promise<Party | undefined> {
    return this.parties.find(p => p.id === id);
  }

  async createParty(data: InsertParty): Promise<Party> {
    const party: Party = {
      id: this.nextId.toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.parties.push(party);
    this.nextId++;
    return party;
  }

  // Voucher methods
  async getVouchers(): Promise<Voucher[]> {
    return [...this.vouchers];
  }

  async getVoucher(id: string): Promise<Voucher | undefined> {
    return this.vouchers.find(v => v.id === id);
  }

  async createVoucher(data: InsertVoucher): Promise<Voucher> {
    const voucher: Voucher = {
      id: this.nextId.toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.vouchers.push(voucher);
    this.nextId++;
    return voucher;
  }

  // Stock Item methods
  async getStockItems(): Promise<StockItem[]> {
    return [...this.stockItems];
  }

  async getStockItem(id: string): Promise<StockItem | undefined> {
    return this.stockItems.find(s => s.id === id);
  }

  async createStockItem(data: InsertStockItem): Promise<StockItem> {
    const stockItem: StockItem = {
      id: this.nextId.toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.stockItems.push(stockItem);
    this.nextId++;
    return stockItem;
  }

  async updateStockItem(id: string, data: Partial<StockItem>): Promise<StockItem | undefined> {
    const index = this.stockItems.findIndex(s => s.id === id);
    if (index === -1) return undefined;

    this.stockItems[index] = { ...this.stockItems[index], ...data, updatedAt: new Date() };
    return this.stockItems[index];
  }

  async deleteStockItem(id: string): Promise<void> {
    this.stockItems = this.stockItems.filter(s => s.id !== id);
  }

  // API Key methods
  async getApiKeys(): Promise<ApiKey[]> {
    return [...this.apiKeys];
  }

  async createApiKey(data: InsertApiKey): Promise<{ apiKey: ApiKey; fullKey: string }> {
    const fullKey = `qsme_${Math.random().toString(36).substring(2, 15)}`;
    const keyHash = fullKey; // In memory, just store the key as hash

    const apiKey: ApiKey = {
      id: this.nextId.toString(),
      name: data.name,
      keyHash,
      createdAt: new Date(),
      lastUsed: null,
      expiresAt: data.expiresAt || null,
    };

    this.apiKeys.push(apiKey);
    this.nextId++;
    return { apiKey, fullKey };
  }

  async revokeApiKey(id: string): Promise<void> {
    this.apiKeys = this.apiKeys.filter(k => k.id !== id);
  }

  // Webhook methods
  async getWebhooks(): Promise<Webhook[]> {
    return [...this.webhooks];
  }

  async createWebhook(data: InsertWebhook): Promise<Webhook> {
    const secret = `wh_secret_${Math.random().toString(36).substring(2, 15)}`;

    const webhook: Webhook = {
      id: this.nextId.toString(),
      url: data.url,
      events: data.events,
      secret,
      isActive: true,
      createdAt: new Date(),
      lastTriggered: null,
    };

    this.webhooks.push(webhook);
    this.nextId++;
    return webhook;
  }

  async deleteWebhook(id: string): Promise<void> {
    this.webhooks = this.webhooks.filter(w => w.id !== id);
  }
}

export const storage = new MemoryStorage();
