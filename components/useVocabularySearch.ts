import React from 'react';
import type { VocabularyEntry } from '../data/vocabulary';
import { useDebouncedValue } from './useDebouncedValue';

const filterVocabulary = (vocabulary: VocabularyEntry[], query: string) => {
  // TODO: Use a trie or something
  const queryNormalized = query.toLowerCase();
  if (!queryNormalized) {
    return [];
  }

  const matches = [] as { entry: VocabularyEntry; quality: number }[];

  for (const entry of vocabulary) {
    const keys = [
      entry.name.toLowerCase(),
      entry.translation.toLowerCase(),
      ...entry.mistranslations.map((item) => item.toLowerCase()),
      ...entry.aliases.map((item) => item.toLowerCase())
    ];

    for (const key of keys) {
      if (key.includes(queryNormalized)) {
        // Quality is determined by how many characters are matched
        // and how close to the beginning of the key the match happened.
        const quality =
          queryNormalized.length / key.length - key.indexOf(queryNormalized) / key.length;

        matches.push({ entry, quality });
        break;
      }
    }
  }

  return matches
    .sort((a, b) => b.quality - a.quality)
    .slice(0, 10)
    .map((match) => match.entry);
};

export const useVocabularySearch = (vocabulary: VocabularyEntry[]) => {
  const [results, setResults] = React.useState([] as VocabularyEntry[]);
  const [query, setQuery] = React.useState('');
  const debouncedQuery = useDebouncedValue(query, 500);

  React.useEffect(
    () => setResults(filterVocabulary(vocabulary, debouncedQuery)),
    [vocabulary, debouncedQuery]
  );

  return {
    query,
    setQuery,
    processing: query !== debouncedQuery,
    results
  };
};
