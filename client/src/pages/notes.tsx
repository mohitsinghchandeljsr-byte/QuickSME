import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StickyNote, Plus, Search, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export default function Notes() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    category: "General",
  });

  const [notes] = useState<Note[]>([
    {
      id: "1",
      title: "Year-End Closing Checklist",
      content: "1. Reconcile all bank accounts\n2. Review inventory valuation\n3. Verify accounts receivable\n4. Calculate depreciation\n5. Prepare financial statements",
      category: "Accounting",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "GST Filing Reminder",
      content: "GSTR-3B due on 20th of next month. Ensure all invoices are uploaded to GST portal before filing.",
      category: "Tax",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "3",
      title: "Vendor Payment Schedule",
      content: "Vendor A - ₹50,000 due on 15th Nov\nVendor B - ₹35,000 due on 20th Nov\nVendor C - ₹75,000 due on 25th Nov",
      category: "Payments",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ]);

  const handleAddNote = () => {
    toast({
      title: "Note Created",
      description: `"${newNote.title}" has been saved`,
    });
    setIsDialogOpen(false);
    setNewNote({ title: "", content: "", category: "General" });
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Accounting": return "default";
      case "Tax": return "destructive";
      case "Payments": return "secondary";
      default: return "secondary";
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <StickyNote className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Notes</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Quick notes, reminders, and important information
              </p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-note">
                <Plus className="w-4 h-4 mr-2" />
                New Note
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Note</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    placeholder="Note title..."
                    data-testid="input-title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    value={newNote.category}
                    onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
                    placeholder="e.g., Accounting, Tax, Payments"
                    data-testid="input-category"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    placeholder="Write your note here..."
                    rows={6}
                    data-testid="input-content"
                  />
                </div>
                <Button onClick={handleAddNote} className="w-full" data-testid="button-submit">
                  Create Note
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-6">
          <div className="p-6 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note, idx) => (
            <Card key={note.id} className="p-6 hover-elevate" data-testid={`note-card-${idx}`}>
              <div className="flex items-start justify-between mb-3">
                <Badge variant={getCategoryColor(note.category)} className="text-xs">
                  {note.category}
                </Badge>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  data-testid={`button-delete-${idx}`}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                {note.title}
              </h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-4 line-clamp-4">
                {note.content}
              </p>
              <div className="text-xs text-muted-foreground">
                {new Date(note.updatedAt).toLocaleString('en-GB')}
              </div>
            </Card>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <StickyNote className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No notes found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first note to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
