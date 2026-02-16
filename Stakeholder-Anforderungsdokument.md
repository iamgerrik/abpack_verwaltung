# Stakeholder-Anforderungsdokument

## 1. Projekt: Abpack-Verwaltungssystem

### 2. Stakeholder-Übersicht

| Name         | Rolle                | Interessen/Ziele                  | Einfluss auf Projekt |
|--------------|----------------------|-----------------------------------|---------------------|
| Mitarbeiter  | Nutzer               | Effiziente Auftragsbearbeitung, einfache Bedienung, mobile Nutzung | Hoch                |
| Teamleiter   | Supervisor           | Übersicht, Kontrolle, Reporting, Fehleranalyse           | Mittel              |
| Admin        | Systemverwaltung     | Benutzerverwaltung, Rechte, Sicherheit                   | Hoch                |
| Entwickler   | IT/Entwicklung       | Wartbarkeit, Erweiterbarkeit, Codequalität               | Hoch                |
| Geschäftsführung | Management        | Kosten, Effizienz, Compliance, Reporting                 | Hoch                |

### 3. Anforderungen je Stakeholder

#### Mitarbeiter
- Schnelle und intuitive Bedienung
- Mobile-optimierte Oberfläche
- Übersicht über aktuelle Aufträge und Bestände
- Einfache Eingabe von Wareneingängen und Auftragsstatus

#### Teamleiter
- Dashboard mit Tages-KPIs
- Filter- und Analysefunktionen
- Export von Aufträgen
- Fehler- und Bestandswarnungen

#### Admin
- Benutzerverwaltung (Anlegen, Löschen, Rollen)
- Rechtevergabe
- Sicherheit (Login, Passwort-Hashing)
- Logging von Aktionen

#### Entwickler
- Modularer, wartbarer Code
- Dokumentation und Tests
- Erweiterbarkeit (API, neue Features)
- Performance und Skalierbarkeit

#### Geschäftsführung
- Reporting (Excel-Export, Analyse)
- Compliance (DSGVO, Sicherheit)
- Kostenkontrolle
- Übersicht über Lager und Produktion

### 4. Priorisierung der Anforderungen

| Prio | Anforderung                | Stakeholder      |
|------|----------------------------|------------------|
| 1    | Benutzer-Login             | Admin, Mitarbeiter|
| 1    | Dashboard/KPIs             | Teamleiter, GF   |
| 1    | Mobile-Ansicht             | Mitarbeiter      |
| 2    | Export/Auswertung          | Teamleiter, GF   |
| 2    | Produktmanagement (CRUD)   | Admin, Entwickler|
| 2    | Bestandswarnungen          | Mitarbeiter, TL  |
| 3    | Analysefunktionen          | Teamleiter, GF   |
| 3    | Erweiterbarkeit/API        | Entwickler       |

### 5. Akzeptanzkriterien je Stakeholder

- **Mitarbeiter:** Bedienung ohne Schulung möglich, mobile Ansicht funktioniert
- **Teamleiter:** KPIs und Filter liefern korrekte Ergebnisse, Export funktioniert
- **Admin:** Benutzer können verwaltet werden, Rechte greifen korrekt
- **Entwickler:** Code ist dokumentiert, Tests vorhanden, Erweiterungen möglich
- **Geschäftsführung:** Reporting und Compliance sind gewährleistet

### 6. Kommunikationswege

- Regelmäßige Meetings (wöchentlich)
- Feedback-Schleifen mit Endanwendern
- Dokumentation im Projekt-Repo
- Support durch Admin/IT

---

**Letzte Änderung:** 16.02.2026
