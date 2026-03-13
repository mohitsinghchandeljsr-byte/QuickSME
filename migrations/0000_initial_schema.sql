-- Create ledgers table
CREATE TABLE IF NOT EXISTS ledgers (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  "group" TEXT NOT NULL,
  balance DECIMAL(15,2) NOT NULL DEFAULT 0,
  type TEXT NOT NULL CHECK (type IN ('Dr', 'Cr'))
);

-- Create parties table
CREATE TABLE IF NOT EXISTS parties (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Customer', 'Vendor')),
  gstin TEXT,
  phone TEXT,
  email TEXT,
  outstanding DECIMAL(15,2) NOT NULL DEFAULT 0
);

-- Create vouchers table
CREATE TABLE IF NOT EXISTS vouchers (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  voucher_type TEXT NOT NULL,
  date TEXT NOT NULL,
  party_id VARCHAR(255),
  ledger_id VARCHAR(255),
  amount DECIMAL(15,2) NOT NULL,
  narration TEXT,
  cgst DECIMAL(15,2) DEFAULT 0,
  sgst DECIMAL(15,2) DEFAULT 0,
  igst DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create stock_items table
CREATE TABLE IF NOT EXISTS stock_items (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  category TEXT NOT NULL,
  unit TEXT NOT NULL,
  quantity DECIMAL(15,2) NOT NULL DEFAULT 0,
  purchase_price DECIMAL(15,2) NOT NULL,
  sale_price DECIMAL(15,2) NOT NULL,
  reorder_level DECIMAL(15,2) DEFAULT 0,
  hsn_code TEXT,
  gst_rate DECIMAL(5,2) DEFAULT 0
);

-- Create api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  last_four TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  last_used_at TIMESTAMP,
  request_count INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1
);

-- Create webhooks table
CREATE TABLE IF NOT EXISTS webhooks (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  events TEXT[] NOT NULL,
  secret TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  last_delivery_at TIMESTAMP,
  success_count INTEGER NOT NULL DEFAULT 0,
  failure_count INTEGER NOT NULL DEFAULT 0
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ledgers_group ON ledgers("group");
CREATE INDEX IF NOT EXISTS idx_parties_type ON parties(type);
CREATE INDEX IF NOT EXISTS idx_parties_gstin ON parties(gstin);
CREATE INDEX IF NOT EXISTS idx_vouchers_date ON vouchers(date);
CREATE INDEX IF NOT EXISTS idx_vouchers_party_id ON vouchers(party_id);
CREATE INDEX IF NOT EXISTS idx_vouchers_ledger_id ON vouchers(ledger_id);
CREATE INDEX IF NOT EXISTS idx_vouchers_created_at ON vouchers(created_at);
CREATE INDEX IF NOT EXISTS idx_stock_items_category ON stock_items(category);
CREATE INDEX IF NOT EXISTS idx_stock_items_code ON stock_items(code);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_webhooks_is_active ON webhooks(is_active);

-- Insert sample data
INSERT INTO ledgers (name, "group", balance, type) VALUES
('Cash in Hand', 'Cash-in-Hand', 125000, 'Dr'),
('HDFC Bank', 'Bank Accounts', 287500, 'Dr'),
('Sales Revenue', 'Sales Accounts', 1245000, 'Cr'),
('Purchase Account', 'Purchase Accounts', 832500, 'Dr'),
('Electricity Expense', 'Indirect Expenses', 15200, 'Dr'),
('Rent Expense', 'Indirect Expenses', 45000, 'Dr'),
('GST Input', 'Duties & Taxes', 62400, 'Dr'),
('GST Output', 'Duties & Taxes', 118800, 'Cr');

INSERT INTO parties (name, type, gstin, phone, email, outstanding) VALUES
('ABC Suppliers', 'Vendor', '24AABCU9603R1ZM', '+91 98765 43210', 'contact@abcsuppliers.com', -45000),
('XYZ Customer', 'Customer', '27AAPFU0939F1ZV', '+91 98765 43211', 'billing@xyzcustomer.com', 65000),
('PQR Vendors', 'Vendor', '29AABCT1332L1ZG', '+91 98765 43212', 'sales@pqrvendors.com', -28500),
('LMN Client', 'Customer', '07AACCI3788N1Z1', '+91 98765 43213', 'accounts@lmnclient.com', 92000);

INSERT INTO stock_items (name, code, category, unit, quantity, purchase_price, sale_price, reorder_level, hsn_code, gst_rate) VALUES
('Laptop - Dell XPS 15', 'DELL-XPS-15', 'Electronics', 'Pcs', 25, 85000, 95000, 10, '8471', 18),
('Office Chair - Executive', 'CHAIR-EXE-001', 'Furniture', 'Pcs', 50, 4500, 6500, 15, '9401', 18),
('A4 Paper - 500 Sheets', 'PAPER-A4-500', 'Stationery', 'Reams', 150, 180, 250, 50, '4802', 12),
('Wireless Mouse', 'MOUSE-WL-001', 'Electronics', 'Pcs', 8, 350, 550, 20, '8471', 18),
('Whiteboard Marker', 'MARKER-WB-BLK', 'Stationery', 'Pcs', 200, 15, 25, 100, '9608', 12);
