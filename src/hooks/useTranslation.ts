import { useAppContext } from '~/contexts/app';
import { translations } from '~/i18n/translations';

export function useTranslation() {
  const app = useAppContext();
  
  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations[app.locale];
    
    for (const k of keys) {
      if (value === undefined) return key;
      value = value[k];
    }
    
    return value || key;
  };

  return { t };
} 