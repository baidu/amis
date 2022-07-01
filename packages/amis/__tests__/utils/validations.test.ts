import {validate, str2rules} from '../../src';

test('validation:isRequired valid', () => {
  expect(
    validate(
      'somestring',
      {},
      {
        isRequired: true
      },
      {
        isRequired: 'This is required!'
      }
    )
  ).toMatchObject([]);
});

test('validation:isRequired invalid', () => {
  expect(
    validate(
      '',
      {},
      {
        isRequired: true
      },
      {
        isRequired: 'This is required!'
      }
    )
  ).toMatchObject([
    {
      msg: 'This is required!',
      rule: 'isRequired'
    }
  ]);
});

test('validation:isEmail valid', () => {
  expect(
    validate(
      'abc@gmail.com',
      {},
      {
        isEmail: true
      },
      {
        isEmail: 'Email 格式不正确'
      }
    )
  ).toMatchObject([]);
});

test('validation:isEmail invalid', () => {
  expect(
    validate(
      'somestring',
      {},
      {
        isEmail: true
      },
      {
        isEmail: 'Email 格式不正确'
      }
    )
  ).toMatchObject([
    {
      msg: 'Email 格式不正确',
      rule: 'isEmail'
    }
  ]);
});

test('validation:isUrl valid', () => {
  expect(
    validate(
      'http://www.baidu.com',
      {},
      {
        isUrl: true
      },
      {
        isUrl: 'Url 格式不正确'
      }
    )
  ).toMatchObject([]);
});

test('validation:isUrl invalid', () => {
  expect(
    validate(
      'somestring',
      {},
      {
        isUrl: true
      },
      {
        isUrl: 'Url 格式不正确'
      }
    )
  ).toMatchObject([
    {
      msg: 'Url 格式不正确',
      rule: 'isUrl'
    }
  ]);
});

test('validation:isInt valid', () => {
  expect(
    validate(
      1,
      {},
      {
        isInt: true
      },
      {
        isInt: '请输入整型数字'
      }
    )
  ).toMatchObject([]);
});

test('validation:isInt invalid', () => {
  expect(
    validate(
      1.1,
      {},
      {
        isInt: true
      },
      {
        isInt: '请输入整型数字'
      }
    )
  ).toMatchObject([
    {
      rule: 'isInt',
      msg: '请输入整型数字'
    }
  ]);
});

test('validation:isAlpha valid', () => {
  expect(
    validate(
      'a',
      {},
      {
        isAlpha: true
      },
      {
        isAlpha: '请输入字母'
      }
    )
  ).toMatchObject([]);
});

test('validation:isAlpha invalid', () => {
  expect(
    validate(
      '%',
      {},
      {
        isAlpha: true
      },
      {
        isAlpha: '请输入字母'
      }
    )
  ).toMatchObject([
    {
      rule: 'isAlpha',
      msg: '请输入字母'
    }
  ]);
});

test('validation:isNumeric valid', () => {
  expect(
    validate(
      1.1,
      {},
      {
        isNumeric: true
      },
      {
        isNumeric: '请输入数字'
      }
    )
  ).toMatchObject([]);
});

test('validation:isNumeric invalid', () => {
  expect(
    validate(
      'a',
      {},
      {
        isNumeric: true
      },
      {
        isNumeric: '请输入数字'
      }
    )
  ).toMatchObject([
    {
      rule: 'isNumeric',
      msg: '请输入数字'
    }
  ]);
});

test('validation:isAlphanumeric Alpha valid', () => {
  expect(
    validate(
      'a',
      {},
      {
        isAlphanumeric: true
      },
      {
        isAlphanumeric: '请输入数字'
      }
    )
  ).toMatchObject([]);
});

test('validation:isAlphanumeric numeric valid', () => {
  expect(
    validate(
      1,
      {},
      {
        isAlphanumeric: true
      },
      {
        isAlphanumeric: '请输入字母或者数字'
      }
    )
  ).toMatchObject([]);
});

