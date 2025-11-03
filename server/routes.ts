import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLedgerSchema, insertPartySchema, insertVoucherSchema, insertStockItemSchema } from "@shared/schema";
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
