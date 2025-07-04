import {formatCustomStyle} from '../../src/utils/style-helper';

const customStyleCases: [any, string][] = [
  [
    {
      root: {
        color: 'red'
      }
    },
    '\n.wrapperCustomStyle-test {\n  color: red;\n}'
  ],
  [
    {
      root: {
        a: {
          color: 'blue'
        }
      }
    },
    '\n.wrapperCustomStyle-test a {\n  color: blue;\n}'
  ],
  [
    {
      root: {
        'a,i': {
          color: 'blue'
        }
      }
    },
    '\n.wrapperCustomStyle-test a,.wrapperCustomStyle-test i {\n  color: blue;\n}'
  ],
  [
    {
      root: {
        'a,i': {
          span: {
            color: 'blue'
          }
        }
      }
    },
    '\n.wrapperCustomStyle-test a span,.wrapperCustomStyle-test i span {\n  color: blue;\n}'
  ],
  [
    {
      root: {
        'a,i': {
          'span,.custom': {
            color: 'blue'
          }
        }
      }
    },
    '\n.wrapperCustomStyle-test a span,.wrapperCustomStyle-test i span,.wrapperCustomStyle-test a .custom,.wrapperCustomStyle-test i .custom {\n  color: blue;\n}'
  ],
  [
    {
      '.cxd-Table': {
        'td,th': {
          color: 'red'
        }
      }
    },
    '\n.wrapperCustomStyle-test .cxd-Table td,.wrapperCustomStyle-test .cxd-Table th {\n  color: red;\n}'
  ]
];

describe('formatCustomStyle', () => {
  test.each(customStyleCases)(
    'formatCustomStyle should return styles correctly',
    (customStyle, expected) => {
      const {content} = formatCustomStyle({customStyle, id: 'test'});
      expect(content).toBe(expected);
    }
  );
});