test('validation:isAlphanumeric invalid', () => {
  expect(
    validate(
      '%',
      {},
      {
        isAlphanumeric: true
      },
      {
        isAlphanumeric: '请输入字母或者数字'
      }
    )
  ).toMatchObject([
    {
      rule: 'isAlphanumeric',
      msg: '请输入字母或者数字'
    }
  ]);
});

test('validation:isFloat valid', () => {
  expect(
    validate(
      1.1,
      {},
      {
        isFloat: true
      },
      {
        isFloat: '请输入浮点型数值'
      }
    )
  ).toMatchObject([]);
});

test('validation:isFloat invalid', () => {
  expect(
    validate(
      'a',
      {},
      {
        isFloat: true
      },
      {
        isFloat: '请输入浮点型数值'
      }
    )
  ).toMatchObject([
    {
      rule: 'isFloat',
      msg: '请输入浮点型数值'
    }
  ]);
});

test('validation:isWords valid', () => {
  expect(
    validate(
      'baidu',
      {},
      {
        isWords: true
      },
      {
        isWords: '请输入字母'
      }
    )
  ).toMatchObject([]);
});

test('validation:isWords invalid', () => {
  expect(
    validate(
      '%',
      {},
      {
        isWords: true
      },
      {
        isWords: '请输入字母'
      }
    )
  ).toMatchObject([
    {
      rule: 'isWords',
      msg: '请输入字母'
    }
  ]);
});

test('validation:isUrlPath valid', () => {
  expect(
    validate(
      'baidu-fex_team',
      {},
      {
        isUrlPath: true
      },
      {
        isUrlPath: '只能输入字母、数字、`-` 和 `_`'
      }
    )
  ).toMatchObject([]);
});

test('validation:isUrlPath invalid', () => {
  expect(
    validate(
      'baidu&fex%team',
      {},
      {
        isUrlPath: true
      },
      {
        isUrlPath: '只能输入字母、数字、`-` 和 `_`'
      }
    )
  ).toMatchObject([
    {
      rule: 'isUrlPath',
      msg: '只能输入字母、数字、`-` 和 `_`'
    }
  ]);
});

test('validation:minLength valid', () => {
  expect(
    validate(
      'abcdef',
      {},
      {
        minLength: 5
      },
      {
        minLength: '请至少输入 5 个字符。'
      }
    )
  ).toMatchObject([]);
});

test('validation:minLength invalid', () => {
  expect(
    validate(
      'abcd',
      {},
      {
        minLength: 5
      },
      {
        minLength: '至少输入 5 个字符。'
      }
    )
  ).toMatchObject([
    {
      rule: 'minLength',
      msg: '至少输入 5 个字符。'
    }
  ]);
});

test('validation:maxLength valid', () => {
  expect(
    validate(
      'abcde',
      {},
      {
        maxLength: 5
      },
      {
        maxLength: '请不要输入 5 个字符以上'
      }
    )
  ).toMatchObject([]);
});

test('validation:maxLength invalid', () => {
  expect(
    validate(
      'abcded',
      {},
      {
        maxLength: 5
      },
      {
        maxLength: '请不要输入 5 个字符以上'
      }
    )
  ).toMatchObject([
    {
      rule: 'maxLength',
      msg: '请不要输入 5 个字符以上'
    }
  ]);
});

test('validation:minimum valid', () => {
  expect(
    validate(
      6,
      {},
      {
        minimum: 5
      },
      {
        minimum: '当前输入值低于最小值 5，请检查'
      }
    )
  ).toMatchObject([]);
});

test('validation:minimum invalid', () => {
  expect(
    validate(
      4,
      {},
      {
        minimum: 5
      },
      {
        minimum: '当前输入值低于最小值 5，请检查'
      }
    )
  ).toMatchObject([
    {
      rule: 'minimum',
      msg: '当前输入值低于最小值 5，请检查'
    }
  ]);
});

test('validation:maximum valid', () => {
  expect(
    validate(
      5,
      {},
      {
        maximum: 5
      },
      {
        maximum: '当前输入值超出最大值 5，请检查'
      }
    )
  ).toMatchObject([]);
});

