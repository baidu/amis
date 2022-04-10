import '../../src/utils/tpl.ts';
import '../../src/utils/tpl-builtin';
import '../../src/utils/tpl-lodash';

import {buildStyle} from '../../src/utils/style';

test('style var background', () => {
  expect(
    buildStyle('${style}', {
      style: {
        backgroundImage: 'http://www.example.com/a.png'
      }
    })
  ).toEqual({
    backgroundImage: 'url("http://www.example.com/a.png")'
  });

  expect(
    buildStyle(
      {
        backgroundImage: 'http://www.example.com/a.png'
      },
      {}
    )
  ).toEqual({
    backgroundImage: 'url("http://www.example.com/a.png")'
  });
});

test('style case', () => {
  expect(
    buildStyle(
      {
        'font-size': '10'
      },
      {}
    )
  ).toEqual({
    fontSize: '10'
  });
});
