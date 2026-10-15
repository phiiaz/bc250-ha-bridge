import { translations, type TranslationKey } from "./translations";

export type Translator = (key: TranslationKey) => string;

export function makeTranslator(language: string | undefined): Translator {
  const lang = (language ?? "en").slice(0, 2).toLowerCase();
  const table = (translations as Record<string, Record<string, string>>)[lang] ?? translations.en;
  return (key) => table[key] ?? translations.en[key] ?? key;
}
