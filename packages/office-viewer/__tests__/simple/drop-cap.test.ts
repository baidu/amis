import {snapShotTest} from '../snapShotTest';

test('bold', async () => {
  snapShotTest('./docx/simple/drop-cap.docx');
});
