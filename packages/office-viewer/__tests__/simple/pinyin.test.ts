import {snapShotTest} from '../snapShotTest';

test('pinyin', async () => {
  snapShotTest('./docx/simple/pinyin.xml');
});
