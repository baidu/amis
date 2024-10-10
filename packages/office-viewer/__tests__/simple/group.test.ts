import {snapShotTest} from '../snapShotTest';

test('group', async () => {
  snapShotTest('./docx/simple/group.docx');
});

test('group-in-group', async () => {
  snapShotTest('./docx/simple/group-in-group.docx');
});

test('shape-group', async () => {
  snapShotTest('./docx/simple/shape-group.docx');
});
