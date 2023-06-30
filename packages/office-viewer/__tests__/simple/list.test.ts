import {snapShotTest} from '../snapShotTest';

test('list', async () => {
  snapShotTest('./docx/simple/list.xml');
});
