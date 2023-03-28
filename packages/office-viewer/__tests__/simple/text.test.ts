import {snapShotTest} from '../snapShotTest';

test('text', async () => {
  snapShotTest('./docx/simple/text.xml');
});
