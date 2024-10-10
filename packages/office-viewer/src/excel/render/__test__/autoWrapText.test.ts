import {stringToArray} from '../../../util/stringToArray';
import {FontStyle} from '../../types/FontStyle';

import {autoWrapText} from '../cell/autoWrapText';

/**
 * canvas 在不同操作系统下表现不一致，所以这里 mock 一下来保证测试的稳定性
 */
const mockCtx = {
  save: () => {},
  restore: () => {},
  measureText: (text: string) => {
    const width = stringToArray(text).length * 10;
    return {
      actualBoundingBoxRight: 0,
      actualBoundingBoxLeft: width,
      width,
      actualBoundingBoxAscent: 0,
      actualBoundingBoxDescent: 10,
      fontBoundingBoxAscent: 0,
      fontBoundingBoxDescent: 12
    };
  }
} as any;

const defaultFont: FontStyle = {
  family: '等线',
  size: 12,
  color: '#000000',
  b: false,
  i: false,
  u: 'none',
  strike: false,
  outline: false,
  shadow: false,
  condense: false
};

test('breakline', () => {
  expect(autoWrapText(mockCtx, '中\nabc', 30, defaultFont)).toEqual([
    {
      maxHeight: 12,
      tokens: [
        {
          type: 'w',
          t: '中',
          w: 10
        }
      ]
    },
    {
      maxHeight: 12,
      tokens: [
        {
          type: 'w',
          t: 'abc',
          w: 30
        }
      ]
    }
  ]);
});

test('breaklineBefore', () => {
  expect(autoWrapText(mockCtx, '\nabc', 30, defaultFont)).toEqual([
    {
      maxHeight: 12,
      tokens: []
    },
    {
      maxHeight: 12,
      tokens: [
        {
          type: 'w',
          t: 'abc',
          w: 30
        }
      ]
    }
  ]);
});

test('wrapTwoLine', () => {
  expect(autoWrapText(mockCtx, '中abc', 30, defaultFont)).toEqual([
    {
      maxHeight: 12,
      tokens: [
        {
          type: 'w',
          t: '中',
          w: 10
        }
      ]
    },
    {
      maxHeight: 12,
      tokens: [
        {
          type: 'w',
          t: 'abc',
          w: 30
        }
      ]
    }
  ]);
});

test('wrapTwoLineMore', () => {
  // 虽然是一个单词但太长了也得折行
  expect(autoWrapText(mockCtx, 'abcd', 30, defaultFont)).toEqual([
    {
      maxHeight: 12,
      tokens: [
        {
          type: 'w',
          t: 'abc',
          w: 30
        }
      ]
    },
    {
      maxHeight: 12,
      tokens: [
        {
          type: 'w',
          t: 'd',
          w: 10
        }
      ]
    }
  ]);
});

test('wrapTwoLineMoreMerge', () => {
  // 虽然是一个单词但太长了也得折行
  expect(autoWrapText(mockCtx, '中abcdef文', 30, defaultFont)).toEqual([
    {
      maxHeight: 12,
      tokens: [
        {
          type: 'w',
          t: '中',
          w: 10
        },
        {
          type: 'w',
          t: 'ab',
          w: 20
        }
      ]
    },
    {
      maxHeight: 12,
      tokens: [
        {
          type: 'w',
          t: 'cde',
          w: 30
        }
      ]
    },
    {
      maxHeight: 12,
      tokens: [
        {
          type: 'w',
          t: 'f',
          w: 10
        },
        {
          type: 'w',
          t: '文',
          w: 10
        }
      ]
    }
  ]);
});

test('richText', () => {
  // 富文本
  expect(
    autoWrapText(
      mockCtx,
      [
        {
          rPr: {},
          t: 'ric\n'
        },
        {
          rPr: {
            sz: 12,
            color: {
              rgb: 'FFFF0000'
            },
            rFont: '等线',
            family: 3,
            charset: 134
          },
          t: 'tex'
        }
      ],
      30,
      defaultFont
    )
  ).toEqual([
    {
      maxHeight: 12,
      tokens: [
        {
          rPr: {},
          type: 'w',
          t: 'ric',
          w: 30
        }
      ]
    },
    {
      maxHeight: 12,
      tokens: [
        {
          rPr: {
            sz: 12,
            color: {
              rgb: 'FFFF0000'
            },
            rFont: '等线',
            family: 3,
            charset: 134
          },
          type: 'w',
          t: 'tex',
          w: 30
        }
      ]
    }
  ]);
});
