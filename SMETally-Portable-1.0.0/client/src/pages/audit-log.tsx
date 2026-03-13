import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Shield, Search, FileText, User, Clock } from "lucide-react";
import { useState } from "react";

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
}

export default function AuditLog() {
  const [searchTerm, setSearchTerm] = useState("");

  const sampleAuditEntries: AuditEntry[] = [
    {
      id: "1",
      timestamp: new Date().toLocaleString('en-GB'),
      user: "admin@democompany.com",
      action: "CREATE",
      module: "Vouchers",
      details: "Created sales voucher #INV-2024-001 for ₹95,000",
      ipAddress: "192.168.1.100",
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 3600000).toLocaleString('en-GB'),
      user: "accounts@democompany.com",
      action: "UPDATE",
      module: "Stock",
      details: "Updated stock quantity for Laptop - Dell XPS 15 from 20 to 25",
      ipAddress: "192.168.1.101",
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 7200000).toLocaleString('en-GB'),
      user: "admin@democompany.com",
      action: "LOGIN",
      module: "Authentication",
      details: "User logged in successfully",
      ipAddress: "192.168.1.100",
    },
    {
      id: "4",
      timestamp: new Date(Date.now() - 10800000).toLocaleString('en-GB'),
      user: "manager@democompany.com",
      action: "VIEW",
      module: "Reports",
      details: "Accessed GSTR-3B report for November 2024",
      ipAddress: "192.168.1.105",
    },
    {
      id: "5",
      timestamp: new Date(Date.now() - 14400000).toLocaleString('en-GB'),
      user: "admin@democompany.com",
      action: "UPDATE",
      module: "Settings",
      details: "Updated company GSTIN to 27AABCU9603R1ZM",
      ipAddress: "192.168.1.100",
    },
  ];

  const filteredEntries = sampleAuditEntries.filter(entry =>
    entry.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE": return "default";
      case "UPDATE": return "secondary";
      case "DELETE": return "destructive";
      case "LOGIN": return "default";
      case "VIEW": return "secondary";
      default: return "secondary";
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Audit Log</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Complete activity trail for security and compliance
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Total Activities
              </p>
            </div>
            <p className="text-3xl font-bold font-mono text-foreground">{sampleAuditEntries.length}</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <User className="w-5 h-5 text-green-600" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Active Users
              </p>
            </div>
            <p className="text-3xl font-bold font-mono text-foreground">3</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Last Activity
              </p>
            </div>
            <p className="text-sm font-mono text-foreground">Just now</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-amber-600" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Security Status
              </p>
            </div>
            <Badge variant="default" className="text-sm">Active</Badge>
          </Card>
        </div>

        <Card className="mb-6">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search audit logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Timestamp
                  </th>
                  <th className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    User
                  </th>
                  <th className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Action
                  </th>
                  <th className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Module
                  </th>
                  <th className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Details
                  </th>
                  <th className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredEntries.map((entry, idx) => (
                  <tr key={entry.id} className="hover-elevate" data-testid={`audit-row-${idx}`}>
                    <td className="px-6 py-4 text-sm font-mono text-foreground">{entry.timestamp}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{entry.user}</td>
                    <td className="px-6 py-4">
                      <Badge variant={getActionColor(entry.action)}>{entry.action}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{entry.module}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{entry.details}</td>
                    <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{entry.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <h3 className="text-base font-semibold text-foreground mb-3">Enterprise Security Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">✓ Comprehensive Audit Trail</h4>
              <p className="text-sm text-muted-foreground">Every action is logged with user, timestamp, and IP address</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">✓ Role-Based Access Control</h4>
              <p className="text-sm text-muted-foreground">Granular permissions for different user roles</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">✓ Session Management</h4>
              <p className="text-sm text-muted-foreground">Secure session handling with automatic timeout</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">✓ Data Encryption</h4>
              <p className="text-sm text-muted-foreground">All sensitive data encrypted at rest and in transit</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">✓ Database Scalability</h4>
              <p className="text-sm text-muted-foreground">PostgreSQL backend ready for enterprise scale</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">✓ Backup & Recovery</h4>
              <p className="text-sm text-muted-foreground">Automated backups with point-in-time recovery</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
