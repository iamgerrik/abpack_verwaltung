import React, { createContext, useContext, useMemo, useState } from 'react';
import { translations, SupportedLanguage, TranslationKey } from '../i18n/translations';

type LanguageContextValue = {
	language: SupportedLanguage;
	setLanguage: (lang: SupportedLanguage) => void;
	t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const defaultLanguage: SupportedLanguage = 'de';

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
	const [language, setLanguage] = useState<SupportedLanguage>(defaultLanguage);

	const t = useMemo(() => {
		return (key: TranslationKey) => {
			const parts = key.split('.') as string[];
			let value: any = translations[language];
			for (const part of parts) {
				value = value?.[part];
			}
			return (typeof value === 'string' && value) || key;
		};
	}, [language]);

	const value: LanguageContextValue = {
		language,
		setLanguage,
		t
	};

	return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
	const ctx = useContext(LanguageContext);
	if (!ctx) {
		// Fallback, falls Provider fehlt (verhindert Crash, nutzt Default-Sprache)
		return {
			language: defaultLanguage,
			setLanguage: () => undefined,
			t: (key: TranslationKey) => key
		};
	}
	return ctx;
};
