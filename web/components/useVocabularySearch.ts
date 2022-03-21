import React from 'react';
import type { VocabularyEntry } from 'spelling-ukraine-data';
import { normalizeString } from '../utils/str';
import useDebouncedValue from './useDebouncedValue';

export interface SearchResult {
  entry: VocabularyEntry;
  match: string;
  relevance: number;
}

// TODO: Use a trie or something
const resolveResult = (entry: VocabularyEntry, query: string) => {
  const queryNormalized = normalizeString(query);

  const resolveResultByValue = (value: string) => {
    const valueNormalized = normalizeString(value);
    if (!valueNormalized.includes(queryNormalized)) {
      return null;
    }

    // Relevance is determined by how many characters are matched
    // and how close to the beginning the match happened.
    const relevance =
      queryNormalized.length / valueNormalized.length -
      valueNormalized.indexOf(queryNormalized) / valueNormalized.length;

    return {
      entry,
      match: value,
      relevance
    };
  };

  return (
    resolveResultByValue(entry.sourceSpelling) ||
    resolveResultByValue(entry.correctSpelling) ||
    entry.incorrectSpellings
      .map((spelling) => resolveResultByValue(spelling))
      .find((val) => !!val) ||
    entry.relatedSpellings.map((spelling) => resolveResultByValue(spelling)).find((val) => !!val)
  );
};

const resolveResults = (vocabulary: VocabularyEntry[], query: string) => {
  if (!query) {
    return [];
  }

  const results: SearchResult[] = [];

  for (const entry of vocabulary) {
    const result = resolveResult(entry, query);
    if (result) {
      results.push(result);
    }
  }

  return results.sort((a, b) => b.relevance - a.relevance).slice(0, 10);
};

const useVocabularySearch = (vocabulary: VocabularyEntry[], query: string) => {
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

export default useVocabularySearch;
