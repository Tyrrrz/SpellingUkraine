import fs from 'fs';
import path from 'path';
import { getRootDirPath } from './utils/path';

export interface VocabularyEntry {
  id: string;
  path: string;

  category: string;
  term: string;
  translation: string;
  mistakes: string[];
  aliases: string[];

  description?: string;

  links: {
    name: string;
    url: string;
  }[];

  location?: {
    latitude: number;
    longitude: number;
  };

  image?: {
    name: string;
    url: string;
  };
}

export const loadVocabulary = () => {
  const dirPath = path.resolve(getRootDirPath(), 'data', 'vocabulary');

  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .flatMap((dirent) =>
      fs
        .readdirSync(path.resolve(dirPath, dirent.name))
        .filter((fileName) => fileName.endsWith('.json'))
        .map((fileName) => path.resolve(dirPath, dirent.name, fileName))
    )
    .map(
      (filePath) =>
        <VocabularyEntry>{
          id: path.parse(filePath).name,
          path: path.relative(dirPath, filePath),
          mistakes: [],
          aliases: [],
          links: [],
          ...JSON.parse(fs.readFileSync(filePath, 'utf8'))
        }
    );
};

export const loadVocabularyEntry = (id: string) => {
  const entry = loadVocabulary().find((entry) => entry.id === id);

  if (!entry) {
    throw new Error(`Vocabulary entry with ID '${id}' not found`);
  }

  return entry;
};
