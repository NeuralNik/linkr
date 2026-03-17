# Internationalization (i18n) Implementation Guide

## Overview
This application uses **react-i18next** for multi-language support with English and Spanish translations.

## Setup

### Dependencies Installed
```bash
npm install i18next react-i18next i18next-browser-languagedetector i18next-http-backend
```

### Files Structure
```
src/i18n/
├── config.ts           # i18n configuration
├── formatters.ts       # Date/number formatting utilities
└── locales/
    ├── en.json        # English translations
    └── es.json        # Spanish translations

src/components/
└── LanguageSwitcher.tsx  # Language selection component
```

## Key Features

### 1. Language Detection
- Automatically detects browser language preference
- Falls back to English if unsupported
- User selection is saved to localStorage

### 2. Language Switcher
Location: Header component
- Globe icon with dropdown selector
- Works on both desktop and mobile
- Accessible language selection

### 3. Locale-Aware Formatting

#### Date Formatting
```typescript
import { formatDate, formatDateTime, formatTime } from '@/i18n/formatters';

formatDate(new Date());        // "March 18, 2026" or "18 de marzo de 2026"
formatDateTime(new Date());    // Full date-time string
formatTime(new Date());        // "14:30:45" or locale equivalent
```

#### Number Formatting
```typescript
import { formatNumber, formatCurrency, formatFileSize, formatPercent } from '@/i18n/formatters';

formatNumber(1234.56);         // "1,234.56" or "1.234,56"
formatCurrency(99.99);         // "$99.99" or "99,99€"
formatFileSize(2097152);       // "2 MB"
formatPercent(0.75);           // "75%" with locale formatting
```

## Using Translations in Components

### Basic Usage
```typescript
import { useTranslation } from 'react-i18next';

export function MyComponent() {
  const { t } = useTranslation();
  
  return <h1>{t('home.title')}</h1>;
}
```

### With Parameters
```typescript
// Translation file:
// "greeting": "Hello {{name}}"

const greeting = t('greeting', { name: 'John' });
// Result: "Hello John" or "Hola John"
```

### Language Switching
```typescript
import { useTranslation } from 'react-i18next';

const { i18n } = useTranslation();
i18n.changeLanguage('es'); // Switch to Spanish
```

## Translation Structure

### Available Translation Keys

#### Navigation
- `nav.home` - Home
- `nav.templates` - Templates
- `nav.batch` - Batch Generate
- `nav.history` - History
- `nav.draw` - Draw
- `nav.developer` - Developer

#### Home Page
- `home.title` - Page title
- `home.subtitle` - Subtitle
- `home.urlLabel` - URL input label
- `home.generateBtn` - Generate button
- `home.colorTheme` - Color theme label
- `home.downloadQR` - Download button
- `home.copyQR` - Copy to clipboard
- `home.logoUpload` - Logo upload section
- `home.error` - Error message
- `home.invalidURL` - Invalid URL message

#### Common
- `common.loading` - Loading text
- `common.error` - Error text
- `common.success` - Success text
- `common.cancel` - Cancel button
- `common.confirm` - Confirm button

#### Language
- `language.select` - Select language text
- `language.english` - English
- `language.spanish` - Español

## Adding New Languages

1. Create a new translation file in `src/i18n/locales/`:
```json
// src/i18n/locales/fr.json
{
  "app": {
    "title": "linkr - Générateur de Code QR"
  },
  // ... rest of translations
}
```

2. Update `src/i18n/config.ts`:
```typescript
import fr from './locales/fr.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },  // Add new language
};
```

3. Update `src/components/LanguageSwitcher.tsx`:
```typescript
<SelectItem value="fr">Français</SelectItem>
```

4. Update `src/i18n/formatters.ts` for locale support:
```typescript
const locale = language === 'es' 
  ? 'es-ES' 
  : language === 'fr'
  ? 'fr-FR'
  : 'en-US';
```

## RTL Language Support (Future)

For adding RTL languages like Arabic:

```typescript
// In your component
import { useTranslation } from 'react-i18next';

export function App() {
  const { i18n } = useTranslation();
  const isRTL = ['ar', 'he'].includes(i18n.language);
  
  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Your content */}
    </div>
  );
}
```

Update Tailwind config for RTL:
```typescript
// tailwind.config.ts
export default {
  plugins: [
    require('tailwindcss-rtl'),
  ],
}
```

## Accessibility Considerations

1. **Language Selector**
   - Uses `<select>` for keyboard navigation
   - Clear labeling with globe icon
   - Accessible color contrast

2. **ARIA Labels**
   - Consider adding `aria-label` to language switcher
   - Always use semantic HTML

3. **Date/Number Formatting**
   - Uses browser Intl API for accessibility
   - Screen readers will announce numbers correctly

## Performance Tips

1. **Code Splitting**: Load translation files dynamically
```typescript
import i18next from 'i18next';
import HttpApi from 'i18next-http-backend';

i18next.use(HttpApi).init({
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json'
  }
});
```

2. **Caching**: Translations are cached in memory after first load

3. **Storage**: User language preference stored in localStorage

## Testing

When testing components with i18n:

```typescript
import { render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';

render(
  <I18nextProvider i18n={i18n}>
    <MyComponent />
  </I18nextProvider>
);
```

## Troubleshooting

### Translations not showing
- Check `src/i18n/config.ts` is imported in `main.tsx`
- Verify JSON syntax in translation files
- Check browser console for i18next warnings

### Language not switching
- Clear localStorage and try again
- Check browser language detection settings
- Verify language code matches (e.g., 'es', 'es-ES')

### Formatting issues
- Ensure locale string matches browser support
- Use `i18n.language` instead of hardcoding language codes
- Test with different date/number inputs

## References
- [react-i18next Documentation](https://react.i18next.com/)
- [i18next Documentation](https://www.i18next.com/)
- [MDN Intl API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
