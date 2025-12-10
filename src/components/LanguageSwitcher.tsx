import { useLanguage } from '../providers/language-provider';
import { Languages } from 'lucide-react';
import { Button } from './ui/button';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <div title={language === 'en' ? 'Cambiar a Español' : 'Switch to English'}>
      <Button
        onClick={toggleLanguage}
        size="sm"
        className="flex items-center gap-2"
      >
        <Languages className="h-4 w-4" />
        <span className="uppercase text-xs font-semibold">{language === 'en' ? 'EN' : 'ES'}</span>
      </Button>
    </div>
  );
}

