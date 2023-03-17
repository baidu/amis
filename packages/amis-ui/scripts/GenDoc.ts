import path from 'path';
import fs from 'fs';
import {promisify} from 'util';

const readdir = promisify(fs.readdir);
const statPath = promisify(fs.stat);

const DIR = path.join(__dirname, '../scss/helper');
export async function main() {
  const files = await getFiles(DIR);

  for (const relativePath of files) {
    const filepath = path.join(DIR, relativePath);
    const contents = await readFileAsync(filepath);
    const markdowns: Array<string> = [];

    contents.replace(
      /\/\*\!markdown\n([\s\S]+?)\*\//g,
      (_: string, md: string) => {
        markdowns.push(md.trim());
        return _;
      }
    );

    if (markdowns.length) {
      let mdFilePath = filepath.replace(/\.scss$/, '.md');
      await writeFileAsync(mdFilePath, markdowns.join('\n'));
      console.log(`write ${mdFilePath}`);
    }
  }

  console.log('Done');
}

async function getFiles(
  dir: string,
  prefix: string = '',
  ret: Array<string> = []
) {
  const files = await readdir(dir);

  for (let i = 0, len = files.length; i < len; i++) {
    const name = files[i];
    const filepath = path.join(dir, name);
    const stat = await statPath(filepath);

    if (stat.isDirectory()) {
      await getFiles(filepath, prefix ? path.join(prefix, name) : name, ret);
    } else {
      ret.push(prefix ? path.join(prefix, name) : name);
    }
  }

  return ret;
}

function readFileAsync(filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function writeFileAsync(filename: string, content: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(
      filename,
      content,
      {
        encoding: 'utf8'
      },
      err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

main().catch(e => console.error(e));
