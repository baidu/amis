import fs from 'fs';
import path from 'path';
import util from 'util';
import {exec as nodeExec} from 'child_process';
import {fileURLToPath} from 'url';
const exec = util.promisify(nodeExec);

const pkg = '@fex/amis';
const folder = path.join(path.dirname(__filename), '../node_modules');

export async function main(from: string, to: string) {
  let {stdout: packFromStdout} = await exec(
    `npm pack ${pkg}@${from} --pack-destination="${folder}"`
  );
  const fromFilname = packFromStdout.trim();
  const fromFolder = `${folder}/amis_${from}`;
  await exec(`mkdir -p ${fromFolder}`);
  await exec(`tar -xzvf ${path.join(folder, fromFilname)} -C ${fromFolder}`);

  const fromRevision = JSON.parse(
    fs.readFileSync(fromFolder + '/package/revision.json', 'utf-8').trim()
  );

  const {stdout: packToStdout} = await exec(
    `npm pack ${pkg}@${to} --pack-destination="${folder}"`
  );
  const toFilname = packToStdout.trim();
  const toFolder = `${folder}/amis_${to}`;
  await exec(`mkdir -p ${toFolder}`);
  await exec(`tar -xzvf ${path.join(folder, toFilname)} -C ${toFolder}`);

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
  console.log(commits.join('\n'));
}

main.apply(null, process.argv.slice(2)).catch((err: any) => {
  console.error(err);
  process.exit(1);
});
