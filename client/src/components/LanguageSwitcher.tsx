import React from 'react';
import { Globe2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SupportedLanguage } from '../i18n/translations';

const languages: SupportedLanguage[] = ['de', 'en', 'it'];

export const LanguageSwitcher = () => {
	const { language, setLanguage } = useLanguage();

	const handleClick = () => {
		const currentIndex = languages.indexOf(language);
		const next = languages[(currentIndex + 1) % languages.length];
		setLanguage(next);
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			aria-label="Sprache wechseln"
			className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent transition"
		>
			<Globe2 size={18} />
		</button>
	);
};
