/**
 * 创建个大的csv文件
 */

import process from 'node:process';

const columns = 10;
const rows = 1000000;

// 写入 csv header
const header: string[] = [];
for (let i = 0; i < columns; i++) {
  header.push(`col${i}`);
}
process.stdout.write(header.join(',') + '\n');

for (let i = 0; i < rows; i++) {
  const row: string[] = [];
  for (let j = 0; j < columns; j++) {
    row.push(`r${i} c${j}`);
  }
  process.stdout.write(row.join(',') + '\n');
}
