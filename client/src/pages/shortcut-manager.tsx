import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Keyboard, Search, Zap, Command } from "lucide-react";
import { useState } from "react";

interface Shortcut {
  category: string;
  items: {
    name: string;
    description: string;
    shortcut: string;
    keys: string[];
  }[];
}

const shortcuts: Shortcut[] = [
  {
    category: "Navigation",
    items: [
      { name: "Command Palette", description: "Open quick navigation menu", shortcut: "⌘K", keys: ["cmd", "k"] },
      { name: "AIassist", description: "Open AI assistant chat", shortcut: "⌘⇧A", keys: ["cmd", "shift", "a"] },
      { name: "New Voucher", description: "Navigate to vouchers page", shortcut: "⌘⇧N", keys: ["cmd", "shift", "n"] },
      { name: "Stock Management", description: "Navigate to stock management", shortcut: "⌘⇧S", keys: ["cmd", "shift", "s"] },
      { name: "Reports", description: "Navigate to reports page", shortcut: "⌘⇧R", keys: ["cmd", "shift", "r"] },
      { name: "Parties", description: "Navigate to parties page", shortcut: "⌘⇧P", keys: ["cmd", "shift", "p"] },
      { name: "Barcode Scanner", description: "Open barcode scanner", shortcut: "⌘⇧B", keys: ["cmd", "shift", "b"] },
    ],
  },
  {
    category: "Actions",
    items: [
      { name: "Search", description: "Focus on search input", shortcut: "/", keys: ["/"] },
      { name: "Save", description: "Save current form or data", shortcut: "⌘S", keys: ["cmd", "s"] },
      { name: "Cancel", description: "Cancel current action or close dialog", shortcut: "Esc", keys: ["esc"] },
      { name: "Submit Form", description: "Submit the active form", shortcut: "Enter", keys: ["enter"] },
    ],
  },
  {
    category: "General",
    items: [
      { name: "Help", description: "Show help documentation", shortcut: "?", keys: ["?"] },
      { name: "Close Dialog", description: "Close any open dialog or modal", shortcut: "Esc", keys: ["esc"] },
      { name: "Toggle Sidebar", description: "Collapse or expand sidebar", shortcut: "⌘\\", keys: ["cmd", "\\"] },
    ],
  },
];

export default function ShortcutManager() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredShortcuts = shortcuts.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shortcut.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.items.length > 0);

  const getKeyStyle = (key: string) => {
    const baseClasses = "inline-flex items-center justify-center min-w-[2rem] h-7 px-2 rounded border border-border bg-muted text-xs font-mono font-semibold text-foreground";
    return baseClasses;
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center justify-center w-10 h-10 rounded-md bg-purple-600 dark:bg-purple-700">
            <Keyboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Keyboard Shortcuts</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Master keyboard shortcuts to work faster and more efficiently
            </p>
          </div>
        </div>

        <Card className="p-6 mb-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-purple-200 dark:border-purple-800">
          <div className="flex items-start gap-4">
            <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-semibold text-foreground mb-2">Pro Tip: Command Palette</h3>
              <p className="text-sm text-muted-foreground">
                Press <kbd className="inline-flex items-center justify-center h-5 px-2 rounded border bg-background text-[10px] font-mono font-semibold mx-1">⌘K</kbd> 
                to open the command palette and access any feature instantly. It's the fastest way to navigate!
              </p>
            </div>
          </div>
        </Card>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search shortcuts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-shortcuts"
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredShortcuts.length === 0 ? (
            <Card className="p-8 text-center">
              <Command className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No shortcuts found</h3>
              <p className="text-sm text-muted-foreground">
                Try searching with different keywords
              </p>
            </Card>
          ) : (
            filteredShortcuts.map((category) => (
              <div key={category.category}>
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  {category.category}
                  <Badge variant="secondary" className="text-xs">
                    {category.items.length}
                  </Badge>
                </h2>
                <div className="grid gap-3">
                  {category.items.map((item, idx) => (
                    <Card
                      key={idx}
                      className="p-4 hover-elevate"
                      data-testid={`shortcut-${category.category}-${idx}`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-foreground mb-1">
                            {item.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {item.keys.map((key, keyIdx) => (
                            <span key={keyIdx} className="flex items-center">
                              <kbd className={getKeyStyle(key)}>
                                {key === "cmd" ? "⌘" : key === "shift" ? "⇧" : key === "esc" ? "Esc" : key.toUpperCase()}
                              </kbd>
                              {keyIdx < item.keys.length - 1 && (
                                <span className="text-muted-foreground mx-1">+</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <Card className="mt-8 p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Keyboard Symbols</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <kbd className="inline-flex items-center justify-center w-8 h-8 rounded border bg-muted text-sm font-semibold">⌘</kbd>
              <span className="text-sm text-muted-foreground">Command (Mac) / Ctrl (Windows)</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="inline-flex items-center justify-center w-8 h-8 rounded border bg-muted text-sm font-semibold">⇧</kbd>
              <span className="text-sm text-muted-foreground">Shift</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="inline-flex items-center justify-center w-8 h-8 rounded border bg-muted text-sm font-semibold">⌥</kbd>
              <span className="text-sm text-muted-foreground">Option (Mac) / Alt (Windows)</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="inline-flex items-center justify-center w-8 h-8 rounded border bg-muted text-sm font-semibold">⏎</kbd>
              <span className="text-sm text-muted-foreground">Enter / Return</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
