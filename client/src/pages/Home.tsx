import React, { useState } from 'react';
import { AlertCircle, Package, CheckCircle, Clock, Plus, Trash2, TrendingUp, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
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
  const { t } = useLanguage();
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

  // Statistiken
  const stats = {
    offeneAuftraege: orders.filter((o: Order) => o.status === 'offen').length,
    inBearbeitung: orders.filter((o: Order) => o.status === 'in_bearbeitung').length,
    fertig: orders.filter((o: Order) => o.status === 'fertig').length,
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

  const filteredOrders = orders
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

  const exportOrders = (format: 'csv' | 'xlsx') => {
    const delimiter = format === 'csv' ? ';' : '\t';
    const headers = [
      'ID',
      'Kategorie',
      'Sorte',
      'Verpackungen',
      'Status',
      'Auftraggeber',
      'Bearbeiter',
      'Restmenge',
      'Erstellt am'
    ];

    const rows = filteredOrders.map((o) => {
      const pkgSummary = o.packages
        .map((p) => `${p.quantity}x ${p.size}g ${p.packagingType || ''}`.trim())
        .join(' | ');
      return [
        o.id,
        categoryNames[o.categoryName] || o.categoryName,
        o.strainName,
        pkgSummary,
        o.status,
        o.createdBy || '',
        o.assignedTo || '',
        o.remainder ?? '',
        o.createdAt
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

    const blob = new Blob([content], {
      type:
        format === 'csv'
          ? 'text/csv;charset=utf-8;'
          : 'application/vnd.ms-excel'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `auftraege_export.${format === 'csv' ? 'csv' : 'xls'}`;
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
          <div className="text-right space-y-2">
            <div className="flex items-center gap-4 justify-end">
              <LanguageSwitcher />
              <button
                onClick={handleLogout}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent transition"
                aria-label={t('header.logout')}
              >
                <LogOut size={18} />
              </button>
            </div>
            <p className="text-sm text-gray-600">{t('header.user')}: <span className="font-medium text-gray-900">{user?.username}</span></p>
          </div>
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
            {t('tabs.dashboard')}
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
              {orders.filter((o: Order) => o.status !== 'fertig').length === 0 ? (
                <p className="text-gray-500">Keine aktiven Aufträge</p>
              ) : (
                <div className="space-y-3">
                  {orders.filter((o: Order) => o.status !== 'fertig').map((order: Order) => (
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
                  {getAvailableStrains(newOrder.category).filter((s: StockItem) => s.menge > 0).map((s: StockItem) => (
                    <option key={s.id} value={s.id}>
                      {s.name} {s.hersteller ? `- ${s.hersteller}` : ''} (Verfügbar: {s.menge}g)
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

              {/* Liste der hinzugefügten Verpackungen */}
              {newOrder.packages.length > 0 && (
                <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                  <h3 className="font-medium text-gray-900 mb-3">Ausgewählte Verpackungen</h3>
                  <div className="space-y-2">
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
                    <div className="mt-3 pt-3 border-t border-green-300">
                      <p className="text-sm font-medium text-gray-900">
                        Gesamtmenge benötigt: {newOrder.packages.reduce((sum, pkg: OrderPackage) => 
                          sum + calculateNeededAmount(pkg.size, pkg.quantity), 0
                        )}g (inkl. 0,3g Toleranz pro Produkt)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {newOrder.strain && newOrder.packages.length > 0 && (
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
                Auftrag erstellen {newOrder.packages.length === 0 ? '(Bitte Verpackungen hinzufügen)' : ''}
              </button>
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
                <button
                  onClick={() => exportOrders('csv')}
                  className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs sm:text-sm hover:bg-gray-200 border"
                >
                  CSV
                </button>
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
          <div className="bg-white rounded-lg shadow p-6">
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
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">Alle Kategorien</option>
                  <option value="blueten">Blüten</option>
                  <option value="smallbuds">Small Buds</option>
                  <option value="hash">Hash</option>
                  <option value="extracts">Extracts</option>
                  <option value="moonrocks">Moonrocks</option>
                  <option value="trim">Trim</option>
                  <option value="andere">Andere</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Kategorie</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Hersteller</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Bestand (g)</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Zuletzt geändert von</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Zuletzt geändert am</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {stock
                    .filter((s: StockItem) => (filterCategory === 'all' || s.category === filterCategory) && (s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase())))
                    .map((s: StockItem) => {
                      const status = getStockStatus(s);
                      return (
                        <tr key={s.id} className={
                          status === 'empty' ? 'bg-red-50' :
                          status === 'low' ? 'bg-yellow-50' :
                          s.menge > 0 ? 'bg-green-50' : ''
                        }>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                              {categoryNames[s.category]}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-medium">{s.name}</td>
                          <td className="px-4 py-3 text-sm">{s.hersteller || '-'}</td>
                          <td className="px-4 py-3 text-sm font-bold">
                            {s.menge}g
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="font-medium">{s.lastUpdatedBy || '-'}</span>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-600">
                            {s.lastUpdatedAt || '-'}
                          </td>
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
        )}
      </div>
    </div>
  );
};

export default AbpackVerwaltung;
