import { useMemo } from 'react';
import { VocabularyEntry } from 'spelling-ukraine-data';
import { normalizeString } from '~/utils/str';

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
  const queryNormalized = normalizeString(query);

  for (const entry of vocabulary) {
    const spellings = [
      entry.sourceSpelling,
      entry.correctSpelling,
      ...entry.incorrectSpellings,
      ...entry.relatedSpellings
    ];

    for (const spelling of spellings) {
      const spellingNormalized = normalizeString(spelling);
      if (!spellingNormalized.includes(queryNormalized)) {
        continue;
      }

      // Relevance is determined by how many characters are matched
      // and how close to the beginning the match happened.
      const relevance =
        queryNormalized.length / spellingNormalized.length -
        spellingNormalized.indexOf(queryNormalized) / spellingNormalized.length;

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
  return useMemo(() => resolveResults(vocabulary, query), [vocabulary, query]);
};

export default useVocabularySearch;
