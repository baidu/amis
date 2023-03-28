import {snapShotTest} from '../snapShotTest';

test('bold', async () => {
  snapShotTest('./docx/simple/br.docx');
});
