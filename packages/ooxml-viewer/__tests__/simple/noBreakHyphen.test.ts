import {snapShotTest} from '../snapShotTest';

test('noBreakHyphen', async () => {
  snapShotTest('./docx/simple/noBreakHyphen.xml');
});
