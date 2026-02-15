# TODO - Abpack Verwaltung

## Pending
- [ ] Add unit tests for remaining endpoints
- [ ] Implement user management (admin panel)
- [ ] Add export functionality (CSV/PDF)
- [ ] Mobile responsive improvements

## In Progress


## Completed

### Infrastructure
- [x] Initial GitHub repository setup (private)
- [x] Project scaffolding (Vite + React + TypeScript)
- [x] tRPC API setup with type-safe client/server communication
- [x] MySQL database with Drizzle ORM
- [x] Docker configuration (Dockerfile, docker-compose.yml)
- [x] Authentication system (Manus OAuth)

### Database Schema
- [x] Users table with roles (user/admin)
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
- [x] Multi-language support (i18n)
- [x] Language switcher component
- [x] AI Chat integration component

### Testing
- [x] Vitest configuration
- [x] ABpack API tests (abpack.test.ts)
- [x] Auth logout tests (auth.logout.test.ts)
- [x] Stock history tests (stock-history.test.ts)
