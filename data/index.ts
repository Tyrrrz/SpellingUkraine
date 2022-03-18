import fs from 'fs';
import path from 'path';

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

export const getVocabulary = () => {
  const dirPath = path.resolve(path.dirname(require.resolve('./package.json')), './vocabulary');

  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) =>
      fs
        .readdirSync(path.resolve(dirPath, dirent.name))
        .filter((fileName) => fileName.endsWith('.json'))
        .map((fileName) => path.resolve(dirPath, dirent.name, fileName))
    )
    .reduce((acc, val) => acc.concat(val), [])
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

export const getVocabularyEntry = (id: string) => {
  const entry = getVocabulary().find((entry) => entry.id === id);

  if (!entry) {
    throw new Error(`Vocabulary entry with ID '${id}' not found`);
  }

  return entry;
};
