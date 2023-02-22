import {SchemaObject} from 'amis/lib/schema';

/**
 * @file 所有可用验证器
 */
const Validators: Validator[] = [];

/**
 * 校验规则类名
 */
export enum ValidationGroup {
  Pattern = '文本',
  Number = '数字',
  Regex = '正则',
  Others = '其他'
}

export interface Validator {
  /**
   * 校验规则名称，英文
   */
  name: string;

  /**
   * 校验规则标题
   */
  label: string;

  /**
   * 校验不通过的提示，没有则表示用户不能自定义配置
   */
  message?: string;

  /**
   * 分类
   */
  group?: string;

  // /**
  //  * 显示该校验的条件，如 {type: 组件类型}，与hidden结合使用，两者都空时默认展示
  //  */
  // visible?: Array<SchemaObject>

  // /**
  //  * 不显示该校验的条件，如 {type: 组件类型}，与visible结合使用，两者都空时默认展示
  //  */
  // hidden?: Array<SchemaObject>

  /**
   * 快速编辑的表单
   */
  schema?: any[];

  /**
   * 输入类型，true则表示是默认
   */
  tag: Partial<Record<ValidatorTag, ValidTagMatchType>>;
}

enum ValidTagMatchType {
  isDefault = 1, // 默认推荐，可以直接操作开关
  isMore = 2, // 默认不推荐，可以通过更多添加规则来进行设置，不可操作开关
  isBuiltIn = 3 // 默认内置校验， 默认开启，不可操作开关关闭
}

export const registerValidator = (...config: Array<Validator>) => {
  Validators.push(...config);
};

export const getValidatorsByTag = (tag: ValidatorTag) => {
  const defaultValidators: Record<string, Validator> = {};
  const moreValidators: Record<string, Validator> = {};
  const builtInValidators: Record<string, Validator> = {};

  Validators.forEach((valid: Validator) => {
    let tagMatch = valid.tag[tag];
    if (tagMatch != null) {
      if (tagMatch === ValidTagMatchType.isDefault) {
        defaultValidators[valid.name] = valid;
      } else if (tagMatch === ValidTagMatchType.isMore) {
        moreValidators[valid.name] = valid;
      } else if (tagMatch === ValidTagMatchType.isBuiltIn) {
        builtInValidators[valid.name] = valid;
      }
      return;
    }

    tagMatch = valid.tag[ValidatorTag.All];
    if (tagMatch != null) {
      if (tagMatch === ValidTagMatchType.isDefault) {
        defaultValidators[valid.name] = valid;
      } else if (tagMatch === ValidTagMatchType.isMore) {
        moreValidators[valid.name] = valid;
      } else if (tagMatch === ValidTagMatchType.isBuiltIn) {
        builtInValidators[valid.name] = valid;
      }
    }
  });
  return {
    defaultValidators,
    moreValidators,
    builtInValidators
  };
};

export const getValidator = (name: string) => {
  return Validators.find(item => item.name === name);
};

export enum ValidatorTag {
  All = '0',
  Text = '1',
  MultiSelect = '2',
  Check = '3',
  Email = '4',
  Password = '5',
  URL = '6',
  Number = '7',
  File = '8',
  Date = '9',
  Code = '10',
  Tree = '11'
}

