import path from 'path';
import fs from 'fs';

const dirPath = path.join(process.cwd(), 'data', 'vocabulary');

export interface VocabularyEntry {
  id: string;
  category: string;
  original: string;
  romanization: {
    valid: string;
    invalid: string[];
  };
  transcription?: string;
  description?: string;
}

export const getVocabularyIds = () => {
  const ids = [];

  for (const fileName of fs.readdirSync(dirPath)) {
    if (!fileName.endsWith('.json')) continue;
    ids.push(path.parse(fileName).name);
  }

  return ids;
};

export const getVocabularyEntry = (id: string) => {
  return {
    ...JSON.parse(fs.readFileSync(path.join(dirPath, `${id}.json`), 'utf8')),
    id
  } as VocabularyEntry;
};

export const getVocabulary = () => {
  const vocab = [];

  for (const id of getVocabularyIds()) {
    vocab.push(getVocabularyEntry(id));
  }

  return vocab;
};
