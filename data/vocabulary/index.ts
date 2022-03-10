import fs from 'fs';
import path from 'path';

const dirPath = path.join(process.cwd(), 'data', 'vocabulary');

export interface VocabularyEntry {
  id: string;
  category: string;
  name: string;
  translation: string;
  mistranslations: string[];
  aliases?: string[];
  description?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  externalLinks?: {
    name: string;
    url: string;
  }[];
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
