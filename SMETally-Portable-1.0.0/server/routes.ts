import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLedgerSchema, insertPartySchema, insertVoucherSchema, insertStockItemSchema, insertApiKeySchema, insertWebhookSchema } from "@shared/schema";
import { getUncachableGitHubClient } from "./github";

export async function registerRoutes(app: Express): Promise<Server> {
  // Ledger routes
  app.get("/api/ledgers", async (_req, res) => {
    try {
      const ledgers = await storage.getLedgers();
      res.json(ledgers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ledgers" });
    }
  });

  app.get("/api/ledgers/:id", async (req, res) => {
    try {
      const ledger = await storage.getLedger(req.params.id);
      if (!ledger) {
        return res.status(404).json({ error: "Ledger not found" });
      }
      res.json(ledger);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ledger" });
    }
  });

  app.post("/api/ledgers", async (req, res) => {
    try {
      const parsed = insertLedgerSchema.parse(req.body);
      const ledger = await storage.createLedger(parsed);
      res.status(201).json(ledger);
    } catch (error) {
      res.status(400).json({ error: "Invalid ledger data" });
    }
  });

  // Party routes
  app.get("/api/parties", async (_req, res) => {
    try {
      const parties = await storage.getParties();
      res.json(parties);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch parties" });
    }
  });

  app.get("/api/parties/:id", async (req, res) => {
    try {
      const party = await storage.getParty(req.params.id);
      if (!party) {
        return res.status(404).json({ error: "Party not found" });
      }
      res.json(party);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch party" });
    }
  });

  app.post("/api/parties", async (req, res) => {
    try {
      const parsed = insertPartySchema.parse(req.body);
      const party = await storage.createParty(parsed);
      res.status(201).json(party);
    } catch (error) {
      res.status(400).json({ error: "Invalid party data" });
    }
  });

  // Voucher routes
  app.get("/api/vouchers", async (_req, res) => {
    try {
      const vouchers = await storage.getVouchers();
      res.json(vouchers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vouchers" });
    }
  });

  app.get("/api/vouchers/:id", async (req, res) => {
    try {
      const voucher = await storage.getVoucher(req.params.id);
      if (!voucher) {
        return res.status(404).json({ error: "Voucher not found" });
      }
      res.json(voucher);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch voucher" });
    }
  });

  app.post("/api/vouchers", async (req, res) => {
    try {
      const parsed = insertVoucherSchema.parse(req.body);
      const voucher = await storage.createVoucher(parsed);
      res.status(201).json(voucher);
    } catch (error) {
      res.status(400).json({ error: "Invalid voucher data" });
    }
  });

  // Stock Item routes
  app.get("/api/stock", async (_req, res) => {
    try {
      const stockItems = await storage.getStockItems();
      res.json(stockItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stock items" });
    }
  });

  app.get("/api/stock/:id", async (req, res) => {
    try {
      const stockItem = await storage.getStockItem(req.params.id);
      if (!stockItem) {
        return res.status(404).json({ error: "Stock item not found" });
      }
      res.json(stockItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stock item" });
    }
  });

  app.post("/api/stock", async (req, res) => {
    try {
      const parsed = insertStockItemSchema.parse(req.body);
      const stockItem = await storage.createStockItem(parsed);
      res.status(201).json(stockItem);
    } catch (error) {
      res.status(400).json({ error: "Invalid stock item data" });
    }
  });

  app.patch("/api/stock/:id", async (req, res) => {
    try {
      const stockItem = await storage.updateStockItem(req.params.id, req.body);
      if (!stockItem) {
        return res.status(404).json({ error: "Stock item not found" });
      }
      res.json(stockItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to update stock item" });
    }
  });

  app.delete("/api/stock/:id", async (req, res) => {
    try {
      await storage.deleteStockItem(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete stock item" });
    }
  });

  // API Key routes
  app.get("/api/api-keys", async (_req, res) => {
    try {
      const apiKeys = await storage.getApiKeys();
      // Never send the key hash to the frontend, only safe metadata
      const safeKeys = apiKeys.map(({ keyHash, ...safeData }) => safeData);
      res.json(safeKeys);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch API keys" });
    }
  });

  app.post("/api/api-keys", async (req, res) => {
    try {
      const parsed = insertApiKeySchema.parse(req.body);
      const { apiKey, fullKey } = await storage.createApiKey(parsed);
      // Only return the full key once at creation time
      const { keyHash, ...safeApiKey } = apiKey;
      res.status(201).json({ ...safeApiKey, fullKey });
    } catch (error) {
      res.status(400).json({ error: "Invalid API key data" });
    }
  });

  app.delete("/api/api-keys/:id", async (req, res) => {
    try {
      await storage.revokeApiKey(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to revoke API key" });
    }
  });

  // Webhook routes
  app.get("/api/webhooks", async (_req, res) => {
    try {
      const webhooks = await storage.getWebhooks();
      // Don't send the webhook secret to the frontend
      const safeWebhooks = webhooks.map(({ secret, ...safeData }) => safeData);
      res.json(safeWebhooks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch webhooks" });
    }
  });

  app.post("/api/webhooks", async (req, res) => {
    try {
      const parsed = insertWebhookSchema.parse(req.body);
      const webhook = await storage.createWebhook(parsed);
      // Don't send the webhook secret to the frontend
      const { secret, ...safeWebhook } = webhook;
      res.status(201).json(safeWebhook);
    } catch (error) {
      res.status(400).json({ error: "Invalid webhook data" });
    }
  });

  app.delete("/api/webhooks/:id", async (req, res) => {
    try {
      await storage.deleteWebhook(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete webhook" });
    }
  });

  // AI Assistant routes
  app.post("/api/ai-assist", async (req, res) => {
    try {
      const { message, conversationHistory = [] } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message is required" });
      }

      // Import OpenAI dynamically
      const { default: OpenAI } = await import('openai');
      
      const openai = new OpenAI({
        apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
        baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      });

      // Gather current accounting data for context
      const [vouchers, parties, ledgers, stockItems] = await Promise.all([
        storage.getVouchers(),
        storage.getParties(),
        storage.getLedgers(),
        storage.getStockItems(),
      ]);

      // Calculate summary statistics
      const totalVouchers = vouchers.length;
      const totalRevenue = vouchers
        .filter(v => v.type === 'sales')
        .reduce((sum, v) => sum + v.amount, 0);
      const totalExpenses = vouchers
        .filter(v => v.type === 'payment' || v.type === 'purchase')
        .reduce((sum, v) => sum + v.amount, 0);
      const lowStockItems = stockItems.filter(item => item.quantity <= item.reorderLevel);
      const totalParties = parties.length;
      const customers = parties.filter(p => p.type === 'customer').length;
      const vendors = parties.filter(p => p.type === 'vendor').length;

      // Create system prompt with accounting context
      const systemPrompt = `You are AIassist, an intelligent accounting assistant for an Indian SME accounting application. You help users manage their finances, understand their data, and provide actionable insights.

Current Business Overview:
- Total Vouchers: ${totalVouchers}
- Total Revenue: ₹${totalRevenue.toLocaleString('en-IN')}
- Total Expenses: ₹${totalExpenses.toLocaleString('en-IN')}
- Net Income: ₹${(totalRevenue - totalExpenses).toLocaleString('en-IN')}
- Total Parties: ${totalParties} (${customers} customers, ${vendors} vendors)
- Stock Items: ${stockItems.length} (${lowStockItems.length} below reorder level)
- Ledgers: ${ledgers.length}

Recent Vouchers (last 5):
${vouchers.slice(-5).map(v => `- ${v.voucherNumber}: ${v.type} of ₹${v.amount.toLocaleString('en-IN')} on ${new Date(v.date).toLocaleDateString('en-IN')}`).join('\n')}

Low Stock Items:
${lowStockItems.length > 0 ? lowStockItems.map(item => `- ${item.name}: ${item.quantity} units (reorder at ${item.reorderLevel})`).join('\n') : 'None'}

Your capabilities:
1. Answer questions about financial data and transactions
2. Provide business insights and recommendations
3. Help with GST compliance and tax calculations
4. Explain accounting concepts in simple terms
5. Suggest actions to improve cash flow and profitability
6. Alert about low stock and pending payments

Always respond in a helpful, professional manner. Use Indian number formatting (₹) and date formats. Keep responses concise but informative.`;

      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: message },
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 1000,
      });

      const assistantMessage = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';

      res.json({
        message: assistantMessage,
        conversationHistory: [
          ...conversationHistory,
          { role: 'user', content: message },
          { role: 'assistant', content: assistantMessage },
        ],
      });
    } catch (error) {
      console.error('AI Assistant error:', error);
      res.status(500).json({ error: "Failed to process AI request" });
    }
  });

  // GitHub routes
  app.get("/api/github/user", async (_req, res) => {
    try {
      const octokit = await getUncachableGitHubClient();
      const { data } = await octokit.rest.users.getAuthenticated();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch GitHub user info" });
    }
  });

  app.get("/api/github/repos", async (_req, res) => {
    try {
      const octokit = await getUncachableGitHubClient();
      const { data } = await octokit.rest.repos.listForAuthenticatedUser({
        sort: 'updated',
        per_page: 100,
      });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch GitHub repositories" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
