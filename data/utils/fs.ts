import fs from 'fs';
import path from 'path';

export const getRootDirPath = () => {
  // Go up until root package.json is found
  let dirPath = path.resolve(process.cwd());
  while (true) {
    const packageJsonPath = path.resolve(dirPath, 'package.json');

    if (
      fs.existsSync(packageJsonPath) &&
      JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')).name === 'root'
    ) {
      return dirPath;
    }

    dirPath = path.resolve(dirPath, '..');

    if (path.parse(dirPath).root === dirPath) {
      throw new Error('Could not find root package.json');
    }
  }
};