registerValidator(
  {
    label: '必填',
    name: 'required',
    tag: {
      [ValidatorTag.Text]: ValidTagMatchType.isDefault,
      [ValidatorTag.File]: ValidTagMatchType.isDefault,
      [ValidatorTag.MultiSelect]: ValidTagMatchType.isDefault,
      [ValidatorTag.Date]: ValidTagMatchType.isDefault,
      [ValidatorTag.Code]: ValidTagMatchType.isDefault,
      [ValidatorTag.Email]: ValidTagMatchType.isDefault,
      [ValidatorTag.Password]: ValidTagMatchType.isDefault,
      [ValidatorTag.URL]: ValidTagMatchType.isDefault,
      [ValidatorTag.Tree]: ValidTagMatchType.isDefault
    }
  },
  {
    label: '邮箱格式',
    name: 'isEmail',
    group: ValidationGroup.Pattern,
    message: 'Email 格式不正确',
    tag: {
      [ValidatorTag.Email]: ValidTagMatchType.isBuiltIn,
      [ValidatorTag.Text]: ValidTagMatchType.isMore
    }
  },
  {
    label: 'Url格式',
    name: 'isUrl',
    group: ValidationGroup.Pattern,
    message: 'Url 格式不正确',
    tag: {
      [ValidatorTag.URL]: ValidTagMatchType.isBuiltIn,
      [ValidatorTag.Text]: ValidTagMatchType.isMore
    }
  },
  {
    label: '字母',
    name: 'isAlpha',
    group: ValidationGroup.Pattern,
    message: '请输入字母',
    tag: {
      [ValidatorTag.Text]: ValidTagMatchType.isMore
    }
  },
  {
    label: '数字',
    name: 'isNumeric',
    group: ValidationGroup.Number,
    message: '请输入数字',
    tag: {
      [ValidatorTag.Number]: ValidTagMatchType.isDefault,
      [ValidatorTag.Text]: ValidTagMatchType.isMore
    }
  },
  {
    label: '字母和数字',
    name: 'isAlphanumeric',
    group: ValidationGroup.Pattern,
    message: '请输入字母或者数字',
    tag: {
      [ValidatorTag.Text]: ValidTagMatchType.isMore
    }
  },
  {
    label: '整型数字',
    name: 'isInt',
    group: ValidationGroup.Number,
    message: '请输入整形数字',
    tag: {
      [ValidatorTag.Number]: ValidTagMatchType.isDefault,
      [ValidatorTag.Text]: ValidTagMatchType.isMore
    }
  },
  {
    label: '浮点型数字',
    name: 'isFloat',
    group: ValidationGroup.Number,
    message: '请输入浮点型数值',
    tag: {
      [ValidatorTag.Number]: ValidTagMatchType.isDefault,
      [ValidatorTag.Text]: ValidTagMatchType.isMore
    }
  },
  {
    label: '固定长度',
    name: 'isLength',
    group: ValidationGroup.Pattern,
    message: '请输入长度为 \\$1 的内容',
    tag: {
      [ValidatorTag.Number]: ValidTagMatchType.isDefault,
      [ValidatorTag.Text]: ValidTagMatchType.isMore
    },
    schema: [
      {
        type: 'input-number',
        name: 'value',
        label: '字符数',
        placeholder: '请输入字符个数'
      }
    ]
  },
  {
    label: '最大长度',
    name: 'maxLength',
    group: ValidationGroup.Pattern,
    message: '请控制内容长度, 请不要输入 \\$1 个字符以上',
    tag: {
      [ValidatorTag.Text]: ValidTagMatchType.isDefault
    },
    schema: [
      {
        type: 'input-number',
        name: 'value',
        label: '字符数'
        // placeholder: '请输入字符个数'
      }
    ]
  },
  // {
  //   label: '最大个数',
  //   name: 'maxLength',
  //   group: ValidationGroup.Pattern,
  //   message: '文件个数不可超过 \\$1 个',
  //   tag: {
  //     [ValidatorTag.File]: true
  //   },
  //   schema: [
  //     {
  //       type: 'input-number',
  //       name: 'value',
  //       label: '文件数'
  //     }
  //   ]
  // },
  // {
  //   label: '最小个数',
  //   name: 'minLength',
  //   group: ValidationGroup.Pattern,
  //   message: '文件个数不可少于 \\$1 个',
  //   tag: {
  //     [ValidatorTag.File]: true
  //   },
  //   schema: [
  //     {
  //       type: 'input-number',
  //       name: 'value',
  //       label: '文件数'
  //     }
  //   ]
  // },
  // {
  //   label: '最大体积',
  //   group: ValidationGroup.Pattern,
  //   name: 'maxSize',
  //   message: '文件体积不可超过 \\$1 Byte',
  //   tag: {
  //     [ValidatorTag.File]: true
  //   },
  //   schema: [
  //     {
  //       type: 'input-number',
  //       label: '体积(Byte)'
  //     }
  //   ]
  // },
  {
    label: '最小长度',
    name: 'minLength',
    group: ValidationGroup.Pattern,
    message: '请输入更多的内容，至少输入 \\$1 个字符',
    tag: {
      [ValidatorTag.Text]: ValidTagMatchType.isDefault
    },
    schema: [
      {
        type: 'input-number',
        name: 'value',
        label: '字符数'
        // placeholder: '请输入字符个数'
      }
    ]
  },
  {
    label: '最大值',
    name: 'maximum',
    group: ValidationGroup.Number,
    message: '当前输入值超出最大值 \\$1，请检查',
    tag: {
      [ValidatorTag.Number]: ValidTagMatchType.isDefault,
      [ValidatorTag.Text]: ValidTagMatchType.isMore
    },
    schema: [
      {
        type: 'input-number',
        name: 'value',
        label: '最大值'
        // placeholder: '请输入最大值'
      }
    ]
  },
  {
    label: '最小值',
    name: 'minimum',
    group: ValidationGroup.Number,
    message: '当前输入值低于最小值 \\$1，请检查',
    tag: {
      [ValidatorTag.Number]: ValidTagMatchType.isDefault,
      [ValidatorTag.Text]: ValidTagMatchType.isMore
    },
    schema: [
      {
        type: 'input-number',
        name: 'value',
        label: '最小值'
        // placeholder: '请输入最小值'
      }
    ]
  },
  {
    label: '手机号码',
    name: 'isPhoneNumber',
    group: ValidationGroup.Pattern,
    message: '请输入合法的手机号码',
    tag: {
      [ValidatorTag.Text]: ValidTagMatchType.isMore
    }
  },
  {
    label: '电话号码',
    name: 'isTelNumber',
    group: ValidationGroup.Pattern,
    message: '请输入合法的电话号码',
    tag: {
      [ValidatorTag.Text]: ValidTagMatchType.isMore
    }
  },
  {
    label: '邮编号码',
    name: 'isZipcode',
    group: ValidationGroup.Pattern,
    message: '请输入合法的邮编地址',
    tag: {
      [ValidatorTag.Text]: ValidTagMatchType.isMore
    }
  },
  {
    label: '身份证号码',
    name: 'isId',
    group: ValidationGroup.Pattern,
    message: '请输入合法的身份证号',
    tag: {
      [ValidatorTag.Text]: ValidTagMatchType.isMore
    }
  },
  {
    label: 'JSON格式',
    name: 'isJson',
    group: ValidationGroup.Pattern,
    message: '请检查 Json 格式',
    tag: {
      [ValidatorTag.Text]: ValidTagMatchType.isMore
    }
  },
  {
    label: '与指定值相同',
    name: 'equals',
    group: ValidationGroup.Others,
    message: '输入的数据与 \\$1 不一致',
    tag: {
      [ValidatorTag.All]: ValidTagMatchType.isMore,
      [ValidatorTag.Password]: ValidTagMatchType.isDefault
    },
    schema: [
      {
        type: 'input-text',
        name: 'value',
        label: '值内容'
      }
    ]
  },
  {
    label: '与指定字段值相同',
    name: 'equalsField',
    group: ValidationGroup.Others,
    message: '输入的数据与 \\$1 值不一致',
    tag: {
      [ValidatorTag.All]: ValidTagMatchType.isMore,
      [ValidatorTag.Password]: ValidTagMatchType.isDefault
    },
    schema: [
      {
        type: 'input-text',
        name: 'value',
        label: '字段名'
      }
    ]
  },
  ...Array(5)
    .fill(null)
    .map((v, index): Validator => {
      const num = index === 0 ? '' : index;
      return {
        label: '自定义正则' + num,
        name: 'matchRegexp' + num,
        group: ValidationGroup.Regex,
        message: '格式不正确, 请输入符合规则为 \\$1 的内容。',
        tag: {
          [ValidatorTag.All]: ValidTagMatchType.isMore
        },
        schema: [
          {
            type: 'input-text',
            name: 'value',
            label: '表达式',
            placeholder: '请输入Js正则',
            prefix: '/',
            suffix: '/'
          }
        ]
      };
    })
);
