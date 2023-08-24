import {snapShotTest} from '../snapShotTest';

test('highlight', async () => {
  snapShotTest('./docx/simple/highlight.xml');
});
