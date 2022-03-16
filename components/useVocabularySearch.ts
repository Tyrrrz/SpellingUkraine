import React from 'react';
import type { VocabularyEntry } from '../data/vocabulary';
import { useDebouncedValue } from './useDebouncedValue';

interface SearchMatch {
  on: keyof VocabularyEntry;
  source: string;
  value: string;
  quality: number;
}

interface SearchResult {
  entry: VocabularyEntry;
  match: SearchMatch;
}

const resolveMatch = (entry: VocabularyEntry, query: string): SearchMatch | null => {
  const normalizeString = (str: string) => {
    // Lowercase and remove diacritics & accents
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  const getQuality = (source: string, value: string) => {
    // Quality is determined by how many characters are matched
    // and how close to the beginning of the key the match happened.
    return value.length / source.length - source.indexOf(value) / source.length;
  };

  const queryNormalized = normalizeString(query);

  const termNormalized = normalizeString(entry.term);
  if (termNormalized.includes(queryNormalized)) {
    return {
      on: 'term',
      source: entry.id,
      value: query,
      quality: getQuality(termNormalized, queryNormalized)
    };
  }

  const translationNormalized = normalizeString(entry.translation);
  if (translationNormalized.includes(queryNormalized)) {
    return {
      on: 'translation',
      source: entry.translation,
      value: query,
      quality: getQuality(translationNormalized, queryNormalized)
    };
  }

  for (const mistake of entry.mistakes) {
    const mistakeNormalized = normalizeString(mistake);
    if (mistakeNormalized.includes(queryNormalized)) {
      return {
        on: 'mistakes',
        source: mistake,
        value: query,
        quality: getQuality(mistakeNormalized, queryNormalized)
      };
    }
  }

  for (const alias of entry.aliases) {
    const aliasNormalized = normalizeString(alias);
    if (aliasNormalized.includes(queryNormalized)) {
      return {
        on: 'aliases',
        source: alias,
        value: query,
        quality: getQuality(aliasNormalized, queryNormalized)
      };
    }
  }

  return null;
};

const resolveResults = (vocabulary: VocabularyEntry[], query: string) => {
  // TODO: Use a trie or something
  if (!query) {
    return [];
  }

  const results: SearchResult[] = [];
  for (const entry of vocabulary) {
    const match = resolveMatch(entry, query);
    if (match) {
      results.push({ entry, match });
    }
  }

  return results.sort((a, b) => b.match.quality - a.match.quality).slice(0, 10);
};

export const useVocabularySearch = (vocabulary: VocabularyEntry[], query: string) => {
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const debouncedQuery = useDebouncedValue(query, 500);

  React.useEffect(
    () => setResults(resolveResults(vocabulary, debouncedQuery)),
    [vocabulary, debouncedQuery]
  );

  return {
    processing: query !== debouncedQuery,
    results
  };
};
