import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Upload, Database, Clock, CheckCircle2, HardDrive } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function BackupRestore() {
  const { toast } = useToast();

  const handleBackup = () => {
    toast({
      title: "Backup Created",
      description: "Full database backup downloaded successfully",
    });
  };

  const handleRestore = () => {
    toast({
      title: "Restore Complete",
      description: "Database restored from backup file",
    });
  };

  const backupHistory = [
    {
      id: "1",
      timestamp: new Date().toLocaleString('en-GB'),
      size: "2.4 MB",
      type: "Automatic",
      status: "Completed",
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 86400000).toLocaleString('en-GB'),
      size: "2.3 MB",
      type: "Manual",
      status: "Completed",
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 172800000).toLocaleString('en-GB'),
      size: "2.2 MB",
      type: "Automatic",
      status: "Completed",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <Database className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Backup & Restore</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Secure your data with automated backups and easy restoration
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <HardDrive className="w-5 h-5 text-blue-600" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Total Backups
              </p>
            </div>
            <p className="text-3xl font-bold font-mono text-foreground">{backupHistory.length}</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-green-600" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Last Backup
              </p>
            </div>
            <p className="text-sm font-mono text-foreground">Just now</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Database className="w-5 h-5 text-indigo-600" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Total Size
              </p>
            </div>
            <p className="text-3xl font-bold font-mono text-foreground">6.9 MB</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Create Backup</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Download a complete backup of all your accounting data including vouchers, parties, ledgers, and stock items.
            </p>
            <Button onClick={handleBackup} className="w-full" data-testid="button-backup">
              <Download className="w-4 h-4 mr-2" />
              Download Backup
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Restore from Backup</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Upload a previously downloaded backup file to restore your data. This will replace all current data.
            </p>
            <Button onClick={handleRestore} variant="outline" className="w-full" data-testid="button-restore">
              <Upload className="w-4 h-4 mr-2" />
              Upload & Restore
            </Button>
          </Card>
        </div>

        <Card>
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Backup History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Timestamp
                  </th>
                  <th className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Type
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Size
                  </th>
                  <th className="text-center text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Status
                  </th>
                  <th className="text-center text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {backupHistory.map((backup, idx) => (
                  <tr key={backup.id} className="hover-elevate" data-testid={`backup-row-${idx}`}>
                    <td className="px-6 py-4 text-sm font-mono text-foreground">{backup.timestamp}</td>
                    <td className="px-6 py-4">
                      <Badge variant={backup.type === "Automatic" ? "default" : "secondary"}>
                        {backup.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-mono text-foreground">{backup.size}</td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="default">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {backup.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button size="sm" variant="ghost" data-testid={`button-download-${idx}`}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="mt-6 p-6 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
          <h3 className="text-base font-semibold text-foreground mb-3">Backup Best Practices</h3>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>Automatic backups run daily at midnight</li>
            <li>Store backup files in a secure, off-site location</li>
            <li>Test restore process periodically to ensure data integrity</li>
            <li>Keep at least 3 recent backup copies</li>
            <li>Never overwrite your only backup file</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
