import {colWidth2px, px2colWidth} from '../ColWidth';

test('colWidth2px', () => {
  const width = 8.83203125;
  const px = colWidth2px(width, 12);

  const colWidth = px2colWidth(px, 12);

  expect(colWidth).toBeCloseTo(width, 5);
});
