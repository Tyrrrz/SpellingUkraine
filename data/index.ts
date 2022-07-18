import fs from 'fs/promises';
import path from 'path';
import { recurseDir } from './utils/fs';
import { getRootDirPath } from './utils/path';

export type VocabularyEntry = {
  id: string;
  path: string;

  category: string;

  sourceSpelling: string;
  correctSpelling: string;
  incorrectSpellings: string[];
  relatedSpellings: string[];

  transcription?: string;

  description?: string;

  links: {
    name: string;
    url: string;
  }[];

  location?: {
    lat: number;
    lng: number;
  };

  image?: {
    name: string;
    url: string;
  };
};

export const loadVocabulary = async function* () {
  const dirPath = path.resolve(getRootDirPath(), 'data', 'vocabulary');

  for await (const ent of recurseDir(dirPath)) {
    if (ent.kind !== 'file' || !ent.path.endsWith('.json')) {
      continue;
    }

    const entry: VocabularyEntry = {
      id: path.parse(ent.path).name,
      path: path.relative(dirPath, ent.path),
      incorrectSpellings: [],
      relatedSpellings: [],
      links: [],
      ...JSON.parse(await fs.readFile(ent.path, 'utf8'))
    };

    yield entry;
  }
};

export const loadVocabularyEntry = async (id: string) => {
  for await (const entry of loadVocabulary()) {
    if (entry.id === id) {
      return entry;
    }
  }

  throw new Error(`Vocabulary entry '${id}' not found`);
};
