# TODO - Abpack Verwaltung

## Pending
- [ ] Add unit tests for remaining endpoints
- [ ] Implement user management (admin panel)
- [ ] PDF export functionality
- [ ] Mobile responsive improvements
- [ ] Change default user passwords in production

## In Progress


## Completed

### Infrastructure
- [x] Initial GitHub repository setup (private)
- [x] Project scaffolding (Vite + React + TypeScript)
- [x] tRPC API setup with type-safe client/server communication
- [x] MySQL database with Drizzle ORM
- [x] Docker configuration (Dockerfile, docker-compose.yml)
- [x] Authentication system (username/password with bcrypt)
- [x] Removed Manus OAuth dependencies
- [x] JWT session tokens with jose library
- [x] User seeding script (scripts/seed-users.ts)

### Database Schema
- [x] Users table with roles (user/admin)
- [x] Users table: username/password fields (bcrypt hashed)
- [x] Stock table for inventory items
- [x] Orders table for packaging orders
- [x] Wareneingaenge table for warehouse entries
- [x] StockHistory table for audit trail

### Backend Features
- [x] Stock management API (CRUD operations)
- [x] Order management (create, update status, delete)
- [x] Warehouse entry tracking (Wareneingaenge)
- [x] Stock history/audit logging
- [x] Real-time stock amount updates
- [x] User authentication & session management

### Frontend Features
- [x] Dashboard layout with navigation
- [x] Stock overview (Blüten, Small Buds, Hash categories)
- [x] Order creation with packaging configuration
- [x] Order status workflow (offen → in_bearbeitung → fertig)
- [x] Warehouse entry form (Lieferant, Chargen-Nr)
- [x] Live data sync (5s polling)
- [x] Two-column layout for "Neuer Auftrag" (matching Wareneingang)
- [x] Product dropdown shows all products (disabled with ⚠️ when 0 stock)
- [x] AI Chat integration component
- [x] Category cards for Bestand tab (table layout per category)
- [x] Order daily reset (fertige Aufträge only visible if completed today)

### Analytics (Analyse Tab)
- [x] Filter bar (Zeitraum, Kategorie, Mitarbeiter)
- [x] "Heute" as zeitraum filter option
- [x] Verpackungsmaterial-Verbrauch (Gläser, Bags, Deckel, Sticker)
- [x] Mitarbeiter-Produktivität (Aufträge pro Mitarbeiter)
- [x] Top 10 Sorten (most packaged strains)
- [x] Nachbestell-Prognose (reorder predictions based on avg consumption)

### Export Features
- [x] CSV export with zeitraum filter (Heute/7d/30d/90d/Alle)
- [x] Export loads all orders from database (not just visible)
- [x] Correct field mapping (createdByName, processedByName)
- [x] "Restmenge eingegeben" boolean column
- [x] Excel-compatible UTF-8 (BOM)
- [x] Dynamic filename with zeitraum and date

### Removed (Cleanup)
- [x] Removed i18n/multi-language support (browser handles translation)
- [x] Removed LanguageSwitcher component
- [x] Removed Manus public folder and dependencies

### Bug Fixes
- [x] Fixed cookie sameSite for localhost (lax instead of none)
- [x] Fixed TypeScript config for scripts folder (node types reference)

### Testing
- [x] Vitest configuration
- [x] ABpack API tests (abpack.test.ts)
- [x] Auth logout tests (auth.logout.test.ts)
- [x] Stock history tests (stock-history.test.ts)
