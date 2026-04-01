# FinFlow — Personal Finance Dashboard

<div align="center">
  <img src="public/logo.svg" alt="FinFlow Logo" width="80" height="80" />
  <h3>A production-quality fintech dashboard built with modern frontend practices</h3>
  <p>Built with Next.js 15, TypeScript, Tailwind CSS, Zustand, and Recharts</p>

  ![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
  ![Zustand](https://img.shields.io/badge/Zustand-5-orange)
  ![Recharts](https://img.shields.io/badge/Recharts-2-green)
</div>

---

## 📸 Screenshots

| Dashboard | Transactions | Insights |
|-----------|-------------|----------|
| ![Dashboard](screenshots/dashboard.png) | ![Transactions](screenshots/transactions.png) | ![Insights](screenshots/insights.png) |

---

## ✨ Features

### 🏠 Dashboard Overview
- **4 Summary Cards**: Net Balance, Total Income, Total Expenses, Net Savings with animated progress bars
- **Cash Flow Trend Chart**: 6-month area chart comparing income vs. expenses
- **Spending Breakdown**: Interactive donut chart with category legend
- **Recent Transactions**: Live-updating transaction feed

### 💳 Transactions Module
- Full CRUD (Add / Edit / Delete) — admin role only
- **Debounced search** across description, merchant, and category
- **Filtering** by type (income/expense/transfer) and category
- **Sorting** by date or amount (ascending/descending)
- **Pagination** with configurable page size
- **CSV export** of filtered results
- Clean empty states with call-to-action

### 🔐 Role-Based UI
- **Admin**: Full CRUD access, form modals with validation
- **Viewer**: Read-only view, no mutation controls visible
- Role switcher in top navbar with real-time UI update

### 📊 Insights Engine
- **Monthly Spend Change**: % comparison vs last month
- **Highest Spending Category**: Auto-detected with progress bar
- **Financial Health Score**: Computed from savings rate (0–100)
- **Net Savings**: Income/expense breakdown card
- **Savings Goals**: Progress bars for custom financial targets
- **Category Bar Chart**: All-time spending by category

### 🎨 Design System
- CSS custom properties for full light/dark theming
- 13 semantic color tokens (primary, muted, destructive, etc.)
- Sidebar, card, popover, input, and ring component tokens
- Inter font with optical sizing
- Consistent 4px spacing grid

### 🌗 Dark Mode
- System preference aware
- Persisted via Zustand + localStorage
- Instant toggle in top navbar

### 🔔 UX Polish
- Loading skeleton states for all data-dependent views
- Toast notifications for every mutation action
- Hover/focus states on all interactive elements
- Smooth Framer Motion page + list animations
- Keyboard accessible modal dialogs (Escape to close)
- Responsive layout: sidebar collapses to drawer on mobile

---

## 🛠 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 15** (App Router) | Framework, routing, SSR |
| **TypeScript** | Type safety throughout |
| **Tailwind CSS v4** | Utility-first styling with custom design tokens |
| **Zustand 5** | Centralized state management with persistence |
| **React Hook Form + Zod** | Form validation with schema-first approach |
| **Recharts** | AreaChart, PieChart, BarChart for data visualization |
| **Framer Motion** | Page animations, list transitions, modal enter/exit |
| **Lucide React** | Consistent icon set |
| **React Hot Toast** | Non-intrusive toast notifications |
| **date-fns** | Date formatting and computation |
| **clsx + tailwind-merge** | Conditional class composition |

---

## 📁 Folder Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css         # Design tokens & base styles
│   ├── layout.tsx          # Root layout with font + providers
│   ├── page.tsx            # Dashboard page
│   ├── transactions/
│   │   └── page.tsx        # Transactions page
│   └── insights/
│       └── page.tsx        # Insights page
│
├── components/
│   ├── layout/             # AppShell, Sidebar, TopNav
│   ├── providers/          # ThemeProvider
│   └── ui/                 # Card, Button, Badge, Modal, Input, Skeleton
│
├── features/               # Feature-scoped components
│   ├── dashboard/          # SummaryCards, BalanceTrendChart, SpendingChart, RecentTransactions
│   ├── transactions/       # TransactionsTable, TransactionForm
│   └── insights/           # InsightsPanel
│
├── store/
│   └── useAppStore.ts      # Zustand store (transactions, filters, role, theme)
│
├── lib/
│   ├── utils.ts            # formatCurrency, computeInsights, exportCSV, etc.
│   ├── mockData.ts         # 60+ realistic mock transactions
│   └── transactionService.ts  # Service layer with localStorage persistence
│
└── types/
    └── index.ts            # All TypeScript interfaces and types
```

---

## 🚀 Setup & Installation

```bash
# 1. Clone the repo
git clone <repo-url>
cd fintech-dashboard

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open in browser
# → http://localhost:3000
```

### Prerequisites
- Node.js 18+
- npm 9+

---

## 🔑 Usage Guide

### Switching Roles
Click the **Admin / Viewer** dropdown in the top-right navbar to switch roles:
- **Admin**: Can add, edit, and delete transactions via form modals
- **Viewer**: Read-only access, no mutation controls shown

### Theme Toggle
Click the ☀️ / 🌙 icon in the top navbar to switch between dark and light mode. Preference is persisted automatically.

### Adding Transactions (Admin)
1. Go to **Transactions** page
2. Click **+ Add Transaction**
3. Fill in description, amount, type, category, and date
4. Click **Add Transaction** — appears instantly with toast confirmation

### Exporting Data
On the Transactions page, click **Export CSV** to download all visible (filtered) transactions as a `.csv` file.

### Resetting Data
Data persists in `localStorage`. To reset to mock data, clear your browser's local storage for `localhost:3000`.

---

## 🏗 Architecture Decisions

### State Management
- **Zustand** with `persist` middleware for role and theme (survives refresh)
- Derived analytics (insights, monthly data, chart data) are recomputed in the store after every mutation
- Filters kept in the store for cross-component access (table + toolbar stay in sync)

### Data Layer
- `transactionService.ts` abstracts localStorage CRUD — swap for an API client with minimal changes
- `mockData.ts` generates 60+ transactions spanning 6 months with realistic categories

### Form Validation
- **Zod schemas** define the validation rules declaratively
- **React Hook Form** connects schema to form inputs with minimal boilerplate
- Error messages display inline below each field

### Performance
- `useMemo` for filter/sort computation on large transaction lists
- `useCallback` + `debounce` for search input to avoid excessive re-renders
- `AnimatePresence` with `popLayout` for efficient list animation without layout thrashing

---

## 🔮 Future Improvements

- [ ] **Budget Goals** — Set monthly limits per category with alert thresholds
- [ ] **Recurring Transactions** — Mark + auto-generate recurring income/expenses
- [ ] **API Integration** — Replace localStorage with a REST or GraphQL backend
- [ ] **Authentication** — Add NextAuth.js for real user sessions
- [ ] **Multi-currency Support** — Currency selector with live conversion rates
- [ ] **Mobile App** — React Native port sharing the same Zustand store logic
- [ ] **AI Insights** — LLM-powered financial advice based on spending patterns
- [ ] **Data Import** — Upload bank statement CSV for automatic categorization
- [ ] **Notifications** — Browser push notifications for budget alerts
- [ ] **Report Generation** — PDF export of monthly financial reports

---

## 📄 License

MIT License — free to use and modify.

---

<div align="center">
  Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
</div>
