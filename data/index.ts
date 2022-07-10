import fs from 'fs';
import path from 'path';
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
          incorrectSpellings: [],
          relatedSpellings: [],
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
