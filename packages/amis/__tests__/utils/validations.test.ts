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

/** ============================ 日期时间相关 ============================= */
describe('validation:DateTime', () => {
  describe('validation: isDateTimeSame', () => {
    const targetDate = '2022-10-01 00:00:00';

    test('validation: isDateTimeSame:valid', () => {
      expect(
        validate(
          targetDate,
          {},
          {
            isDateTimeSame: targetDate
          }
        )
      ).toMatchObject([]);
    });

    test('validation: isDateTimeSame:inValid', () => {
      expect(
        validate(
          '2022-10-01 12:00:00',
          {},
          {
            isDateTimeSame: targetDate
          }
        )
      ).toMatchObject([
        {msg: 'validate.isDateTimeSame', rule: 'isDateTimeSame'}
      ]);
    });
  });

  describe('validation: isDateTimeBefore', () => {
    const targetDate = '2022-10-01 00:00:00';

    test('validation: isDateTimeBefore:valid', () => {
      expect(
        validate(
          '2022-08-25 10:00:00',
          {},
          {
            isDateTimeBefore: targetDate
          }
        )
      ).toMatchObject([]);
    });

    test('validation: isDateTimeBefore:inValid', () => {
      expect(
        validate(
          '2022-10-01 00:00:30',
          {},
          {
            isDateTimeBefore: targetDate
          }
        )
      ).toMatchObject([
        {msg: 'validate.isDateTimeBefore', rule: 'isDateTimeBefore'}
      ]);
    });
  });

  describe('validation: isDateTimeAfter', () => {
    const targetDate = '2022-10-01 00:00:00';

    test('validation: isDateTimeAfter:valid', () => {
      expect(
        validate(
          '2022-10-01 00:00:01',
          {},
          {
            isDateTimeAfter: targetDate
          }
        )
      ).toMatchObject([]);
    });

    test('validation: isDateTimeAfter:inValid', () => {
      expect(
        validate(
          '2022-09-30 23:59:59',
          {},
          {
            isDateTimeAfter: targetDate
          }
        )
      ).toMatchObject([
        {msg: 'validate.isDateTimeAfter', rule: 'isDateTimeAfter'}
      ]);
    });
  });

  describe('validation: isDateTimeSameOrBefore', () => {
    const targetDate = '2022-10-01 00:00:00';

    test('validation: isDateTimeSameOrBefore:same valid', () => {
      expect(
        validate(
          targetDate,
          {},
          {
            isDateTimeSameOrBefore: targetDate
          }
        )
      ).toMatchObject([]);
    });

    test('validation: isDateTimeSameOrBefore:before valid', () => {
      expect(
        validate(
          '2022-09-30 23:59:59',
          {},
          {
            isDateTimeSameOrBefore: targetDate
          }
        )
      ).toMatchObject([]);
    });

    test('validation: isDateTimeSameOrBefore:inValid', () => {
      expect(
        validate(
          '2022-10-01 00:00:10',
          {},
          {
            isDateTimeSameOrBefore: targetDate
          }
        )
      ).toMatchObject([
        {msg: 'validate.isDateTimeSameOrBefore', rule: 'isDateTimeSameOrBefore'}
      ]);
    });
  });

  describe('validation: isDateTimeSameOrAfter', () => {
    const targetDate = '2022-10-01 00:00:00';

    test('validation: isDateTimeSameOrAfter:same valid', () => {
      expect(
        validate(
          targetDate,
          {},
          {
            isDateTimeSameOrAfter: targetDate
          }
        )
      ).toMatchObject([]);
    });

    test('validation: isDateTimeSameOrAfter:after valid', () => {
      expect(
        validate(
          '2022-10-01 00:10:00',
          {},
          {
            isDateTimeSameOrAfter: targetDate
          }
        )
      ).toMatchObject([]);
    });

    test('validation: isDateTimeSameOrAfter:inValid', () => {
      expect(
        validate(
          '2022-09-30 23:59:59',
          {},
          {
            isDateTimeSameOrAfter: targetDate
          }
        )
      ).toMatchObject([
        {msg: 'validate.isDateTimeSameOrAfter', rule: 'isDateTimeSameOrAfter'}
      ]);
    });
  });

  describe('validation: isDateTimeBetween', () => {
    const lhs = '2022-10-01 00:00:00';
    const rhs = '2022-10-03 00:00:00';

    test('validation: isDateTimeBetween:default valid', () => {
      expect(
        validate(
          '2022-10-01 00:00:01',
          {},
          {
            isDateTimeBetween: [lhs, rhs]
          }
        )
      ).toMatchObject([]);
    });

    test('validation: isDateTimeBetween:inclusivity with () endpoints of the interval', () => {
      expect(
        validate(
          '2022-10-01 00:00:00',
          {},
          {
            isDateTimeBetween: [lhs, rhs, 'millisecond', '()']
          }
        )
      ).toMatchObject([
        {msg: 'validate.isDateTimeBetween', rule: 'isDateTimeBetween'}
      ]);
    });

    test('validation: isDateTimeBetween:inclusivity with [] endpoints of the interval', () => {
      expect(
        validate(
          '2022-10-01 00:00:00',
          {},
          {
            isDateTimeBetween: [lhs, rhs, 'millisecond', '[]']
          }
        )
      ).toMatchObject([]);
    });
  });
});

