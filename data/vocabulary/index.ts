import fs from 'fs';
import path from 'path';

const dirPath = path.join(process.cwd(), 'data', 'vocabulary');

export interface VocabularyEntry {
  id: string;
  path: string;
  visible: boolean;
  category: string;
  name: string;
  translation: string;
  mistranslations: string[];
  aliases: string[];
  description?: string;
  externalLinks: {
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
  }
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

  return filePaths
    .map(
      (filePath) =>
        ({
          id: path.parse(filePath).name,
          path: path.relative(dirPath, filePath),
          visible: true,
          mistranslations: [],
          aliases: [],
          externalLinks: [],
          ...JSON.parse(fs.readFileSync(filePath, 'utf8'))
        } as VocabularyEntry)
    )
    .filter((entry) => entry.visible);
};

export const getVocabularyEntry = (id: string) => {
  const entry = getVocabulary().find((entry) => entry.id === id);
  if (!entry) {
    throw new Error(`Vocabulary entry with ID '${id}' not found`);
  }
  return entry;
};
