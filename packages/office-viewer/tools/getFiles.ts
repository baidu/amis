import {readdir} from 'node:fs/promises';
import {resolve} from 'path';

export async function* getFiles(dir: string): AsyncGenerator<string> {
  const dirs = await readdir(dir, {withFileTypes: true});
  for (const dirent of dirs) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}
