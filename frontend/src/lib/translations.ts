// src/lib/translations.ts
import { useLanguage } from "@/context/language-context";

type TranslationKey = string;

const translations: Record<string, Record<TranslationKey, string>> = {
  en: {
    nav_home: "Home",
    nav_outlook: "Outlook",
    nav_crops: "Crops",
    nav_profile: "Profile",
    risk_label: "Break Risk",
    level_low: "Low",
    level_moderate: "Moderate",
    level_high: "High",
    level_unknown: "Unknown",
    risk_copy_low: "Monsoon conditions are stable. Low risk of dry spell.",
    risk_copy_moderate: "Moderate risk of rainfall deficit. Keep irrigation options ready.",
    risk_copy_high: "Prolonged dry spell likely. Delay sowing sensitive crops.",
    risk_copy_unknown: "Insufficient recent rainfall data to compute break risk.",
    "home.title": "Rainfall & Monsoon Advisory",
    "home.subtitle": "Track rainfall risk across Karnataka",
    "risk.high": "High Risk",
    "risk.moderate": "Moderate Risk",
    "risk.low": "Low Risk",
    "risk.unknown": "Unknown",
    "nav.home": "Home",
    "nav.advisory": "Advisory",
  },
  kn: {
    nav_home: "ಮುಖಪುಟ",
    nav_outlook: "ಮುನ್ನೋಟ",
    nav_crops: "ಬೆಳೆಗಳು",
    nav_profile: "ಪ್ರೊಫೈಲ್",
    risk_label: "ಬರ ಅಪಾಯ",
    level_low: "ಕಡಿಮೆ",
    level_moderate: "ಮಧ್ಯಮ",
    level_high: "ಹೆಚ್ಚು",
    level_unknown: "ಅಜ್ಞಾತ",
    risk_copy_low: "ಮುಂಗಾರು ಪರಿಸ್ಥಿತಿ ಸ್ಥಿರವಾಗಿದೆ. ಒಣ ಹವೆಯ ಅಪಾಯ ಕಡಿಮೆ.",
    risk_copy_moderate: "ಮಳೆ ಕೊರತೆಯ ಮಧ್ಯಮ ಅಪಾಯವಿದೆ. ನೀರಾವರಿ ಆಯ್ಕೆಗಳನ್ನು ಸಿದ್ಧವಾಗಿಡಿ.",
    risk_copy_high: "ದೀರ್ಘಕಾಲದ ಒಣ ಹವೆ ಸಂಭವವಿದೆ. ಸೂಕ್ಷ್ಮ ಬೆಳೆಗಳ ಬಿತ್ತನೆ ಮುಂದೂಡಿ.",
    risk_copy_unknown: "ಬರ ಅಪಾಯವನ್ನು ಲೆಕ್ಕಹಾಕಲು ಇತ್ತೀಚಿನ ಸಾಕಷ್ಟು ಮಳೆ ಮಾಹಿತಿ ಇಲ್ಲ.",
    "home.title": "ಮಳೆ ಮತ್ತು ಮುಂಗಾರು ಸಲಹೆ",
    "home.subtitle": "ಕರ್ನಾಟಕದಾದ್ಯಂತ ಮಳೆ ಅಪಾಯವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    "risk.high": "ಹೆಚ್ಚಿನ ಅಪಾಯ",
    "risk.moderate": "ಮಧ್ಯಮ ಅಪಾಯ",
    "risk.low": "ಕಡಿಮೆ ಅಪಾಯ",
    "risk.unknown": "ಅಜ್ಞಾತ",
    "nav.home": "ಮುಖಪುಟ",
    "nav.advisory": "ಸಲಹೆ",
  },
};

export type TranslationFn = ((key: TranslationKey) => string) & {
  t: (key: TranslationKey) => string;
};

export function useTranslation(langOverride?: string): TranslationFn {
  const { language: contextLang } = useLanguage();
  const activeLang = langOverride || contextLang || "en";

  const t = (key: TranslationKey): string => {
    return translations[activeLang]?.[key] ?? translations.en[key] ?? key;
  };

  return Object.assign(t, { t });
}