import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLedgerSchema, insertPartySchema, insertVoucherSchema } from "@shared/schema";

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

  const httpServer = createServer(app);
  return httpServer;
}
