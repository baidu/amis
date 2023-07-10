import {snapShotTest} from '../snapShotTest';

test('text', async () => {
  snapShotTest('./docx/simple/textbox-vert.xml');
});
