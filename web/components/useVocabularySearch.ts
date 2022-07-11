import { useEffect, useState } from 'react';
import type { VocabularyEntry } from 'spelling-ukraine-data';
import { normalizeString } from '../utils/str';
import useDebouncedValue from './useDebouncedValue';

export type SearchResult = {
  entry: VocabularyEntry;
  match: string;
  relevance: number;
};

// TODO: Use a trie or something
const resolveResults = (vocabulary: VocabularyEntry[], query: string) => {
  if (!query) {
    return [];
  }

  const results: SearchResult[] = [];
  const normalizedQuery = normalizeString(query);

  for (const entry of vocabulary) {
    const spellings = [
      entry.sourceSpelling,
      entry.correctSpelling,
      ...entry.incorrectSpellings,
      ...entry.relatedSpellings
    ];

    for (const spelling of spellings) {
      const normalizedSpelling = normalizeString(spelling);
      if (!normalizedSpelling.includes(normalizedQuery)) {
        continue;
      }

      // Relevance is determined by how many characters are matched
      // and how close to the beginning the match happened.
      const relevance =
        normalizedQuery.length / normalizedSpelling.length -
        normalizedSpelling.indexOf(normalizedQuery) / normalizedSpelling.length;

      results.push({
        entry,
        match: spelling,
        relevance
      });

      // We only need to find one match per entry
      break;
    }
  }

  return results.sort((a, b) => b.relevance - a.relevance).slice(0, 10);
};

const useVocabularySearch = (vocabulary: VocabularyEntry[], query: string) => {
  const queryDebounced = useDebouncedValue(query, 500);
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(
    () => setResults(resolveResults(vocabulary, queryDebounced)),
    [vocabulary, queryDebounced]
  );

  return {
    isProcessing: query !== queryDebounced,
    results
  };
};

export default useVocabularySearch;
