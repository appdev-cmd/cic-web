import { INITIAL_DICTIONARY_ENTRIES, type DictionaryEntry } from '../modules/localization/uiDictionaryData';

export function getDemoLocalizationData(): DictionaryEntry[] {
  return INITIAL_DICTIONARY_ENTRIES.map((entry) => ({
    ...entry,
    values: { ...entry.values },
    requiredVariables: [...entry.requiredVariables],
    history: entry.history.map((historyEntry) => ({ ...historyEntry })),
  }));
}
