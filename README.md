# 📦 Warehouse Tracking & Planning Tool

A custom-built application to digitize and optimize warehouse and production workflows in a small e-commerce environment.

---

## 🚀 Overview

This project was created to replace inefficient, paper-based warehouse processes with a structured, data-driven system.

Originally, all operations (inventory tracking, production planning) were handled manually using printed sheets, which led to errors, lack of transparency, and significant time loss.

The application introduces a centralized system to manage inventory, track material flow, and support weekly sales planning.

---

## 🧩 Problem

- Manual, paper-based tracking of inventory and materials  
- No centralized data source  
- High risk of errors and missing information  
- Time-consuming planning for weekly sales cycles  
- No visibility into stock levels or product availability  

---

## 💡 Solution

- Built a custom application to track inventory and material usage  
- Digitized all relevant workflows into a structured system  
- Enabled faster and more accurate production planning  
- Replaced spreadsheets and manual processes with a scalable solution  

---

## ⚙️ Tech Stack

- **Backend:** Python, Flask  
- **Database:** PostgreSQL / MySQL  
- **Frontend:** HTML, JavaScript  
- **Tools:** Git, Linux/macOS (CLI)  

---

## 📊 Impact

- ⏱️ Reduced manual work by approximately **8 hours per week**  
- 📉 Lowered risk of human error in inventory tracking  
- 📈 Improved planning efficiency for weekly sales cycles  
- 🔍 Increased transparency of warehouse operations  

---

## 🔄 Development Process

The solution was developed iteratively:

1. Started with **Google Sheets** for basic tracking  
2. Migrated to **AppSheet** for structure  
3. Rebuilt as a **custom application** for full control and scalability  

---

## 🖥️ Features

- Inventory tracking  
- Material flow management  
- Support for production planning  
- Centralized data handling  
- Improved workflow organization  

---

## 🧠 What I Learned

- Building real-world applications to solve business problems  
- Structuring and managing operational data  
- Working with backend frameworks and databases  
- Iterative development and improving systems over time  
- Using CLI (Linux/macOS) for development and workflow management  

---

## 📸 Screenshots

![Workflow](graphics/workflow.png)

![Dashboard](./screenshots/dashboard.png)

![Login](graphics/login.png)

![Dashboard](graphics/dashboard.png)

![Wareneingang](graphics/wareneingang.png)

![Bestand](graphics/bestand.png)

![Aufträge](graphics/auftraege.png)

![Neuer Auftrag](graphics/neuer-auftrag.png)

---

## 📬 Contact

If you're interested in my work or have questions, feel free to reach out.
































# Abpack-Verwaltungssystem

## Überblick

Das Abpack-Verwaltungssystem ist eine moderne Web-App zur Verwaltung und Analyse von Cannabis-Beständen, Aufträgen und Verpackungsprozessen. Die Anwendung unterstützt verschiedene Nutzerrollen (Mitarbeiter, Admin, Entwickler) und bietet eine intuitive Oberfläche für die tägliche Arbeit im Lager und der Produktion.

**Features:**
- Live-Bestand und Auftragsübersicht
- Produktmanagement (CRUD)
- Rollenbasierte Rechteverwaltung
- Tagesstatistiken und Dashboard
- Export von Aufträgen als Excel
- Mobile-optimierte Ansicht
- Benutzerverwaltung und Login

## Workflow

![Workflow der App](graphics/workflow.png)


## Screenshots

### Login
Die Login-Seite ermöglicht den sicheren Zugang für verschiedene Nutzerrollen.
![Login](graphics/login.png)

### Dashboard
Das Dashboard zeigt aktuelle KPIs, offene und fertige Aufträge sowie Statistiken auf einen Blick.
![Dashboard](graphics/dashboard.png)

### Bestand
Hier werden alle aktuellen Bestände übersichtlich angezeigt und verwaltet.
![Bestand](graphics/bestand.png)

### Aufträge
Die Auftragsübersicht listet alle laufenden und abgeschlossenen Aufträge.
![Aufträge](graphics/auftraege.png)

### Neuer Auftrag
Mit wenigen Klicks kann ein neuer Auftrag angelegt werden.
![Neuer Auftrag](graphics/neuer-auftrag.png)

### Wareneingang
Erfassung und Verwaltung von Wareneingängen im System.
![Wareneingang](graphics/wareneingang.png)


## Technologiestack
- **Frontend:** React + TypeScript, Vite
- **Backend:** Node.js, tRPC, Express
- **Datenbank:** MySQL (Drizzle ORM)
- **Auth:** JWT, Cookie-basierte Sessions
- **Dev-Tools:** pnpm, Git

## Aufbau & Hauptlogik

### 1. Datenmodell

```typescript
// Beispiel: Order-Interface
interface Order {
  id: number;
  strain: string;
  strainName: string;
  categoryName: string;
  packagingType: string;
  packages: OrderPackage[];
  neededAmount: number;
  status: string; // 'offen', 'in_bearbeitung', 'fertig'
  createdAt: string | Date;
  updatedAt?: string | Date;
  createdByName?: string;
  processedByName?: string;
}
```

### 2. Dashboard-Logik

Das Dashboard zeigt tagesaktuelle KPIs und Aufträge:
- **Offene/In Bearbeitung:** werden immer übertragen
- **Fertig:** nur Aufträge, die heute abgeschlossen wurden

```typescript
const isToday = (dateInput: string | Date | undefined | null): boolean => {
  if (!dateInput) return false;
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return false;
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

const visibleOrders = orders.filter((o: Order) => {
  if (o.status !== 'fertig') return true;
  return isToday(o.updatedAt) || isToday(o.createdAt);
});
```

### 3. Auftragsanzeige & Sortierung

Alle Aufträge werden nach Status sortiert:
- Offen (oben)
- In Bearbeitung (mitte)
- Fertig (unten)

```typescript
const statusPriority: Record<string, number> = {
  'offen': 0,
  'in_bearbeitung': 1,
  'fertig': 2
};

const filteredOrders = visibleOrders
  .sort((a, b) => (statusPriority[a.status] ?? 99) - (statusPriority[b.status] ?? 99));
```

### 4. Produktmanagement (CRUD)

Admins und Entwickler können Produkte direkt im UI anlegen, bearbeiten und löschen. Die Rechte werden über die Rolle geprüft:

```typescript
const canManageProducts = user?.role === 'admin' || user?.role === 'dev';
```

### 5. Export-Funktion

Aufträge können als Excel-Datei exportiert werden. Der Zeitraum wird über zwei Datumsfelder gefiltert.
