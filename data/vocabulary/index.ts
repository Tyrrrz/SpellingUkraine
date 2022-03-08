import path from 'path';
import fs from 'fs';

const dirPath = path.join(process.cwd(), 'data', 'vocabulary');

export interface VocabularyEntry {
  id: string;
  category: string;
  ukr: string;
  rus: string;
  translit: {
    correct: string;
    incorrect: string[];
  };
  transcription?: string;
  description?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export const getVocabularyEntry = (id: string) => {
  return {
    ...JSON.parse(fs.readFileSync(path.join(dirPath, `${id}.json`), 'utf8')),
    id
  } as VocabularyEntry;
};

export const getVocabularyIds = () => {
  const ids = [];

  for (const fileName of fs.readdirSync(dirPath)) {
    if (fileName.endsWith('.json')) {
      ids.push(path.parse(fileName).name);
    }
  }

  return ids;
};

export const getVocabulary = () => {
  const vocab = [];

  for (const id of getVocabularyIds()) {
    vocab.push(getVocabularyEntry(id));
  }

  return vocab;
};
