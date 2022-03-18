import React from 'react';
import type { VocabularyEntry } from 'spelling-ukraine-data';
import { SearchResult, searchVocabulary } from 'spelling-ukraine-data/search';
import { useDebouncedValue } from './useDebouncedValue';

export const useVocabularySearch = (vocabulary: VocabularyEntry[], query: string) => {
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const debouncedQuery = useDebouncedValue(query, 500);

  React.useEffect(
    () => setResults(searchVocabulary(vocabulary, debouncedQuery)),
    [vocabulary, debouncedQuery]
  );

  return {
    processing: query !== debouncedQuery,
    results
  };
};