test('validation:maximum invalid', () => {
  expect(
    validate(
      6,
      {},
      {
        maximum: 5
      },
      {
        maximum: '当前输入值超出最大值 5，请检查'
      }
    )
  ).toMatchObject([
    {
      rule: 'maximum',
      msg: '当前输入值超出最大值 5，请检查'
    }
  ]);
});

test('validation:isJson valid', () => {
  expect(
    validate(
      '{ "type": "select", "options": [ { "label": "A", "value": "a" } ] }',
      {},
      {
        isJson: true
      },
      {
        isJson: '请检查 Json 格式'
      }
    )
  ).toMatchObject([]);
});

test('validation:isJson invalid', () => {
  expect(
    validate(
      'string',
      {},
      {
        isJson: true
      },
      {
        isJson: '请检查 Json 格式'
      }
    )
  ).toMatchObject([
    {
      rule: 'isJson',
      msg: '请检查 Json 格式'
    }
  ]);
});

test('validation:isJson invalid', () => {
  expect(
    validate(
      '12345',
      {},
      {
        isJson: true
      },
      {
        isJson: '请检查 Json 格式'
      }
    )
  ).toMatchObject([
    {
      rule: 'isJson',
      msg: '请检查 Json 格式'
    }
  ]);
});

test('validation:isLength valid', () => {
  expect(
    validate(
      'abcde',
      {},
      {
        isLength: 5
      },
      {
        isLength: '请输入长度为 5 的内容'
      }
    )
  ).toMatchObject([]);
});

test('validation:isLength invalid', () => {
  expect(
    validate(
      'abc',
      {},
      {
        isLength: 5
      },
      {
        isLength: '请输入长度为 5 的内容'
      }
    )
  ).toMatchObject([
    {
      rule: 'isLength',
      msg: '请输入长度为 5 的内容'
    }
  ]);
});

test('validation:notEmptyString valid', () => {
  expect(
    validate(
      'abc',
      {},
      {
        notEmptyString: true
      },
      {
        notEmptyString: '请不要全输入空白字符'
      }
    )
  ).toMatchObject([]);
});

test('validation:notEmptyString invalid', () => {
  expect(
    validate(
      '  ',
      {},
      {
        notEmptyString: true
      },
      {
        notEmptyString: '请不要全输入空白字符'
      }
    )
  ).toMatchObject([
    {
      rule: 'notEmptyString',
      msg: '请不要全输入空白字符'
    }
  ]);
});

test('validation:equalsField valid', () => {
  expect(
    validate(
      'a',
      {
        a: 'a'
      },
      {
        equalsField: 'a'
      },
      {
        equalsField: '输入的数据与 a 值不一致'
      }
    )
  ).toMatchObject([]);
});

test('validation:equalsField invalid', () => {
  expect(
    validate(
      'b',
      {
        a: 'a'
      },
      {
        equalsField: 'a'
      },
      {
        equalsField: '输入的数据与 a 值不一致'
      }
    )
  ).toMatchObject([
    {
      rule: 'equalsField',
      msg: '输入的数据与 a 值不一致'
    }
  ]);
});

test('validation:equals valid', () => {
  expect(
    validate(
      'a',
      {},
      {
        equals: 'a'
      },
      {
        equals: '输入的数据与 a 不一致'
      }
    )
  ).toMatchObject([]);
});

test('validation:equals invalid', () => {
  expect(
    validate(
      'b',
      {},
      {
        equals: 'a'
      },
      {
        equals: '输入的数据与 a 不一致'
      }
    )
  ).toMatchObject([
    {
      rule: 'equals',
      msg: '输入的数据与 a 不一致'
    }
  ]);
});

test('validation:multipleRules invalid', () => {
  expect(
    validate(
      'abc',
      {},
      {
        isUrl: true,
        isInt: true
      }
    )
  ).toMatchObject([
    {
      rule: 'isUrl',
      msg: 'validate.isUrl'
    },
    {
      rule: 'isInt',
      msg: 'validate.isInt'
    }
  ]);
});

