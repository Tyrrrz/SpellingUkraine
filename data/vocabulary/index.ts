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

export const getVocabulary = () => {
  const dirPaths = fs
    .readdirSync(path.join(process.cwd(), 'data', 'vocabulary'), { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => path.join(dirPath, dirent.name));

  const filePaths = dirPaths
    .map((dirPath) =>
      fs
        .readdirSync(dirPath)
        .filter((fileName) => fileName.endsWith('.json'))
        .map((fileName) => path.join(dirPath, fileName))
    )
    .reduce((acc, val) => acc.concat(val), []);

  return filePaths.map(
    (filePath) =>
      ({
        ...JSON.parse(fs.readFileSync(filePath, 'utf8')),
        id: path.parse(filePath).name
      } as VocabularyEntry)
  );
};

export const getVocabularyEntry = (id: string) => {
  const entry = getVocabulary().find((entry) => entry.id === id);
  if (!entry) {
    throw new Error(`Vocabulary entry with ID '${id}' not found`);
  }
  return entry;
};
