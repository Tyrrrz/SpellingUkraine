import fs from 'fs/promises';
import path from 'path';

type FSEnt = {
  kind: 'file' | 'directory';
  path: string;
};

export const recurseDir = async function* (dirPath: string): AsyncIterable<FSEnt> {
  const ents = await fs.readdir(dirPath, { withFileTypes: true });
  for (const ent of ents) {
    if (ent.isDirectory()) {
      yield {
        kind: 'directory',
        path: path.join(dirPath, ent.name)
      };

      yield* recurseDir(path.resolve(dirPath, ent.name));
    } else {
      yield {
        kind: 'file',
        path: path.join(dirPath, ent.name)
      };
    }
  }
};
