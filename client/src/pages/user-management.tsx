import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Plus, Shield, Mail, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

export default function UserManagement() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Accountant",
  });

  const [users] = useState<User[]>([
    {
      id: "1",
      name: "Admin User",
      email: "admin@democompany.com",
      role: "Administrator",
      status: "Active",
      lastLogin: new Date().toLocaleString('en-GB'),
    },
    {
      id: "2",
      name: "Accounts Manager",
      email: "accounts@democompany.com",
      role: "Manager",
      status: "Active",
      lastLogin: new Date(Date.now() - 3600000).toLocaleString('en-GB'),
    },
    {
      id: "3",
      name: "Data Entry User",
      email: "dataentry@democompany.com",
      role: "Accountant",
      status: "Active",
      lastLogin: new Date(Date.now() - 7200000).toLocaleString('en-GB'),
    },
  ]);

  const handleAddUser = () => {
    toast({
      title: "User Created",
      description: `${newUser.name} has been added as ${newUser.role}`,
    });
    setIsDialogOpen(false);
    setNewUser({ name: "", email: "", role: "Accountant" });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Administrator": return "destructive";
      case "Manager": return "default";
      case "Accountant": return "secondary";
      default: return "secondary";
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-2xl font-semibold text-foreground">User Management</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage user accounts and permissions
              </p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-user">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    data-testid="input-email"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                    <SelectTrigger data-testid="select-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administrator">Administrator</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Accountant">Accountant</SelectItem>
                      <SelectItem value="Viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddUser} className="w-full" data-testid="button-submit">
                  Create User
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Total Users
              </p>
            </div>
            <p className="text-3xl font-bold font-mono text-foreground">{users.length}</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-green-600" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Active Users
              </p>
            </div>
            <p className="text-3xl font-bold font-mono text-foreground">{users.filter(u => u.status === 'Active').length}</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Key className="w-5 h-5 text-indigo-600" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Administrators
              </p>
            </div>
            <p className="text-3xl font-bold font-mono text-foreground">{users.filter(u => u.role === 'Administrator').length}</p>
          </Card>
        </div>

        <Card>
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">User Accounts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Name
                  </th>
                  <th className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Email
                  </th>
                  <th className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Role
                  </th>
                  <th className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Last Login
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user, idx) => (
                  <tr key={user.id} className="hover-elevate" data-testid={`user-row-${idx}`}>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getRoleBadge(user.role)}>{user.role}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="default">{user.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{user.lastLogin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="mt-6 p-6 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
          <h3 className="text-base font-semibold text-foreground mb-3">Role Permissions</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div>
              <span className="font-semibold text-foreground">Administrator:</span> Full access to all modules, user management, and system settings
            </div>
            <div>
              <span className="font-semibold text-foreground">Manager:</span> Access to all accounting modules, reports, and GST compliance features
            </div>
            <div>
              <span className="font-semibold text-foreground">Accountant:</span> Create and edit vouchers, manage stock, view reports
            </div>
            <div>
              <span className="font-semibold text-foreground">Viewer:</span> Read-only access to reports and dashboard
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
