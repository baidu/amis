/**
 * 记录发布时的commit信息，用于区分内网版本包之间的差异
 */

 import path from 'path';
 import {writeFileSync} from 'fs';
 import {execSync} from 'child_process';

 let outputFileName = process.argv[2];

 if (!outputFileName) {
   outputFileName = 'revision.json';
 }

 try {
   const rootDir = execSync('git rev-parse --show-toplevel').toString().trim();
   // 分支
   const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
   // commit id
   const SHA1 = execSync('git rev-parse --short HEAD').toString().trim();
   // commit body
   const commit = execSync(
     `git log -n 1 --date=format:'%Y-%m-%d %H:%M:%S' --format="%s%n%an%n%cd"`
   )
     .toString()
     .trim();

   const [message, author, date] = commit.split('\n');
   const content = JSON.stringify(
     {branch, SHA1, message, author, date},
     undefined,
     2
   );

   writeFileSync(path.join(rootDir, outputFileName), content, {
     encoding: 'utf8'
   });

   console.log(
     '\x1b[32m%s\x1b[0m',
     '✨ [amis] revision.json generated successfully!'
   );
   process.exit();
 } catch (error) {
   console.log('\x1b[31m%s\x1b[0m', '❌ [amis] revision.json failed to write!');
   process.exit(1);
 }
