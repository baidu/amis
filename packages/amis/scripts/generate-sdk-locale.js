/**
 * 用于生成 sdk 里的多语言，目前只有德语
 */

const fs = require('fs');

try {
  const localeFile = fs.readFileSync(process.argv[2], 'utf8');
  console.log(
    localeFile
      .replace(`import {register} from '../locale';`, '')
      .replace('register(', `amisRequire('amis').registerLocale(`)
  );
} catch (err) {
  console.error(err);
}
