import React, { useState } from 'react';
import { AlertCircle, Package, CheckCircle, Clock, Plus, Trash2, TrendingUp, LogOut, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { trpc } from '../lib/trpc';
import { useQueryClient } from '@tanstack/react-query';

interface StockItem {
  id: string;
  category: string;
  name: string;
  hersteller: string;
  menge: number;
  lastUpdatedBy?: string;  // Wer hat zuletzt aktualisiert
  lastUpdatedAt?: string;  // Wann wurde zuletzt aktualisiert
}

interface OrderPackage {
  size: number;
  quantity: number;
  isCustom: boolean;
  packagingType?: string;
}

interface Order {
  id: number;
  strain: string;
  strainName: string;
  categoryName: string;
  packagingType: string;
  packages: OrderPackage[];
  neededAmount: number;
  status: string;
  createdAt: string;
  updatedAt?: string;  // Zeitpunkt der letzten Statusänderung
  createdTimestamp?: number;
  remainder?: number;
  createdByName?: string;  // Username der Person, die den Auftrag erstellt hat
  processedByName?: string; // Username der Person, die den Auftrag bearbeitet
}

interface Wareneingang {
  id: number;
  strain: string;
  menge: number;
  lieferant: string;
  chargenNr: string;
  category: string;
  strainName: string;
  categoryName: string;
  datum: string;
}

const AbpackVerwaltung = () => {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [users, setUsers] = useState<Array<{id: number; username: string; role: string}>>([]);
  
  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  // Lade Benutzerliste beim Komponenten-Mount
  React.useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Failed to load users:', err));
  }, []);

  // ========== tRPC Queries ==========
  const stockQuery = trpc.abpack.getStock.useQuery(undefined, {
    refetchInterval: 5000, // Refresh alle 5 Sekunden für Live-Sync
  });
  const ordersQuery = trpc.abpack.getOrders.useQuery(undefined, {
    refetchInterval: 5000,
  });
  const wareneingaengeQuery = trpc.abpack.getWareneingaenge.useQuery(undefined, {
    refetchInterval: 5000,
  });

  // ========== tRPC Mutations ==========
  const createOrderMutation = trpc.abpack.createOrder.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [['abpack', 'getOrders']] });
      queryClient.invalidateQueries({ queryKey: [['abpack', 'getStock']] });
    },
  });
  const updateOrderStatusMutation = trpc.abpack.updateOrderStatus.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [['abpack', 'getOrders']] });
    },
  });
  const updateOrderRemainderMutation = trpc.abpack.updateOrderRemainder.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [['abpack', 'getOrders']] });
    },
  });
  const deleteOrderMutation = trpc.abpack.deleteOrder.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [['abpack', 'getOrders']] });
      queryClient.invalidateQueries({ queryKey: [['abpack', 'getStock']] });
    },
  });
  const updateStockMengeMutation = trpc.abpack.updateStockMenge.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [['abpack', 'getStock']] });
    },
  });
  const createWareneingangMutation = trpc.abpack.createWareneingang.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [['abpack', 'getWareneingaenge']] });
      queryClient.invalidateQueries({ queryKey: [['abpack', 'getStock']] });
    },
  });
  
  // Aktualisierter Bestand basierend auf dem Foto
  const initialStock = [
    // BLÜTEN
    { id: 'MJ1', category: 'blueten', name: 'Meer Jane 1', hersteller: 'Blue Dream, Tutti Frutti', menge: 1670 },
    { id: 'MJ2', category: 'blueten', name: 'Meer Jane 2', hersteller: 'Angel ..., Buddha', menge: 0 },
    { id: 'AL', category: 'blueten', name: 'AL', hersteller: 'Lemon Cookies', menge: 335 },
    { id: 'AH', category: 'blueten', name: 'AH', hersteller: 'Citrup', menge: 0 },
    { id: 'BK', category: 'blueten', name: 'BK', hersteller: 'Candy Kush', menge: 475 },
    { id: 'GE', category: 'blueten', name: 'GE', hersteller: 'Alien Fruit', menge: 7 },
    { id: 'GG', category: 'blueten', name: 'GG', hersteller: '', menge: 985 },
    { id: 'GP', category: 'blueten', name: 'GP', hersteller: 'Vanilla Kush', menge: 170 },
    { id: 'GSC', category: 'blueten', name: 'GSC', hersteller: 'Coockies', menge: 241 },
    { id: 'HQ', category: 'blueten', name: 'HQ', hersteller: 'Orange Martini', menge: 0 },
    { id: 'NL', category: 'blueten', name: 'NL', hersteller: 'Purple Money', menge: 169 },
    { id: 'PB', category: 'blueten', name: 'PB', hersteller: 'Frosted Sunset', menge: 910 },
    
    // SMALL BUDS
    { id: 'SB_POPCORN', category: 'smallbuds', name: 'SB Popcorn', hersteller: '', menge: 1780 },
    { id: 'SB_SKYWALKER', category: 'smallbuds', name: 'SB Skywalker', hersteller: '', menge: 0 },
    { id: 'SB_BANANA', category: 'smallbuds', name: 'SB Banana', hersteller: '', menge: 0 },
    { id: 'SB_GSC', category: 'smallbuds', name: 'SB GSC', hersteller: '', menge: 0 },
    { id: 'SB_STRAWBERRY', category: 'smallbuds', name: 'SB Strawberry', hersteller: '', menge: 800 },
    
    // HASH
    { id: 'H_SD', category: 'hash', name: 'Super Dry', hersteller: '', menge: 34 },
    { id: 'H_SDAL', category: 'hash', name: 'SD AL', hersteller: '', menge: 155 },
    { id: 'H_SDBK', category: 'hash', name: 'SD BK', hersteller: '', menge: 249 },
    { id: 'H_SDGE', category: 'hash', name: 'SD GE', hersteller: '', menge: 393 },
    { id: 'H_SDGG', category: 'hash', name: 'SD GG (ACDC)', hersteller: '', menge: 279 },
    { id: 'H_AMN', category: 'hash', name: 'Amnesia (BZN)', hersteller: '', menge: 400 },
    { id: 'H_CHAR', category: 'hash', name: 'Charas (CBN)', hersteller: '', menge: 19 },
    { id: 'H_POLL', category: 'hash', name: 'Pollen', hersteller: '', menge: 590 },
    { id: 'H_BUBB', category: 'hash', name: 'Bubble Ice', hersteller: '', menge: 937 },
    { id: 'H_KIFF', category: 'hash', name: 'Kiff', hersteller: '', menge: 2412 },
    { id: 'H_SHATTER', category: 'hash', name: 'Shatter', hersteller: '', menge: 0 },
    
    // EXTRACTS
    { id: 'EXT_STARDUST', category: 'extracts', name: 'Stardust', hersteller: '', menge: 1 },
    { id: 'EXT_GOLDWAX_NORM', category: 'extracts', name: 'Gold Wax Normal', hersteller: '', menge: 51 },
    { id: 'EXT_GOLDWAX_PB', category: 'extracts', name: 'Gold Wax PB', hersteller: '', menge: 166 },
    { id: 'EXT_GOLDWAX_AH', category: 'extracts', name: 'Gold Wax AH', hersteller: '', menge: 265 },
    { id: 'EXT_LIQUID_NORM', category: 'extracts', name: 'Liquid Normal', hersteller: '', menge: 180 },
    { id: 'EXT_LIQUID_PB', category: 'extracts', name: 'Liquid PB', hersteller: '', menge: 150 },
    { id: 'EXT_LIQUID_AH', category: 'extracts', name: 'Liquid AH', hersteller: '', menge: 0 },
    { id: 'EXT_CRUMBLE_BAICO', category: 'extracts', name: 'Crumble Baico Gelato', hersteller: '', menge: 108 },
    { id: 'EXT_CRUMBLE_GG', category: 'extracts', name: 'Crumble GG', hersteller: '', menge: 0 },
    { id: 'EXT_CRUMBLE_LEMON', category: 'extracts', name: 'Crumble Lemon', hersteller: '', menge: 0 },
    { id: 'EXT_ROSIN', category: 'extracts', name: 'Rosin', hersteller: '', menge: 5 },
    
    // MOONROCKS
    { id: 'MR_ICE', category: 'moonrocks', name: 'Moon Rock Ice', hersteller: '', menge: 0 },
    { id: 'MR_NORMAL', category: 'moonrocks', name: 'Moon Rock', hersteller: '', menge: 0 },
    { id: 'MR_BERRY', category: 'moonrocks', name: 'Moon Rock Berry', hersteller: '', menge: 0 },
    
    // TRIM
    { id: 'TRIM', category: 'trim', name: 'TRIM', hersteller: '', menge: 0 },
    { id: 'TRIM_NORMAL', category: 'trim', name: 'Trim', hersteller: '', menge: 2800 },
    { id: 'GREENHOUSE', category: 'trim', name: 'Greenhouse', hersteller: '', menge: 0 },
    
    // ANDERE
    { id: 'FILTER', category: 'andere', name: 'FILTER (Stk.)', hersteller: '', menge: 77600 },
    { id: 'HERBAL', category: 'andere', name: 'Herbal Blend', hersteller: '', menge: 1845 },
    
    // EXTRACTS (continued)
    { id: 'EXT_CRUMBLE_NATURAL', category: 'extracts', name: 'Crumble Natural', hersteller: '', menge: 0 }
  ];

  // Aktualisierte Verpackungsgrößen
  const packagingSizes: { [key: string]: number[] | boolean } = {
    glas: [1, 2, 5],
    bag: [1, 2, 5, 10, 25, 50],
    custom: true // Option für custom Größen
  };

  // ========== Daten aus tRPC Queries (mit Fallback auf initialStock) ==========
  const stock: StockItem[] = (stockQuery.data ?? initialStock).map(s => ({
    id: s.id,
    category: s.category,
    name: typeof s.name === 'string' ? s.name : '',
    hersteller: typeof s.hersteller === 'string' ? s.hersteller : '',
    menge: typeof s.menge === 'string' ? parseFloat(s.menge) : (s.menge ?? 0),
  }));
  
  const orders: Order[] = (ordersQuery.data ?? []).map(o => ({
    id: o.id,
    strain: o.strain,
    strainName: typeof o.strainName === 'string' ? o.strainName : '',
    categoryName: o.categoryName,
    packagingType: o.packagingType,
    packages: Array.isArray(o.packages) ? o.packages as OrderPackage[] : [],
    neededAmount: typeof o.neededAmount === 'string' ? parseFloat(o.neededAmount) : (o.neededAmount ?? 0),
    status: o.status,
    createdAt: o.createdAt instanceof Date ? o.createdAt.toLocaleString('de-DE') : String(o.createdAt),
    createdTimestamp: o.createdAt instanceof Date ? o.createdAt.getTime() : Date.parse(String(o.createdAt)),
    remainder: o.remainder ? (typeof o.remainder === 'string' ? parseFloat(o.remainder) : o.remainder) : undefined,
    createdByName: (o as any).createdByName || undefined,
    processedByName: (o as any).processedByName || undefined,
  }));

  const wareneingaenge: Wareneingang[] = (wareneingaengeQuery.data ?? []).map(w => ({
    id: w.id,
    strain: w.strain,
    menge: typeof w.menge === 'string' ? parseFloat(w.menge) : (w.menge ?? 0),
    lieferant: typeof w.lieferant === 'string' ? w.lieferant : '',
    chargenNr: typeof w.chargenNr === 'string' ? w.chargenNr : '',
    category: w.category,
    strainName: typeof w.strainName === 'string' ? w.strainName : '',
    categoryName: w.categoryName,
    datum: w.createdAt instanceof Date ? w.createdAt.toLocaleString('de-DE') : String(w.createdAt),
  }));

  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
  const [remainderInput, setRemainderInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'offen' | 'in_bearbeitung' | 'fertig'>('all');
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [orderDateRange, setOrderDateRange] = useState<'all' | 'today' | '7d' | '30d'>('all');
  
  // Analyse-Filter
  const [analyseZeitraum, setAnalyseZeitraum] = useState<'heute' | '7d' | '30d' | '90d' | '365d' | 'all'>('30d');
  const [analyseKategorie, setAnalyseKategorie] = useState<string>('all');
  const [analyseMitarbeiter, setAnalyseMitarbeiter] = useState<string>('all');
  
  const [newOrder, setNewOrder] = useState<{
    strain: string;
    packagingType: string;
    packages: OrderPackage[];
    category: string;
  }>({
    strain: '',
    packagingType: 'bag',
    packages: [],
    category: 'blueten'
  });
  const [tempPackage, setTempPackage] = useState<{
    size: number;
    customSize: string;
    quantity: string;
  }>({
    size: 1,
    customSize: '',
    quantity: '1'
  });
  const [wareneingang, setWareneingang] = useState({
    strain: '',
    menge: '',
    lieferant: '',
    chargenNr: '',
    category: 'blueten'
  });
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Berechne benötigte Menge (mit 0,3g Toleranz pro Produkt)
  const calculateNeededAmount = (size: number, quantity: number): number => {
    return Math.round((size * quantity + (quantity * 0.3)) * 10) / 10;
  };

  // Bestandsstatus ermitteln
  const getStockStatus = (item: StockItem) => {
    if (item.category === 'andere' && item.id === 'FILTER') {
      return item.menge > 1000 ? 'ok' : item.menge === 0 ? 'empty' : 'low';
    }
    return item.menge === 0 ? 'empty' : item.menge < 100 ? 'low' : 'ok';
  };

  // Hole verfügbare Sorten nach Kategorie
  const getAvailableStrains = (category: string): StockItem[] => {
    if (category === 'all') return stock;
    return stock.filter((s: StockItem) => s.category === category);
  };

  // Erstelle neuen Auftrag
  const createOrder = async () => {
    if (!newOrder.strain) {
      alert('Bitte Sorte auswählen!');
      return;
    }

    if (newOrder.packages.length === 0) {
      alert('Bitte mindestens eine Verpackung hinzufügen!');
      return;
    }

    const selectedStock = stock.find(s => s.id === newOrder.strain);
    
    if (!selectedStock) {
      alert('Sorte nicht gefunden!');
      return;
    }
    
    const totalNeededAmount = newOrder.packages.reduce((sum, pkg) => {
      return sum + calculateNeededAmount(pkg.size, pkg.quantity);
    }, 0);

    const availableAmount = selectedStock.menge;

    if (availableAmount < totalNeededAmount) {
      alert(`Nicht genug Bestand! Verfügbar: ${availableAmount}g, Benötigt: ${totalNeededAmount}g`);
      return;
    }

    try {
      // Auftrag in DB erstellen
      await createOrderMutation.mutateAsync({
        strain: newOrder.strain,
        strainName: selectedStock.name,
        categoryName: selectedStock.category,
        packagingType: newOrder.packagingType,
        packages: newOrder.packages,
        neededAmount: totalNeededAmount,
      });

      // Bestand in DB reduzieren
      await updateStockMengeMutation.mutateAsync({
        stockId: newOrder.strain,
        newMenge: availableAmount - totalNeededAmount,
      });

      alert('Auftrag erfolgreich erstellt!');

      // Formular zurücksetzen
      setNewOrder({
        strain: '',
        packagingType: 'bag',
        packages: [],
        category: 'blueten'
      });
      setTempPackage({
        size: 1,
        customSize: '',
        quantity: '1'
      });

      setActiveTab('orders');
    } catch (error) {
      console.error('Fehler beim Erstellen des Auftrags:', error);
      alert('Fehler beim Erstellen des Auftrags!');
    }
  };

  // Verpackung zur Liste hinzufügen
  const addPackage = () => {
    const size = tempPackage.customSize ? parseFloat(tempPackage.customSize) : tempPackage.size;
    
    const qtyValue = parseInt(String(tempPackage.quantity));
    if (!size || size <= 0 || isNaN(qtyValue) || qtyValue <= 0) {
      alert('Bitte gültige Größe und Anzahl eingeben!');
      return;
    }
    const quantity = qtyValue || 1;
    const newPackage: OrderPackage = {
      size,
      quantity: quantity || 1,
      isCustom: !!tempPackage.customSize,
      packagingType: newOrder.packagingType
    };

    setNewOrder({
      ...newOrder,
      packages: [...newOrder.packages, newPackage]
    });

    setTempPackage({
      size: tempPackage.size,
      customSize: '',
      quantity: '1'
    });
  };

  // Verpackung aus Liste entfernen
  const removePackage = (index: number) => {
    setNewOrder({
      ...newOrder,
      packages: newOrder.packages.filter((_, i) => i !== index)
    });
  };

  // Auftragsstatus ändern
  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderStatusMutation.mutateAsync({
        orderId,
        status: newStatus,
      });
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Status:', error);
      alert('Fehler beim Aktualisieren des Status!');
    }
  };

  // Restmenge speichern - IST der neue absolute Bestand der Sorte
  const saveRemainder = async (orderId: number, remainder: string) => {
    const newStockValue = parseFloat(remainder);
    if (isNaN(newStockValue)) {
      alert('Bitte gültige Restmenge eingeben!');
      return;
    }
    
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    // Finde alten Bestand
    const oldStock = stock.find(s => s.id === order.strain);
    const oldValue = oldStock ? oldStock.menge : 0;
    
    try {
      // Update Stock mit neuem absoluten Bestand
      await updateStockMengeMutation.mutateAsync({
        stockId: order.strain,
        newMenge: newStockValue,
      });
      
      // Auftrag Restmenge speichern
      await updateOrderRemainderMutation.mutateAsync({
        orderId,
        remainder: newStockValue,
      });

      // Auftrag auf Status "fertig" setzen
      await updateOrderStatusMutation.mutateAsync({
        orderId,
        status: 'fertig',
      });
      
      setEditingOrderId(null);
      setRemainderInput('');
      alert(`✅ Bestand aktualisiert!\n${order.strainName}: ${oldValue}g → ${newStockValue}g`);
    } catch (error) {
      console.error('Fehler beim Speichern der Restmenge:', error);
      alert('Fehler beim Speichern der Restmenge!');
    }
  };

  // Auftrag löschen (und Bestand wiederherstellen)
  const deleteOrder = async (orderId: number) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    try {
      // Bei offenen Aufträgen: Bestand wiederherstellen
      if (order.status === 'offen') {
        const currentStock = stock.find(s => s.id === order.strain);
        const currentMenge = currentStock ? currentStock.menge : 0;
        await updateStockMengeMutation.mutateAsync({
          stockId: order.strain,
          newMenge: currentMenge + order.neededAmount,
        });
      }
      
      // Auftrag löschen
      await deleteOrderMutation.mutateAsync({ orderId });
    } catch (error) {
      console.error('Fehler beim Löschen des Auftrags:', error);
      alert('Fehler beim Löschen des Auftrags!');
    }
  };

  const bucheWareneingang = async () => {
    const mengeValue = parseFloat(String(wareneingang.menge));
    if (!wareneingang.strain || isNaN(mengeValue) || mengeValue <= 0) {
      alert('Bitte Sorte und Menge eingeben!');
      return;
    }

    const selectedStock = stock.find(s => s.id === wareneingang.strain);
    
    if (!selectedStock) {
      alert('Sorte nicht gefunden!');
      return;
    }
    
    try {
      // Wareneingang in DB erstellen
      await createWareneingangMutation.mutateAsync({
        strain: wareneingang.strain,
        menge: mengeValue,
        lieferant: wareneingang.lieferant || undefined,
        chargenNr: wareneingang.chargenNr || undefined,
        category: wareneingang.category,
        strainName: selectedStock.name,
        categoryName: selectedStock.category,
      });

      // Bestand in DB erhöhen
      await updateStockMengeMutation.mutateAsync({
        stockId: wareneingang.strain,
        newMenge: selectedStock.menge + mengeValue,
      });

      // Formular zurücksetzen
      setWareneingang({
        strain: '',
        menge: '',
        lieferant: '',
        chargenNr: '',
        category: 'blueten'
      });

      alert('Wareneingang erfolgreich gebucht!');
    } catch (error) {
      console.error('Fehler beim Buchen des Wareneingangs:', error);
      alert('Fehler beim Buchen des Wareneingangs!');
    }
  };

  // Hilfsfunktion: Prüft ob ein Datum heute ist
  const isToday = (dateStr: string): boolean => {
    const date = new Date(dateStr);
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  // Filter: Fertige Aufträge nur anzeigen wenn heute abgeschlossen
  // Offene und In Bearbeitung werden immer angezeigt
  const visibleOrders = orders.filter((o: Order) => {
    if (o.status !== 'fertig') return true; // nicht-fertige immer zeigen
    // Fertige nur wenn heute abgeschlossen (updatedAt = heute)
    if (o.updatedAt) {
      return isToday(o.updatedAt);
    }
    // Fallback auf createdAt wenn kein updatedAt
    return isToday(o.createdAt);
  });

  // Statistiken (basierend auf sichtbaren Aufträgen)
  const stats = {
    offeneAuftraege: visibleOrders.filter((o: Order) => o.status === 'offen').length,
    inBearbeitung: visibleOrders.filter((o: Order) => o.status === 'in_bearbeitung').length,
    fertig: visibleOrders.filter((o: Order) => o.status === 'fertig').length,
    niedrigerBestand: stock.filter((s: StockItem) => s.category !== 'andere' && (getStockStatus(s) === 'low' || getStockStatus(s) === 'empty')).length
  };

  // Kategorie-Namen
  const categoryNames: { [key: string]: string } = {
    blueten: 'Blüten',
    smallbuds: 'Small Buds',
    hash: 'Hash',
    extracts: 'Extracts',
    moonrocks: 'Moonrocks',
    trim: 'Trim',
    andere: 'Andere'
  };

  // Display-Kategorien für gruppierte Kartenansicht
  const displayCategoryOrder = [
    'blueten',
    'moonrocks',
    'smallbuds',
    'trim',
    'herbal',
    'filter',
    'crumble',
    'hash',
    'superdry',
    'extracts',
    'andere'
  ];

  const displayCategoryLabels: { [key: string]: string } = {
    blueten: 'Blüten',
    moonrocks: 'Moonrocks',
    smallbuds: 'Small Buds',
    trim: 'Trim',
    herbal: 'Herbal',
    filter: 'Filter',
    crumble: 'Crumble',
    hash: 'Hash',
    superdry: 'Superdry',
    extracts: 'Extracts',
    andere: 'Sonstige'
  };

  // Funktion zur Bestimmung der Display-Kategorie basierend auf Name/DB-Kategorie
  const getDisplayCategory = (item: StockItem): string => {
    const nameLower = item.name.toLowerCase();
    
    // Name-basierte Zuordnung (hat Priorität)
    if (nameLower.includes('herbal')) return 'herbal';
    if (nameLower.includes('filter')) return 'filter';
    if (nameLower.includes('crumble')) return 'crumble';
    if (nameLower.includes('superdry') || nameLower.startsWith('sd ') || nameLower === 'sd') return 'superdry';
    
    // DB-Kategorie basierte Zuordnung
    if (item.category === 'blueten') return 'blueten';
    if (item.category === 'moonrocks') return 'moonrocks';
    if (item.category === 'smallbuds') return 'smallbuds';
    if (item.category === 'trim') return 'trim';
    if (item.category === 'hash') return 'hash';
    if (item.category === 'extracts') return 'extracts';
    
    return 'andere';
  };

  // Gruppiere Stock nach Display-Kategorien
  const groupedStock = stock.reduce((acc: { [key: string]: StockItem[] }, item: StockItem) => {
    const displayCat = getDisplayCategory(item);
    if (!acc[displayCat]) acc[displayCat] = [];
    acc[displayCat].push(item);
    return acc;
  }, {});

  const filteredOrders = visibleOrders
    .filter((o) => (orderStatusFilter === 'all' ? true : o.status === orderStatusFilter))
    .filter((o) => {
      if (orderDateRange === 'all') return true;
      const ts = o.createdTimestamp ?? Date.parse(o.createdAt);
      if (Number.isNaN(ts)) return true;
      const now = Date.now();
      const start = (() => {
        if (orderDateRange === 'today') {
          const d = new Date();
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        }
        if (orderDateRange === '7d') {
          return now - 7 * 24 * 60 * 60 * 1000;
        }
        // '30d'
        return now - 30 * 24 * 60 * 60 * 1000;
      })();
      return ts >= start;
    });

  // Export-Funktion: Alle Aufträge aus DB (nicht nur gefilterte/sichtbare)
  const exportOrders = (format: 'csv' | 'xlsx', exportZeitraum: 'heute' | '7d' | '30d' | '90d' | 'all' = '7d') => {
    const delimiter = format === 'csv' ? ';' : '\t';
    
    // Zeitraum-Filter für Export
    const exportCutoff = (() => {
      if (exportZeitraum === 'all') return 0;
      if (exportZeitraum === 'heute') {
        const heute = new Date();
        heute.setHours(0, 0, 0, 0);
        return heute.getTime();
      }
      const tage = exportZeitraum === '7d' ? 7 : exportZeitraum === '30d' ? 30 : 90;
      return Date.now() - tage * 24 * 60 * 60 * 1000;
    })();
    
    // ALLE Aufträge aus DB filtern (nicht nur sichtbare)
    const exportAuftraege = orders.filter((o: Order) => {
      const ts = o.createdTimestamp ?? Date.parse(o.createdAt);
      return exportCutoff === 0 || ts >= exportCutoff;
    });
    
    const headers = [
      'ID',
      'Kategorie',
      'Sorte',
      'Verpackungstyp',
      'Verpackungen',
      'Benötigte Menge (g)',
      'Status',
      'Erstellt von',
      'Bearbeitet von',
      'Restmenge (g)',
      'Restmenge eingegeben',
      'Erstellt am',
      'Geändert am'
    ];

    const rows = exportAuftraege.map((o: Order) => {
      const pkgSummary = o.packages
        .map((p: OrderPackage) => `${p.quantity}x ${p.size}g ${p.packagingType || ''}`.trim())
        .join(' | ');
      return [
        o.id,
        categoryNames[o.categoryName] || o.categoryName,
        o.strainName,
        o.packagingType,
        pkgSummary,
        o.neededAmount,
        o.status === 'offen' ? 'Offen' : o.status === 'in_bearbeitung' ? 'In Bearbeitung' : 'Fertig',
        o.createdByName || '-',
        o.processedByName || '-',
        o.remainder ?? '-',
        o.remainder !== undefined && o.remainder !== null ? 'Ja' : 'Nein',
        o.createdAt,
        o.updatedAt || '-'
      ];
    });

    const escapeCell = (value: unknown) => {
      const str = String(value ?? '');
      if (str.includes('"') || str.includes(delimiter) || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const content = [headers, ...rows]
      .map((row) => row.map((cell) => escapeCell(cell)).join(delimiter))
      .join('\n');

    // Dateiname mit Zeitraum
    const zeitraumLabel = exportZeitraum === 'heute' ? 'heute' : exportZeitraum === '7d' ? '7tage' : exportZeitraum === '30d' ? '30tage' : exportZeitraum === '90d' ? '90tage' : 'alle';
    const datumStr = new Date().toISOString().split('T')[0];
    
    const blob = new Blob(['\uFEFF' + content], { // BOM für Excel UTF-8
      type:
        format === 'csv'
          ? 'text/csv;charset=utf-8;'
          : 'application/vnd.ms-excel'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `auftraege_${zeitraumLabel}_${datumStr}.${format === 'csv' ? 'csv' : 'xls'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Abpack-Verwaltungssystem</h1>
            <p className="text-gray-600">Cannabis Inventory & Packaging Management</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 border border-red-200 transition text-sm"
          >
            <LogOut size={16} />
            logout {user?.username}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('wareneingang')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'wareneingang'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Wareneingang
          </button>
          <button
            onClick={() => setActiveTab('newOrder')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'newOrder'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Neuer Auftrag
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Aufträge ({orders.filter((o: Order) => o.status !== 'fertig').length})
          </button>
          <button
            onClick={() => setActiveTab('stock')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'stock'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Bestand
          </button>
          <button
            onClick={() => setActiveTab('analyse')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'analyse'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center gap-2"><BarChart3 size={16} /> Analyse</span>
          </button>
        </div>

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Offene Aufträge</p>
                    <p className="text-3xl font-bold text-orange-600">{stats.offeneAuftraege}</p>
                  </div>
                  <Clock className="text-orange-600" size={32} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">In Bearbeitung</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.inBearbeitung}</p>
                  </div>
                  <Package className="text-blue-600" size={32} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Fertig</p>
                    <p className="text-3xl font-bold text-green-600">{stats.fertig}</p>
                  </div>
                  <CheckCircle className="text-green-600" size={32} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Niedriger Bestand</p>
                    <p className="text-3xl font-bold text-red-600">{stats.niedrigerBestand}</p>
                  </div>
                  <AlertCircle className="text-red-600" size={32} />
                </div>
              </div>
            </div>

            {/* Aktuelle Aufträge */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Aktuelle Aufträge</h2>
              {visibleOrders.filter((o: Order) => o.status !== 'fertig').length === 0 ? (
                <p className="text-gray-500">Keine aktiven Aufträge</p>
              ) : (
                <div className="space-y-3">
                  {visibleOrders.filter((o: Order) => o.status !== 'fertig').map((order: Order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{order.strainName}</p>
                        <div className="text-sm text-gray-600">
                          {(() => {
                            const grouped: Record<string, OrderPackage[]> = order.packages.reduce((acc: Record<string, OrderPackage[]>, p: OrderPackage) => {
                              const key = (p.packagingType || 'bag');
                              if (!acc[key]) acc[key] = [];
                              acc[key].push(p);
                              return acc;
                            }, {});

                            return Object.entries(grouped).map(([type, pkgs]) => (
                              <div key={type} className="mb-1">
                                <div className="font-medium lowercase">{type}:</div>
                                <div className="ml-2">
                                  {pkgs.map((p, i) => (
                                    <div key={i} className="text-gray-700">{p.quantity}x&nbsp;&nbsp;{p.size}g</div>
                                  ))}
                                </div>
                              </div>
                            ));
                          })()}
                        </div>
                        <p className="text-xs text-gray-500">Gesamt: {order.neededAmount}g</p>
                      </div>
                      <div className="flex gap-2">
                        {order.status === 'offen' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'in_bearbeitung')}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                          >
                            Starten
                          </button>
                        )}
                        {order.status === 'in_bearbeitung' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'fertig')}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                          >
                            Fertig
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bestandswarnungen */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Bestandswarnungen</h2>
              {stats.niedrigerBestand === 0 ? (
                <p className="text-gray-500">Alle Bestände ausreichend</p>
              ) : (
                <div className="space-y-2">
                  {stock
                    .filter((s: StockItem) => s.category !== 'andere' && (getStockStatus(s) === 'low' || getStockStatus(s) === 'empty'))
                    .map((s: StockItem) => (
                      <div key={s.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div>
                          <p className="font-medium text-red-900">{s.name}</p>
                          <p className="text-sm text-red-700">{categoryNames[s.category]} - {s.hersteller}</p>
                        </div>
                        <p className="text-red-900 font-bold">{s.menge}g</p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Wareneingang */}
        {activeTab === 'wareneingang' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formular */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-6">Wareneingang buchen</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategorie
                  </label>
                  <select
                    value={wareneingang.category}
                    onChange={(e) => setWareneingang({ ...wareneingang, category: e.target.value, strain: '' })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="blueten">Blüten</option>
                    <option value="smallbuds">Small Buds</option>
                    <option value="hash">Hash</option>
                    <option value="moonrocks">Moonrocks</option>
                    <option value="andere">Andere</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sorte auswählen
                  </label>
                  <select
                    value={wareneingang.strain}
                    onChange={(e) => setWareneingang({ ...wareneingang, strain: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">-- Bitte wählen --</option>
                    {getAvailableStrains(wareneingang.category).map((s: StockItem) => (
                      <option key={s.id} value={s.id}>
                        {s.name} {s.hersteller ? `- ${s.hersteller}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Menge (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={wareneingang.menge}
                    onChange={(e) => setWareneingang({ ...wareneingang, menge: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="z.B. 1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lieferant (optional)
                  </label>
                  <input
                    type="text"
                    value={wareneingang.lieferant}
                    onChange={(e) => setWareneingang({ ...wareneingang, lieferant: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="z.B. Blue Dream GmbH"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chargen-Nr. (optional)
                  </label>
                  <input
                    type="text"
                    value={wareneingang.chargenNr}
                    onChange={(e) => setWareneingang({ ...wareneingang, chargenNr: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="z.B. CH-2025-001"
                  />
                </div>

                {wareneingang.strain && parseFloat(String(wareneingang.menge)) > 0 && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-900">
                      <strong>Neuer Bestand:</strong> {
                        (stock.find(s => s.id === wareneingang.strain)?.menge || 0) + parseFloat(String(wareneingang.menge))
                      }g
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      Aktuell: {stock.find(s => s.id === wareneingang.strain)?.menge || 0}g
                      → Zugang: +{parseFloat(String(wareneingang.menge))}g
                    </p>
                  </div>
                )}

                <button
                  onClick={bucheWareneingang}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <TrendingUp size={20} />
                  Wareneingang buchen
                </button>
              </div>
            </div>

            {/* Historie */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-6">Wareneingänge Historie</h2>
              {wareneingaenge.length === 0 ? (
                <p className="text-gray-500">Noch keine Wareneingänge erfasst</p>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {wareneingaenge.map(eingang => (
                    <div key={eingang.id} className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-green-900">
                            {eingang.strainName}
                          </p>
                          <p className="text-sm text-green-700">{eingang.datum}</p>
                          <p className="text-xs text-gray-600">{categoryNames[eingang.categoryName]}</p>
                        </div>
                        <p className="text-xl font-bold text-green-900">+{eingang.menge}g</p>
                      </div>
                      {eingang.lieferant && (
                        <p className="text-sm text-gray-600">Lieferant: {eingang.lieferant}</p>
                      )}
                      {eingang.chargenNr && (
                        <p className="text-sm text-gray-600">Charge: {eingang.chargenNr}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Neuer Auftrag */}
        {activeTab === 'newOrder' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formular - Links */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-6">Neuen Auftrag erstellen</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategorie
                  </label>
                  <select
                    value={newOrder.category}
                    onChange={(e) => setNewOrder({ ...newOrder, category: e.target.value, strain: '' })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="blueten">Blüten</option>
                    <option value="smallbuds">Small Buds</option>
                    <option value="hash">Hash</option>
                    <option value="extracts">Extracts</option>
                    <option value="moonrocks">Moonrocks</option>
                    <option value="andere">Andere</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sorte auswählen
                  </label>
                  <select
                    value={newOrder.strain}
                    onChange={(e) => setNewOrder({ ...newOrder, strain: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">-- Bitte wählen --</option>
                    {getAvailableStrains(newOrder.category).map((s: StockItem) => (
                      <option key={s.id} value={s.id} disabled={s.menge <= 0}>
                        {s.name} {s.hersteller ? `- ${s.hersteller}` : ''} (Verfügbar: {s.menge}g){s.menge <= 0 ? ' ⚠️' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verpackungstyp
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="glas"
                        checked={newOrder.packagingType === 'glas'}
                        onChange={(e) => {
                          setNewOrder({ ...newOrder, packagingType: e.target.value });
                          setTempPackage({ ...tempPackage, size: 1, customSize: '' });
                        }}
                        className="mr-2"
                      />
                      Glas
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="bag"
                        checked={newOrder.packagingType === 'bag'}
                        onChange={(e) => {
                          setNewOrder({ ...newOrder, packagingType: e.target.value });
                          setTempPackage({ ...tempPackage, size: 1, customSize: '' });
                        }}
                        className="mr-2"
                      />
                      Bag
                    </label>
                  </div>
                </div>

                {/* Verpackungen hinzufügen */}
                <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                  <h3 className="font-medium text-gray-900 mb-3">Verpackung hinzufügen</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Größe wählen oder Custom eingeben
                      </label>
                      <div className="flex gap-2 flex-wrap mb-3">
                        {(packagingSizes[newOrder.packagingType] as number[]).map((size: number) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setTempPackage({ ...tempPackage, size: size, customSize: '' })}
                            className={`px-4 py-2 rounded-lg border ${
                              tempPackage.size === size && !tempPackage.customSize
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                            }`}
                          >
                            {size}g
                          </button>
                        ))}
                      </div>
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={tempPackage.customSize}
                        onChange={(e) => setTempPackage({ ...tempPackage, customSize: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="Custom Größe in g (z.B. 3.5)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Anzahl Stück
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={tempPackage.quantity}
                        onChange={(e) => setTempPackage({ ...tempPackage, quantity: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="z.B. 10"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={addPackage}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                      <Plus size={18} />
                      Verpackung hinzufügen ({tempPackage.customSize || tempPackage.size}g x {tempPackage.quantity})
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Übersicht - Rechts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-6">Auftragsübersicht</h2>
              
              {/* Ausgewählte Sorte */}
              {newOrder.strain && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">Ausgewählte Sorte:</p>
                  <p className="font-bold text-lg">{stock.find(s => s.id === newOrder.strain)?.name || '-'}</p>
                  <p className="text-sm text-gray-500">
                    Verfügbar: {stock.find(s => s.id === newOrder.strain)?.menge || 0}g
                  </p>
                </div>
              )}

              {/* Liste der hinzugefügten Verpackungen */}
              {newOrder.packages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="mx-auto mb-2 opacity-50" size={48} />
                  <p>Noch keine Verpackungen hinzugefügt</p>
                  <p className="text-sm">Füge links Verpackungen hinzu</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                    <h3 className="font-medium text-gray-900 mb-3">Ausgewählte Verpackungen</h3>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {newOrder.packages.map((pkg: OrderPackage, index: number) => (
                        <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg">
                          <div>
                            <span className="font-medium">{pkg.quantity}x {pkg.size}g {(pkg.packagingType || newOrder.packagingType)}</span>
                            {pkg.isCustom && <span className="ml-2 text-xs text-blue-600">(Custom)</span>}
                            <p className="text-xs text-gray-500">
                              Benötigt: {calculateNeededAmount(pkg.size, pkg.quantity)}g
                            </p>
                          </div>
                          <button
                            onClick={() => removePackage(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-green-300">
                      <p className="text-sm font-medium text-gray-900">
                        Gesamtmenge benötigt: {newOrder.packages.reduce((sum, pkg: OrderPackage) => 
                          sum + calculateNeededAmount(pkg.size, pkg.quantity), 0
                        )}g (inkl. 0,3g Toleranz pro Produkt)
                      </p>
                    </div>
                  </div>

                  {newOrder.strain && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-900">
                        <strong>Gesamt benötigte Menge:</strong> {newOrder.packages.reduce((sum, pkg: OrderPackage) => 
                          sum + calculateNeededAmount(pkg.size, pkg.quantity), 0
                        )}g
                      </p>
                      <p className="text-sm text-blue-900 mt-1">
                        <strong>Verfügbar:</strong> {
                          stock.find(s => s.id === newOrder.strain)?.menge || 0
                        }g
                      </p>
                      <p className={`text-sm mt-1 font-medium ${
                        (stock.find(s => s.id === newOrder.strain)?.menge || 0) >= 
                        newOrder.packages.reduce((sum, pkg: OrderPackage) => sum + calculateNeededAmount(pkg.size, pkg.quantity), 0)
                          ? 'text-green-700'
                          : 'text-red-700'
                      }`}>
                        {(stock.find(s => s.id === newOrder.strain)?.menge || 0) >= 
                        newOrder.packages.reduce((sum, pkg: OrderPackage) => sum + calculateNeededAmount(pkg.size, pkg.quantity), 0)
                          ? '✓ Ausreichend Bestand'
                          : '⚠ Nicht genügend Bestand'}
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={createOrder}
                    disabled={newOrder.packages.length === 0 || !newOrder.strain}
                    className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                      newOrder.packages.length === 0 || !newOrder.strain
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    <CheckCircle size={20} />
                    Auftrag erstellen
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Aufträge */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <h2 className="text-lg sm:text-xl font-bold">Alle Aufträge</h2>
              <div className="flex items-center gap-2">
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value as any)}
                  className="px-2 py-1 border rounded text-xs sm:text-sm"
                >
                  <option value="all">Alle</option>
                  <option value="offen">Offen</option>
                  <option value="in_bearbeitung">In Bearbeitung</option>
                  <option value="fertig">Fertig</option>
                </select>
                <select
                  value={orderDateRange}
                  onChange={(e) => setOrderDateRange(e.target.value as any)}
                  className="px-2 py-1 border rounded text-xs sm:text-sm"
                >
                  <option value="all">Alle</option>
                  <option value="today">Heute</option>
                  <option value="7d">7 Tage</option>
                  <option value="30d">30 Tage</option>
                </select>
                <div className="flex items-center gap-1">
                  <select
                    id="exportZeitraum"
                    className="px-2 py-1 border rounded text-xs sm:text-sm bg-gray-50"
                    defaultValue="all"
                  >
                    <option value="heute">Heute</option>
                    <option value="7d">7 Tage</option>
                    <option value="30d">30 Tage</option>
                    <option value="90d">90 Tage</option>
                    <option value="all">Alle</option>
                  </select>
                  <button
                    onClick={() => {
                      const select = document.getElementById('exportZeitraum') as HTMLSelectElement;
                      exportOrders(select.value as 'heute' | '7d' | '30d' | '90d' | 'all');
                    }}
                    className="px-2 py-1 bg-green-600 text-white rounded text-xs sm:text-sm hover:bg-green-700"
                  >
                    CSV Export
                  </button>
                </div>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <p className="text-gray-500">Keine Aufträge vorhanden</p>
            ) : (
              <div className="grid gap-3">
                {filteredOrders.map((order: Order) => (
                  <div key={order.id} className="border rounded-lg p-3 bg-gray-50">
                    {/* Main content: zwei Spalten */}
                    <div className="flex gap-8 mb-2">
                      {/* Linke Spalte: Produktinfo + Status */}
                      <div className="flex-shrink-0 min-w-[100px]">
                        <div className="font-bold text-base">{order.strainName}</div>
                        <div className="text-xs text-gray-500">{categoryNames[order.categoryName]}</div>
                        <div className="text-xs text-gray-400 mb-1">
                          {order.createdByName && <span>von {order.createdByName}</span>}
                          {order.processedByName && <span> • {order.processedByName}</span>}
                        </div>
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          order.status === 'offen' ? 'bg-orange-100 text-orange-800' :
                          order.status === 'in_bearbeitung' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {order.status === 'offen' ? 'Offen' :
                           order.status === 'in_bearbeitung' ? 'In Bearb.' :
                           'Fertig'}
                        </span>
                      </div>
                      {/* Rechte Spalte: Verpackungen */}
                      <div className="flex flex-wrap gap-6">
                        {(() => {
                          const grouped: Record<string, OrderPackage[]> = order.packages.reduce((acc: Record<string, OrderPackage[]>, p: OrderPackage) => {
                            const key = p.packagingType || 'bag';
                            if (!acc[key]) acc[key] = [];
                            acc[key].push(p);
                            return acc;
                          }, {});
                          return Object.entries(grouped).map(([type, pkgs]) => (
                            <div key={type} className="min-w-[70px]">
                              <div className="text-xs text-gray-500 font-medium uppercase tracking-wide border-b pb-1 mb-1">
                                {type}
                              </div>
                              <div className="space-y-0.5">
                                {pkgs.map((p, i) => (
                                  <div key={i} className="flex items-center text-sm gap-1">
                                    <span className="font-semibold text-gray-900">{p.size}g</span>
                                    <span className="text-gray-600">{p.quantity}x</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                    {/* Footer: Restmenge + Aktionen */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-xs text-gray-500">
                        {order.remainder ? `Rest: ${order.remainder}g` : ''}
                        {editingOrderId === order.id && (
                          <div className="flex gap-1 mt-1">
                            <input
                              type="number"
                              value={remainderInput}
                              onChange={(e) => setRemainderInput(e.target.value)}
                              placeholder="0"
                              className="w-14 px-1 py-1 border rounded text-xs"
                            />
                            <button
                              onClick={() => saveRemainder(order.id, remainderInput)}
                              className="px-2 py-1 bg-green-600 text-white rounded text-xs"
                            >
                              OK
                            </button>
                            <button
                              onClick={() => setEditingOrderId(null)}
                              className="px-2 py-1 bg-gray-400 text-white rounded text-xs"
                            >
                              X
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {order.status === 'in_bearbeitung' && editingOrderId !== order.id && (
                          <button
                            onClick={() => {
                              setEditingOrderId(order.id);
                              setRemainderInput(order.remainder ? String(order.remainder) : '');
                            }}
                            className="px-2 py-1 bg-purple-600 text-white rounded text-xs"
                          >
                            Rest
                          </button>
                        )}
                        {order.status === 'offen' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'in_bearbeitung')}
                            className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                          >
                            Starten
                          </button>
                        )}
                        {order.status === 'in_bearbeitung' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'fertig')}
                            className="px-2 py-1 bg-green-600 text-white rounded text-xs"
                          >
                            Fertig
                          </button>
                        )}
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="px-2 py-1 bg-red-600 text-white rounded text-xs"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Bestand */}
        {activeTab === 'stock' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Aktueller Bestand</h2>
              <div className="flex gap-4 flex-wrap">
                <input
                  type="text"
                  placeholder="Nach Produktname suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 min-w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            {/* Kategorien als Karten */}
            <div className="space-y-6">
              {displayCategoryOrder.map(cat => {
                const items = (groupedStock[cat] || [])
                  .filter((s: StockItem) => 
                    searchQuery === '' || 
                    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    s.id.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .sort((a: StockItem, b: StockItem) => a.name.localeCompare(b.name));
                
                if (items.length === 0) return null;
                
                return (
                  <div key={cat} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-3 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-3">
                        <Package size={20} className="text-gray-600" />
                        {displayCategoryLabels[cat]}
                        <span className="ml-auto bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                          {items.length} Produkte
                        </span>
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Hersteller</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Bestand (g)</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Zuletzt geändert von</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Zuletzt geändert am</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {items.map((s: StockItem) => {
                            const status = getStockStatus(s);
                            return (
                              <tr key={s.id} className={
                                status === 'empty' ? 'bg-red-50' :
                                status === 'low' ? 'bg-yellow-50' :
                                s.menge > 0 ? 'bg-green-50' : ''
                              }>
                                <td className="px-4 py-3 text-sm font-medium">{s.name}</td>
                                <td className="px-4 py-3 text-sm">{s.hersteller || '-'}</td>
                                <td className="px-4 py-3 text-sm font-bold">{s.menge}g</td>
                                <td className="px-4 py-3 text-sm">
                                  <span className="font-medium">{s.lastUpdatedBy || '-'}</span>
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-600">{s.lastUpdatedAt || '-'}</td>
                                <td className="px-4 py-3">
                                  {status === 'empty' ? (
                                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">Leer</span>
                                  ) : status === 'low' ? (
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">Niedrig</span>
                                  ) : (
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">OK</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Analyse */}
        {activeTab === 'analyse' && (() => {
          // Zeitraum-Cutoff berechnen
          const zeitraumTage = analyseZeitraum === 'heute' ? 0 : analyseZeitraum === '7d' ? 7 : analyseZeitraum === '30d' ? 30 : analyseZeitraum === '90d' ? 90 : analyseZeitraum === '365d' ? 365 : Infinity;
          const cutoff = (() => {
            if (zeitraumTage === Infinity) return 0;
            if (analyseZeitraum === 'heute') {
              // Heute: ab Mitternacht
              const heute = new Date();
              heute.setHours(0, 0, 0, 0);
              return heute.getTime();
            }
            return Date.now() - zeitraumTage * 24 * 60 * 60 * 1000;
          })();
          
          // Gefilterte fertige Aufträge
          const fertigeAuftraege = orders.filter((o: Order) => {
            if (o.status !== 'fertig') return false;
            // Zeitraum-Filter
            const ts = o.createdTimestamp ?? Date.parse(o.createdAt);
            if (cutoff > 0 && ts < cutoff) return false;
            // Kategorie-Filter
            if (analyseKategorie !== 'all' && o.categoryName !== analyseKategorie) return false;
            // Mitarbeiter-Filter
            const bearbeiter = o.processedByName || o.createdByName || '';
            if (analyseMitarbeiter !== 'all' && bearbeiter !== analyseMitarbeiter) return false;
            return true;
          });
          
          // Alle Mitarbeiter für Filter-Dropdown
          const alleMitarbeiter = [...new Set(orders.filter(o => o.status === 'fertig').map(o => o.processedByName || o.createdByName || 'Unbekannt'))];
          
          // Alle Kategorien für Filter-Dropdown
          const alleKategorien = [...new Set(orders.filter(o => o.status === 'fertig').map(o => o.categoryName))];
          
          
          // Aggregiere nach Verpackungstyp und Größe
          const verbrauch: {
            jars: { [size: string]: number };
            bags: { [size: string]: number };
            deckel: number;
            sticker: number;
          } = {
            jars: {},
            bags: {},
            deckel: 0,
            sticker: 0
          };

          fertigeAuftraege.forEach((order: Order) => {
            order.packages.forEach((pkg: OrderPackage) => {
              const sizeKey = `${pkg.size}g`;
              const type = pkg.packagingType || 'bag';
              
              if (type === 'jar' || type === 'glas') {
                verbrauch.jars[sizeKey] = (verbrauch.jars[sizeKey] || 0) + pkg.quantity;
                verbrauch.deckel += pkg.quantity; // Jedes Glas braucht einen Deckel
                verbrauch.sticker += pkg.quantity; // Jedes Glas braucht einen Sticker
              } else if (type === 'bag') {
                verbrauch.bags[sizeKey] = (verbrauch.bags[sizeKey] || 0) + pkg.quantity;
              }
            });
          });

          // Zeitraum-Filter
          const zeitraumFilter = (tage: number) => {
            const cutoff = Date.now() - tage * 24 * 60 * 60 * 1000;
            return orders.filter((o: Order) => {
              if (o.status !== 'fertig') return false;
              const ts = o.createdTimestamp ?? Date.parse(o.createdAt);
              return ts >= cutoff;
            });
          };

          const berechneVerbrauch = (auftraege: Order[]) => {
            const v = { jars: {} as { [k: string]: number }, bags: {} as { [k: string]: number }, deckel: 0, sticker: 0 };
            auftraege.forEach((order: Order) => {
              order.packages.forEach((pkg: OrderPackage) => {
                const sizeKey = `${pkg.size}g`;
                const type = pkg.packagingType || 'bag';
                if (type === 'jar' || type === 'glas') {
                  v.jars[sizeKey] = (v.jars[sizeKey] || 0) + pkg.quantity;
                  v.deckel += pkg.quantity;
                  v.sticker += pkg.quantity;
                } else if (type === 'bag') {
                  v.bags[sizeKey] = (v.bags[sizeKey] || 0) + pkg.quantity;
                }
              });
            });
            return v;
          };

          const verbrauchGesamt = berechneVerbrauch(fertigeAuftraege);

          const renderVerbrauchTabelle = (v: typeof verbrauch, titel: string) => (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-4">{titel}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gläser */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Package size={16} /> Gläser
                  </h4>
                  {Object.keys(v.jars).length === 0 ? (
                    <p className="text-gray-400 text-sm">Keine Daten</p>
                  ) : (
                    <ul className="space-y-1">
                      {Object.entries(v.jars).sort((a, b) => parseFloat(a[0]) - parseFloat(b[0])).map(([size, count]) => (
                        <li key={size} className="flex justify-between text-sm">
                          <span>{size}</span>
                          <span className="font-bold">{count} Stück</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {/* Bags */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Package size={16} /> Bags
                  </h4>
                  {Object.keys(v.bags).length === 0 ? (
                    <p className="text-gray-400 text-sm">Keine Daten</p>
                  ) : (
                    <ul className="space-y-1">
                      {Object.entries(v.bags).sort((a, b) => parseFloat(a[0]) - parseFloat(b[0])).map(([size, count]) => (
                        <li key={size} className="flex justify-between text-sm">
                          <span>{size}</span>
                          <span className="font-bold">{count} Stück</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              {/* Deckel & Sticker */}
              <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Deckel (für Gläser)</span>
                  <span className="text-xl font-bold text-green-600">{v.deckel} Stück</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Sticker (für Gläser)</span>
                  <span className="text-xl font-bold text-blue-600">{v.sticker} Stück</span>
                </div>
              </div>
            </div>
          );

          return (
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BarChart3 size={24} /> Analyse Dashboard
              </h2>
              
              {/* Filterleiste */}
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex flex-wrap gap-4 items-end">
                  {/* Zeitraum */}
                  <div className="flex-1 min-w-40">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zeitraum</label>
                    <select
                      value={analyseZeitraum}
                      onChange={(e) => setAnalyseZeitraum(e.target.value as typeof analyseZeitraum)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="heute">Heute</option>
                      <option value="7d">Letzte 7 Tage</option>
                      <option value="30d">Letzte 30 Tage</option>
                      <option value="90d">Letzte 90 Tage</option>
                      <option value="365d">Letztes Jahr</option>
                      <option value="all">Alle Daten</option>
                    </select>
                  </div>
                  
                  {/* Kategorie */}
                  <div className="flex-1 min-w-40">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategorie</label>
                    <select
                      value={analyseKategorie}
                      onChange={(e) => setAnalyseKategorie(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Alle Kategorien</option>
                      {alleKategorien.map(kat => (
                        <option key={kat} value={kat}>{categoryNames[kat] || kat}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Mitarbeiter */}
                  <div className="flex-1 min-w-40">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mitarbeiter</label>
                    <select
                      value={analyseMitarbeiter}
                      onChange={(e) => setAnalyseMitarbeiter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Alle Mitarbeiter</option>
                      {alleMitarbeiter.map(ma => (
                        <option key={ma} value={ma}>{ma}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Filter zurücksetzen */}
                  <button
                    onClick={() => {
                      setAnalyseZeitraum('30d');
                      setAnalyseKategorie('all');
                      setAnalyseMitarbeiter('all');
                    }}
                    className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    Filter zurücksetzen
                  </button>
                </div>
                
                {/* Aktive Filter anzeigen */}
                <div className="mt-3 flex gap-2 text-sm">
                  <span className="text-gray-500">Aktive Filter:</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                    {analyseZeitraum === 'heute' ? 'Heute' : analyseZeitraum === '7d' ? '7 Tage' : analyseZeitraum === '30d' ? '30 Tage' : analyseZeitraum === '90d' ? '90 Tage' : analyseZeitraum === '365d' ? '1 Jahr' : 'Alle'}
                  </span>
                  {analyseKategorie !== 'all' && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded">
                      {categoryNames[analyseKategorie] || analyseKategorie}
                    </span>
                  )}
                  {analyseMitarbeiter !== 'all' && (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded">
                      {analyseMitarbeiter}
                    </span>
                  )}
                  <span className="ml-auto text-gray-600">{fertigeAuftraege.length} Aufträge gefunden</span>
                </div>
              </div>
              
              {/* Übersicht-Karten */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-500 text-sm">Fertige Aufträge (gesamt)</p>
                  <p className="text-3xl font-bold text-green-600">{fertigeAuftraege.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-500 text-sm">Gläser verbraucht</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {Object.values(verbrauchGesamt.jars).reduce((sum, n) => sum + n, 0)}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-500 text-sm">Deckel verbraucht</p>
                  <p className="text-3xl font-bold text-green-600">{verbrauchGesamt.deckel}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-500 text-sm">Bags verbraucht</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {Object.values(verbrauchGesamt.bags).reduce((sum, n) => sum + n, 0)}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-500 text-sm">Sticker verbraucht</p>
                  <p className="text-3xl font-bold text-orange-600">{verbrauchGesamt.sticker}</p>
                </div>
              </div>

              {/* Verpackungsmaterial-Verbrauch (gefiltert) */}
              {renderVerbrauchTabelle(verbrauchGesamt, 'Verpackungsmaterial-Verbrauch')}

              {/* Mitarbeiter-Produktivität */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold mb-4">Mitarbeiter-Produktivität (Bearbeiter)</h3>
                {(() => {
                  const mitarbeiterStats: { [name: string]: { auftraege: number; gramm: number } } = {};
                  fertigeAuftraege.forEach((order: Order) => {
                    const name = order.processedByName || order.createdByName || 'Unbekannt';
                    if (!mitarbeiterStats[name]) {
                      mitarbeiterStats[name] = { auftraege: 0, gramm: 0 };
                    }
                    mitarbeiterStats[name].auftraege += 1;
                    mitarbeiterStats[name].gramm += order.neededAmount;
                  });
                  
                  const sorted = Object.entries(mitarbeiterStats)
                    .sort((a, b) => b[1].gramm - a[1].gramm);
                  
                  if (sorted.length === 0) {
                    return <p className="text-gray-400">Keine Daten</p>;
                  }
                  
                  return (
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Mitarbeiter</th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Aufträge</th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Gramm verarbeitet</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {sorted.map(([name, stats]) => (
                          <tr key={name}>
                            <td className="px-4 py-3 text-sm font-medium">{name}</td>
                            <td className="px-4 py-3 text-sm text-right">{stats.auftraege}</td>
                            <td className="px-4 py-3 text-sm text-right font-bold">{stats.gramm.toFixed(0)}g</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );
                })()}
              </div>

              {/* Top-Sorten */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold mb-4">Top 10 Sorten (nach Gramm)</h3>
                {(() => {
                  const sortenStats: { [name: string]: { auftraege: number; gramm: number; kategorie: string } } = {};
                  fertigeAuftraege.forEach((order: Order) => {
                    const name = order.strainName;
                    if (!sortenStats[name]) {
                      sortenStats[name] = { auftraege: 0, gramm: 0, kategorie: order.categoryName };
                    }
                    sortenStats[name].auftraege += 1;
                    sortenStats[name].gramm += order.neededAmount;
                  });
                  
                  const sorted = Object.entries(sortenStats)
                    .sort((a, b) => b[1].gramm - a[1].gramm)
                    .slice(0, 10);
                  
                  if (sorted.length === 0) {
                    return <p className="text-gray-400">Keine Daten</p>;
                  }
                  
                  return (
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">#</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Sorte</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Kategorie</th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Aufträge</th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Gramm</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {sorted.map(([name, stats], idx) => (
                          <tr key={name}>
                            <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                            <td className="px-4 py-3 text-sm font-medium">{name}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className="px-2 py-1 bg-gray-100 rounded text-xs">{categoryNames[stats.kategorie] || stats.kategorie}</span>
                            </td>
                            <td className="px-4 py-3 text-sm text-right">{stats.auftraege}</td>
                            <td className="px-4 py-3 text-sm text-right font-bold">{stats.gramm.toFixed(0)}g</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );
                })()}
              </div>

              {/* Nachbestell-Prognose */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold mb-4">🔔 Nachbestell-Prognose (basierend auf 30-Tage-Verbrauch)</h3>
                {(() => {
                  // Berechne Verbrauch pro Sorte in den letzten 30 Tagen
                  const verbrauchProSorte: { [strainId: string]: { name: string; kategorie: string; gramm: number } } = {};
                  const auftraege30d = zeitraumFilter(30);
                  auftraege30d.forEach((order: Order) => {
                    if (!verbrauchProSorte[order.strain]) {
                      verbrauchProSorte[order.strain] = { name: order.strainName, kategorie: order.categoryName, gramm: 0 };
                    }
                    verbrauchProSorte[order.strain].gramm += order.neededAmount;
                  });
                  
                  // Berechne Tage bis leer für jeden Stock-Artikel
                  const prognosen = stock
                    .filter((s: StockItem) => s.category !== 'andere')
                    .map((s: StockItem) => {
                      const verbrauch = verbrauchProSorte[s.id];
                      const verbrauchPro30Tage = verbrauch ? verbrauch.gramm : 0;
                      const tagesverbrauch = verbrauchPro30Tage / 30;
                      const tageVerbleibend = tagesverbrauch > 0 ? Math.floor(s.menge / tagesverbrauch) : Infinity;
                      
                      return {
                        id: s.id,
                        name: s.name,
                        kategorie: s.category,
                        bestand: s.menge,
                        verbrauch30d: verbrauchPro30Tage,
                        tagesverbrauch,
                        tageVerbleibend
                      };
                    })
                    .filter(p => p.verbrauch30d > 0) // Nur Artikel mit Verbrauch
                    .sort((a, b) => a.tageVerbleibend - b.tageVerbleibend)
                    .slice(0, 15);
                  
                  if (prognosen.length === 0) {
                    return <p className="text-gray-400">Nicht genug Daten für Prognose (benötigt Aufträge der letzten 30 Tage)</p>;
                  }
                  
                  return (
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Produkt</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Kategorie</th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Aktuell</th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Ø/Tag</th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Reicht noch</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {prognosen.map((p) => (
                          <tr key={p.id} className={
                            p.tageVerbleibend <= 7 ? 'bg-red-50' :
                            p.tageVerbleibend <= 14 ? 'bg-yellow-50' : ''
                          }>
                            <td className="px-4 py-3 text-sm font-medium">{p.name}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className="px-2 py-1 bg-gray-100 rounded text-xs">{categoryNames[p.kategorie] || p.kategorie}</span>
                            </td>
                            <td className="px-4 py-3 text-sm text-right">{p.bestand.toFixed(0)}g</td>
                            <td className="px-4 py-3 text-sm text-right">{p.tagesverbrauch.toFixed(1)}g</td>
                            <td className="px-4 py-3 text-right">
                              {p.tageVerbleibend <= 7 ? (
                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm font-bold">
                                  {p.tageVerbleibend} Tage ⚠️
                                </span>
                              ) : p.tageVerbleibend <= 14 ? (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm font-bold">
                                  {p.tageVerbleibend} Tage
                                </span>
                              ) : (
                                <span className="text-sm font-medium text-green-700">{p.tageVerbleibend} Tage</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );
                })()}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default AbpackVerwaltung;
