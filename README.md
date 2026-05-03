> Built to replace manual, paper-based warehouse workflows and save ~1 full workday per week

# StockFlow — Warehouse Tracking & Planning Tool

A custom-built full-stack application to digitize and optimize warehouse and production workflows in a small e-commerce environment.

---

## Problem

- Manual, paper-based tracking of inventory and materials
- No centralized data source
- High risk of errors and missing information
- Time-consuming planning for weekly production cycles
- No visibility into stock levels or product availability

---

## Solution

- Built a custom application to track inventory and material usage
- Digitized all relevant workflows into a structured system
- Enabled faster and more accurate production planning
- Replaced spreadsheets and manual processes with a scalable solution

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React · TypeScript · Vite · Tailwind CSS · shadcn/ui |
| Backend | Node.js · tRPC · Express |
| Database | MySQL · Drizzle ORM |
| Auth | JWT · Cookie Sessions · bcrypt |
| Infrastructure | Docker · docker-compose |
| Dev Tools | pnpm · Vitest · Prettier |

---

## Features

- **Inventory management** — real-time stock levels across all product categories
- **Order workflow** — status tracking from open → in progress → done
- **Warehouse entries** — incoming goods with supplier and batch number
- **Analytics tab** — packaging material consumption, employee productivity, top products, reorder forecasts
- **CSV / Excel export** — filterable by time period, Excel-compatible UTF-8
- **Role-based access** — user / admin / dev roles with permission gates
- **Daily reset logic** — completed orders only visible if finished today
- **Audit trail** — full stock history log for every change

---

## Impact

- Reduced manual work by approximately **8 hours per week**
- Lowered risk of human error in inventory tracking
- Improved planning efficiency for weekly production cycles
- Full transparency of warehouse operations in real time

---

## Development Process

The solution was developed iteratively:

1. Started with **Google Sheets** for basic tracking
2. Migrated to **AppSheet** for structure
3. Rebuilt as a **custom full-stack application** for full control and scalability

---

## Screenshots

![Workflow](graphics/workflow.png)

![Login](graphics/login.png)

![Dashboard](graphics/dashboard.png)

![Wareneingang](graphics/wareneingang.png)

![Bestand](graphics/bestand.png)

![Aufträge](graphics/auftraege.png)

![Neuer Auftrag](graphics/neuer-auftrag.png)

---

## Contact

If you're interested in my work or have questions, feel free to reach out.