/** ============================ 时间相关 ============================= */
describe('validation:Time', () => {
  describe('validation: isTimeSame', () => {
    const targetTime = '00:00:00';

    test('validation: isTimeSame:valid', () => {
      expect(
        validate(
          targetTime,
          {},
          {
            isTimeSame: targetTime
          }
        )
      ).toMatchObject([]);
    });

    test('validation: isTimeSame:inValid', () => {
      expect(
        validate(
          '12:00:00',
          {},
          {
            isTimeSame: targetTime
          }
        )
      ).toMatchObject([{msg: 'validate.isTimeSame', rule: 'isTimeSame'}]);
    });
  });

  describe('validation: isTimeBefore', () => {
    const targetTime = '15:00:00';

    test('validation: isTimeBefore:valid', () => {
      expect(
        validate(
          '10:00:00',
          {},
          {
            isTimeBefore: targetTime
          }
        )
      ).toMatchObject([]);
    });

    test('validation: isTimeBefore:inValid', () => {
      expect(
        validate(
          '15:00:30',
          {},
          {
            isTimeBefore: targetTime
          }
        )
      ).toMatchObject([{msg: 'validate.isTimeBefore', rule: 'isTimeBefore'}]);
    });
  });

  describe('validation: isTimeAfter', () => {
    const targetTime = '15:00:00';

    test('validation: isTimeAfter:valid', () => {
      expect(
        validate(
          '15:30:01',
          {},
          {
            isTimeAfter: targetTime
          }
        )
      ).toMatchObject([]);
    });

    test('validation: isTimeAfter:inValid', () => {
      expect(
        validate(
          '12:40:01',
          {},
          {
            isTimeAfter: targetTime
          }
        )
      ).toMatchObject([{msg: 'validate.isTimeAfter', rule: 'isTimeAfter'}]);
    });
  });

  describe('validation: isTimeSameOrBefore', () => {
    const targetTime = '12:00:00';

    test('validation: isTimeSameOrBefore:same valid', () => {
      expect(
        validate(
          targetTime,
          {},
          {
            isTimeSameOrBefore: targetTime
          }
        )
      ).toMatchObject([]);
    });

    test('validation: isTimeSameOrBefore:before valid', () => {
      expect(
        validate(
          '11:59:59',
          {},
          {
            isTimeSameOrBefore: targetTime
          }
        )
      ).toMatchObject([]);
    });

    test('validation: isTimeSameOrBefore:inValid', () => {
      expect(
        validate(
          '12:00:01',
          {},
          {
            isTimeSameOrBefore: targetTime
          }
        )
      ).toMatchObject([
        {msg: 'validate.isTimeSameOrBefore', rule: 'isTimeSameOrBefore'}
      ]);
    });
  });

  describe('validation: isTimeSameOrAfter', () => {
    const targetTime = '12:00:00';

    test('validation: isTimeSameOrAfter:same valid', () => {
      expect(
        validate(
          targetTime,
          {},
          {
            isTimeSameOrAfter: targetTime
          }
        )
      ).toMatchObject([]);
    });

    test('validation: isTimeSameOrAfter:after valid', () => {
      expect(
        validate(
          '23:00:00',
          {},
          {
            isTimeSameOrAfter: targetTime
          }
        )
      ).toMatchObject([]);
    });

    test('validation: isTimeSameOrAfter:inValid', () => {
      expect(
        validate(
          '08:00:00',
          {},
          {
            isTimeSameOrAfter: targetTime
          }
        )
      ).toMatchObject([
        {msg: 'validate.isTimeSameOrAfter', rule: 'isTimeSameOrAfter'}
      ]);
    });
  });

  describe('validation: isTimeBetween', () => {
    const lhs = '06:00:00';
    const rhs = '18:00:00';

    test('validation: isTimeBetween:default valid', () => {
      expect(
        validate(
          '12:00:00',
          {},
          {
            isTimeBetween: [lhs, rhs]
          }
        )
      ).toMatchObject([]);
    });

    test('validation: isTimeBetween:inclusivity with () endpoints of the interval', () => {
      expect(
        validate(
          '06:00:00',
          {},
          {
            isTimeBetween: [lhs, rhs, 'millisecond', '()']
          }
        )
      ).toMatchObject([{msg: 'validate.isTimeBetween', rule: 'isTimeBetween'}]);
    });

    test('validation: isTimeBetween:inclusivity with [] endpoints of the interval', () => {
      expect(
        validate(
          '18:00:00',
          {},
          {
            isTimeBetween: [lhs, rhs, 'millisecond', '[]']
          }
        )
      ).toMatchObject([]);
    });
  });
});
