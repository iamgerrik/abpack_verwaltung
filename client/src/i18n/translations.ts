export const translations = {
	de: {
		header: {
			logout: 'Abmelden',
			user: 'Benutzer'
		},
		tabs: {
			dashboard: 'Dashboard',
			warehouse: 'Wareneingang',
			orders: 'Aufträge',
			stock: 'Bestand'
		},
		orders: {
			newOrder: 'Neuer Auftrag'
		}
	},
	en: {
		header: {
			logout: 'Logout',
			user: 'User'
		},
		tabs: {
			dashboard: 'Dashboard',
			warehouse: 'Inbound',
			orders: 'Orders',
			stock: 'Stock'
		},
		orders: {
			newOrder: 'New Order'
		}
	},
	it: {
		header: {
			logout: 'Disconnetti',
			user: 'Utente'
		},
		tabs: {
			dashboard: 'Dashboard',
			warehouse: 'Magazzino',
			orders: 'Ordini',
			stock: 'Scorte'
		},
		orders: {
			newOrder: 'Nuovo ordine'
		}
	}
};

export type SupportedLanguage = keyof typeof translations;
export type TranslationKey =
	| 'header.logout'
	| 'header.user'
	| 'tabs.dashboard'
	| 'tabs.warehouse'
	| 'tabs.orders'
	| 'tabs.stock'
	| 'orders.newOrder';
