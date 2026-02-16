# Projektanforderungsdokument

## 1. Projektübersicht

**Projektname:** Abpack-Verwaltungssystem

**Ziel:** Digitalisierung und Optimierung der Cannabis-Bestands- und Verpackungsverwaltung. Bereitstellung einer zentralen Plattform für Auftragsmanagement, Lagerüberwachung und Analyse.

## 2. Stakeholder

- Lager- und Produktionsmitarbeiter
- Teamleiter/Manager
- Administratoren/Entwickler
- Geschäftsführung

## 3. Business Requirements (BI-Standard)

### 3.1. Datenmanagement
- Alle Bestände, Aufträge und Produktdaten werden zentral gespeichert (MySQL).
- Historisierung von Auftragsstatus und Bestandsänderungen.
- Benutzerverwaltung mit Rollen und Rechten.

### 3.2. Reporting & Analyse
- Dashboard mit Tages-KPIs (offen, in Bearbeitung, fertig, Bestandswarnungen).
- Export von Aufträgen als Excel für externe Auswertungen.
- Filtermöglichkeiten nach Zeitraum, Status und Kategorie.

### 3.3. Prozessunterstützung
- Live-Ansicht aller Aufträge und Bestände.
- CRUD-Funktionen für Produkte und Aufträge.
- Mobile-optimierte Oberfläche für schnelle Eingaben.
- Automatische Warnungen bei niedrigem Bestand.

### 3.4. Sicherheit & Compliance
- Authentifizierung mit Username/Passwort (bcrypt, JWT).
- Rollenbasierte Rechte (user, admin, dev).
- Logging von Benutzeraktionen.
- DSGVO-konforme Speicherung und Verarbeitung.

## 4. Funktionale Anforderungen

| Nr. | Anforderung | Beschreibung |
|-----|-------------|--------------|
| F1  | Benutzer-Login | Authentifizierung mit Username/Passwort |
| F2  | Auftragsverwaltung | Anlegen, Bearbeiten, Löschen von Aufträgen |
| F3  | Produktmanagement | CRUD für Produkte, Kategorien flexibel |
| F4  | Dashboard | Tages-KPIs, Bestandswarnungen, Statusübersicht |
| F5  | Export | Excel-Export mit Filterung nach Zeitraum |
| F6  | Rollenverwaltung | Rechte für Admin/Dev/Mitarbeiter |
| F7  | Mobile-Ansicht | Responsive Design für Smartphones |
| F8  | Analyse | Filter und Auswertung von Aufträgen |

## 5. Nicht-funktionale Anforderungen

- Performance: Live-Updates, schnelle Ladezeiten
- Skalierbarkeit: Erweiterbar für neue Kategorien und Nutzer
- Usability: Intuitive UI, klare Navigation
- Sicherheit: Verschlüsselte Passwörter, sichere Sessions
- Wartbarkeit: Modularer Code, Dokumentation

## 6. Datenmodell (Auszug)

```sql
CREATE TABLE orders (
  id INT PRIMARY KEY,
  strain VARCHAR(50),
  strainName VARCHAR(100),
  categoryName VARCHAR(50),
  packagingType VARCHAR(50),
  packages JSON,
  neededAmount DECIMAL(10,2),
  status VARCHAR(20),
  createdAt DATETIME,
  updatedAt DATETIME,
  createdByUserId INT,
  processedByUserId INT
);
```

## 7. Akzeptanzkriterien

- Alle Nutzer können sich erfolgreich anmelden.
- Aufträge werden korrekt nach Status sortiert und angezeigt.
- Export-Funktion liefert Excel-Dateien mit korrektem Filter.
- Bestandswarnungen werden bei Unterschreitung angezeigt.
- Rollen und Rechte funktionieren wie spezifiziert.

## 8. Risiken & Annahmen

- Datenbankausfälle werden durch Backups abgesichert.
- Nutzer benötigen Grundkenntnisse im Umgang mit Web-Apps.
- Erweiterungen (z.B. API, Analyse) sind geplant, aber nicht initial enthalten.

## 9. Projektorganisation

- Projektleitung: Geschäftsführung
- Entwicklung: Dev-Team
- Betrieb: IT-Abteilung
- Support: Admins

---

**Letzte Änderung:** 16.02.2026