test('validation:matchRegexp valid', () => {
  expect(
    validate(
      'abcd',
      {},
      {
        matchRegexp: '/^abc/'
      },
      {
        matchRegexp: '请输入abc开头的好么'
      }
    )
  ).toMatchObject([]);
});

test('validation:matchRegexp invalid', () => {
  expect(
    validate(
      'cba',
      {},
      {
        matchRegexp: '/^abc/'
      },
      {
        matchRegexp: '请输入abc开头的好么'
      }
    )
  ).toMatchObject([
    {
      rule: 'matchRegexp',
      msg: '请输入abc开头的好么'
    }
  ]);
});

test('validation:matchRegexp:noSlash valid', () => {
  expect(
    validate(
      'abcd',
      {},
      {
        matchRegexp: '^abc'
      },
      {
        matchRegexp: '请输入abc开头的好么'
      }
    )
  ).toMatchObject([]);
});

test('validation:matchRegexp:noSlash invalid', () => {
  expect(
    validate(
      'cba',
      {},
      {
        matchRegexp: '^abc'
      },
      {
        matchRegexp: '请输入abc开头的好么'
      }
    )
  ).toMatchObject([
    {
      rule: 'matchRegexp',
      msg: '请输入abc开头的好么'
    }
  ]);
});

test('validation:multipleMatchRegexp valid', () => {
  expect(
    validate(
      'abcd123',
      {},
      {
        matchRegexp1: '/^abc/',
        matchRegexp2: '/123$/'
      },
      {
        matchRegexp1: '请输入abc开头的好么',
        matchRegexp2: '请输入123结尾的好么'
      }
    )
  ).toMatchObject([]);
});

test('validation:multipleMatchRegexp invalid', () => {
  expect(
    validate(
      'cba',
      {},
      {
        matchRegexp1: '/^abc/',
        matchRegexp2: '/123$/'
      },
      {
        matchRegexp1: '请输入abc开头的好么',
        matchRegexp2: '请输入123结尾的好么'
      }
    )
  ).toMatchObject([
    {
      rule: 'matchRegexp1',
      msg: '请输入abc开头的好么'
    },
    {
      rule: 'matchRegexp2',
      msg: '请输入123结尾的好么'
    }
  ]);
});

test('validation:multipleMatchRegexp:noSlash valid', () => {
  expect(
    validate(
      'abcd123',
      {},
      {
        matchRegexp1: '^abc',
        matchRegexp2: '123$'
      },
      {
        matchRegexp1: '请输入abc开头的好么',
        matchRegexp2: '请输入123结尾的好么'
      }
    )
  ).toMatchObject([]);
});

test('validation:multipleMatchRegexp:noSlash invalid', () => {
  expect(
    validate(
      'cba',
      {},
      {
        matchRegexp1: '^abc',
        matchRegexp2: '123$'
      },
      {
        matchRegexp1: '请输入abc开头的好么',
        matchRegexp2: '请输入123结尾的好么'
      }
    )
  ).toMatchObject([
    {
      rule: 'matchRegexp1',
      msg: '请输入abc开头的好么'
    },
    {
      rule: 'matchRegexp2',
      msg: '请输入123结尾的好么'
    }
  ]);
});

test('validation:str2rules', () => {
  expect(str2rules('matchRegexp:/^abc/')).toMatchObject({
    matchRegexp: ['/^abc/']
  });
});

test('validation:multiplestr2rules', () => {
  expect(str2rules('matchRegexp1:/^abc/,matchRegexp2:/123$/')).toMatchObject({
    matchRegexp1: ['/^abc/'],
    matchRegexp2: ['/123$/']
  });
});

test('validation:str2rules:noSlash', () => {
  expect(str2rules('matchRegexp:^abc')).toMatchObject({
    matchRegexp: ['^abc']
  });
});

test('validation:multiplestr2rules:noSlash', () => {
  expect(str2rules('matchRegexp1:^abc,matchRegexp2:123$')).toMatchObject({
    matchRegexp1: ['^abc'],
    matchRegexp2: ['123$']
  });
});
