import { type Ledger, type InsertLedger, type Party, type InsertParty, type Voucher, type InsertVoucher } from "@shared/schema";
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
}

export class MemStorage implements IStorage {
  private ledgers: Map<string, Ledger>;
  private parties: Map<string, Party>;
  private vouchers: Map<string, Voucher>;

  constructor() {
    this.ledgers = new Map();
    this.parties = new Map();
    this.vouchers = new Map();
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
}

export const storage = new MemStorage();
