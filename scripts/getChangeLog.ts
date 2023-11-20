import fs from 'fs';
import path from 'path';
import util from 'util';
import {exec as nodeExec} from 'child_process';

const exec = util.promisify(nodeExec);

const pkg = '@fex/amis';
const folder = path.join(path.dirname(__filename), '../node_modules');

export async function main(from: string, to: string, useMarkdown: boolean = false) {
  const toBeClearedQueue = [];
  let {stdout: packFromStdout} = await exec(
    `npm pack ${pkg}@${from} --pack-destination="${folder}"`
  );
  const fromFilname = packFromStdout.trim();
  const fromFolder = `${folder}/amis_${from}`;
  const fromTgz = path.join(folder, fromFilname);

  await exec(`mkdir -p ${fromFolder}`);
  await exec(`tar -xzvf ${fromTgz} -C ${fromFolder}`);

  toBeClearedQueue.push(fromFolder, fromTgz);

  const fromRevision = JSON.parse(
    fs.readFileSync(fromFolder + '/package/revision.json', 'utf-8').trim()
  );

  const {stdout: packToStdout} = await exec(
    `npm pack ${pkg}@${to} --pack-destination="${folder}"`
  );
  const toFilname = packToStdout.trim();
  const toFolder = `${folder}/amis_${to}`;
  const toTgz = path.join(folder, toFilname);

  await exec(`mkdir -p ${toFolder}`);
  await exec(`tar -xzvf ${toTgz} -C ${toFolder}`);

  toBeClearedQueue.push(toFolder, toTgz);

  const toRevision = JSON.parse(
    fs.readFileSync(toFolder + '/package/revision.json', 'utf-8').trim()
  );

  const {stdout: logs} = await exec(
    `git log ${fromRevision.SHA1}...${toRevision.SHA1}^ --oneline`
  );
  const lines = logs.split('\n');
  const commits = lines
    .map(line => {
      const [SHA1, ...message] = line.split(' ');
      const msg = message.join(' ');

      if (msg.startsWith('Merge') || msg.startsWith('bump:')) {
        return '';
      }

      return msg;
    })
    .filter(item => item);

  const prefixes = ['feat', 'feats', 'feat(amis)', 'feat(amis-editor)', 'fix', 'fix(amis)', 'fix(amis-editor)', 'chore', 'chore(amis)', 'chore(amis-editor)', 'styles', 'style', 'style(amis)', 'style(amis-editor)', 'docs', 'doc', 'docs(amis)', 'docs(amis-editor)', 'perf', 'refactor', 'revert',];

  /** 按照commit类型排序 */
  commits.sort((lhs, rhs) => {
    let lhsPrefixIndex = prefixes.findIndex(p => p === lhs.split(/\s*[:：]+\s*/)[0]);
    let rhsPrefixIndex = prefixes.findIndex(p => p === rhs.split(/\s*[:：]+\s*/)[0]);

    /** 找不到对应的标签就排队尾 */
    if (lhsPrefixIndex === -1) {
      lhsPrefixIndex = prefixes.length + 1;
    }

    if (rhsPrefixIndex === -1) {
      rhsPrefixIndex = prefixes.length + 1;
    }

    return lhsPrefixIndex - rhsPrefixIndex;
  })

  console.log(
    '\x1b[32m%s\x1b[0m',
    `✨ [@fex/amis] ${from} ===> ${to} change log：`
  );

  if (useMarkdown) {
    console.log(commits.map(i => `* ${i}`).join('\n'));
  } else {
    console.log(commits.join('\n'));
  }

  /** 清除缓存的文件和文件夹 */
  await exec(`npx rimraf ${toBeClearedQueue.join(' ')}`);
  console.log(
    '\x1b[32m%s\x1b[0m',
    '✨ [@fex/amis] Temporarily cached files have been successfully cleared!'
  );
}

main.apply(null, process.argv.slice(2)).catch((err: any) => {
  console.error(err);
  process.exit(1);
});
