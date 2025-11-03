# Design Guidelines: Fast & Simple Accounting Application for Indian SMEs

## Design Approach

**System Selected**: Hybrid approach inspired by **Linear** (productivity focus) + **Notion** (data clarity) + **Tally's keyboard-first philosophy**

**Core Principle**: Optimize for speed, clarity, and keyboard navigation. Every design decision prioritizes efficiency over decoration.

## Typography System

**Font Family**: 
- Primary: Inter (modern, highly legible for data)
- Monospace: JetBrains Mono (for numbers, amounts, dates)

**Hierarchy**:
- Page Headers: text-2xl font-semibold
- Section Headers: text-lg font-medium
- Data Labels: text-sm font-medium uppercase tracking-wide
- Body/Data: text-base
- Table Data: text-sm
- Amounts/Numbers: text-base font-mono (right-aligned)
- Helper Text: text-xs
- Keyboard Shortcuts: text-xs font-mono

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, and 8** exclusively
- Tight spacing: p-2, gap-2 (within components)
- Standard spacing: p-4, gap-4 (between elements)
- Section spacing: p-6, gap-6 (cards, forms)
- Page spacing: p-8, gap-8 (major sections)

**Grid Structure**:
- Sidebar: Fixed 240px width (w-60)
- Main Content: flex-1 with max-w-7xl centered
- Forms: max-w-4xl centered
- Reports/Tables: Full width within container

## Application Structure

### Navigation Layout
**Persistent Left Sidebar** (240px fixed):
- Company selector at top
- Main navigation menu (Dashboard, Vouchers, Reports, Masters)
- Keyboard shortcut indicators next to each item
- Current financial year display at bottom
- Minimal, icon + text format

**Top Bar** (h-16):
- Breadcrumb navigation (left)
- Quick search bar (center) - prominent, always accessible
- User menu + notifications (right)

### Main Content Area
**Standard Page Structure**:
- Page header with title + primary action (h-20)
- Optional filter bar if needed (h-12)
- Content area with overflow-y-auto
- Consistent padding: p-8

## Component Library

### Data Entry Forms
**Voucher Entry Screen** (Primary Interface):
- Full-screen, distraction-free layout
- Sequential form fields with clear tab order
- Field labels above inputs (not floating)
- Validation messages inline, not modal
- Amount fields: Large, right-aligned, monospace font
- Date pickers: Keyboard-friendly with format dd-mm-yyyy
- Autocomplete dropdowns for ledgers/parties
- Running totals displayed prominently
- Keyboard shortcut legend at bottom

**Form Field Structure**:
- Label: text-sm font-medium mb-1
- Input: h-10 with px-4 py-2, full width within constraints
- Error states: border treatment + text-sm message below
- Focus states: Clear, high-contrast borders

### Data Display Components

**Tables** (Heavy Usage):
- Zebra striping for row readability
- Fixed header on scroll
- Sortable columns with indicators
- Amounts: Right-aligned, monospace
- Dates: Consistent dd-mm-yyyy format
- Hover states on rows
- Compact row height (h-12) for data density
- Sticky column for key identifiers

**Cards**:
- Minimal borders, slight shadow
- p-6 internal padding
- gap-4 between card elements
- Used for: Dashboard widgets, report summaries

**Dashboard Metrics**:
- Large number display (text-3xl font-bold font-mono)
- Small label above (text-sm uppercase tracking-wide)
- Trend indicator if applicable
- Compact card format (min-h-32)
- Grid layout: 2-4 columns based on viewport

### Navigation Components

**Sidebar Menu Items**:
- h-10 clickable area
- px-4 py-2 spacing
- Icon + text layout (gap-3)
- Keyboard shortcut aligned right (text-xs font-mono)
- Active state: Distinct treatment
- Hover state: Subtle

**Tabs** (for multi-section pages):
- Horizontal tabs below page header
- h-12 tab height
- Border-b on active tab
- Clean, minimal style

### Reports & Analytics

**Report Viewer**:
- Toolbar: Export (PDF/Excel) + Print + Date Range selector
- Report header: Company name, report title, period
- Table-based layout for financial statements
- Hierarchical indentation for grouped items (pl-4, pl-8 levels)
- Subtotal rows: font-semibold treatment
- Grand total rows: border-t + font-bold + larger text

**Filters**:
- Horizontal layout (flex gap-4)
- Date range pickers
- Ledger/Party selectors
- "Apply" button (not auto-apply for control)

## Interaction Patterns

**Keyboard Navigation**:
- Clear focus indicators throughout
- Alt+key shortcuts for main navigation
- F2 for quick voucher entry
- Escape to cancel/close
- Enter to save/confirm
- Ctrl+S to save in forms
- Display shortcuts in UI where relevant

**Loading States**:
- Skeleton screens for tables (not spinners)
- Inline loading for partial updates
- No full-page overlays unless necessary

**Feedback**:
- Toast notifications (top-right) for actions
- Inline validation (not modals)
- Success/error states with appropriate messaging
- No auto-dismiss for errors

## Accessibility Standards

- WCAG 2.1 AA compliant
- Keyboard accessible throughout
- Consistent focus management
- Form labels properly associated
- ARIA labels for icon-only buttons
- High contrast ratios maintained

## Spacing & Layout Philosophy

**Density Approach**:
- Information-dense by default (accounting users expect this)
- Breathing room in forms for accuracy
- Compact tables for data scanning
- No excessive whitespace - efficiency over airiness

**Responsive Strategy**:
- Desktop-first (primary use case)
- Tablets: Reduced sidebar to icons-only or overlay
- Mobile: Stack everything, hide sidebar, show hamburger menu
- Forms remain full-width with appropriate constraints

## Animation Guidelines

**Minimal Use**:
- No page transitions
- No decorative animations
- Dropdown/modal: Simple fade-in (150ms)
- Focus indicators: Instant, no transition
- Loading states: Simple, non-distracting

**Priority**: Speed and responsiveness over visual flair

## Special Considerations for Accounting Context

**Amount Display**:
- Always right-aligned
- Monospace font
- Consistent decimal places (2 for currency)
- Clear negative number treatment
- Thousand separators (Indian format: 1,00,000)

**Date Handling**:
- DD-MM-YYYY format throughout
- Financial year aware
- Quick date navigation (Today, Yesterday shortcuts)

**GST Compliance**:
- Tax breakdown tables (CGST, SGST, IGST columns)
- Summary boxes for tax totals
- HSN/SAC code display fields

This design system prioritizes **speed, clarity, and keyboard efficiency** - essential for accounting professionals who value productivity over aesthetics.