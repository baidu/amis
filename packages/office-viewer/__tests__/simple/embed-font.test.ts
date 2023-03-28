import {snapShotTest} from '../snapShotTest';

test('embed-font', async () => {
  snapShotTest('./docx/simple/embed-font.xml');
});
