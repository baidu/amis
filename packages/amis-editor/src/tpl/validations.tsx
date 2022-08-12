import {
  setSchemaTpl,
  isObject,
  defaultValue,
  getSchemaTpl
} from 'amis-editor-core';
import {ValidationOptions} from '../component/BaseControl';
import {str2rules} from 'amis';
import {ValidatorTag} from '../validator';

import find from 'lodash/find';
import reduce from 'lodash/reduce';
import forEach from 'lodash/forEach';

setSchemaTpl('validations', function () {
  const options = [
    // {
    //     label: '必填',
    //     value: 'isRequired'
    // },
    {
      label: '邮箱格式',
      value: 'isEmail'
    },
    {
      label: 'Url格式',
      value: 'isUrl'
    },
    {
      label: '数字',
      value: 'isNumeric'
    },
    {
      label: '字母',
      value: 'isAlpha'
    },
    {
      label: '字母和数字',
      value: 'isAlphanumeric'
    },
    {
      label: '整型数字',
      value: 'isInt'
    },
    {
      label: '浮点型数字',
      value: 'isFloat'
    },
    {
      label: '固定长度',
      value: 'isLength'
    },
    {
      label: '最大长度',
      value: 'maxLength'
    },
    {
      label: '最小长度',
      value: 'minLength'
    },
    {
      label: '最大值',
      value: 'maximum'
    },
    {
      label: '最小值',
      value: 'minimum'
    },
    {
      label: '手机号码',
      value: 'isPhoneNumber'
    },
    {
      label: '电话号码',
      value: 'isTelNumber'
    },
    {
      label: '邮编号码',
      value: 'isZipcode'
    },
    {
      label: '身份证号码',
      value: 'isId'
    },
    {
      label: 'JSON格式',
      value: 'isJson'
    },
    {
      label: '与指定值相同',
      value: 'equals'
    },
    {
      label: '与指定字段值相同',
      value: 'equalsField'
    },
    {
      label: '自定义正则',
      value: 'matchRegexp'
    },
    {
      label: '自定义正则2',
      value: 'matchRegexp1'
    },
    {
      label: '自定义正则3',
      value: 'matchRegexp2'
    },
    {
      label: '自定义正则4',
      value: 'matchRegexp3'
    },
    {
      label: '自定义正则5',
      value: 'matchRegexp4'
    }
  ];

  const trueProps = [
    'isEmail',
    'isUrl',
    'isNumeric',
    'isAlpha',
    'isAlphanumeric',
    'isInt',
    'isFloat',
    'isJson',
    'isPhoneNumber',
    'isTelNumber',
    'isZipcode',
    'isId'
  ];

  function firstValue(arr: Array<any>, iterator: (item: any) => any) {
    let theone = find(arr, iterator);
    return theone ? theone.value : '';
  }

  return {
    type: 'combo',
    syncDefaultValue: false,
    name: 'validations',
    label: '验证规则',
    addButtonText: '新增规则',
    multiple: true,
    pipeIn: (value: any) => {
      if (typeof value === 'string' && value) {
        value = str2rules(value);
      }
      if (!isObject(value)) {
        return value;
      }

      let arr: Array<any> = [];

      Object.keys(value).forEach(key => {
        if (/^\$\$/.test(key)) {
          return;
        }

        arr.push({
          type: key,
          [key]: Array.isArray(value[key]) ? value[key][0] : value[key]
        });
      });

      return arr;
    },
    pipeOut: (value: any) => {
      if (!Array.isArray(value)) {
        return value;
      }
      let obj: any = {};

      value.forEach((item: any) => {
        let key: string =
          item.type ||
          firstValue(options, (item: any) => !obj[item.value]) ||
          options[0].value;
        obj[key] = item[key] || (~trueProps.indexOf(key) ? true : '');
      });

      return obj;
    },
    items: [
      {
        type: 'select',
        unique: true,
        name: 'type',
        options: options,
        columnClassName: 'w-sm'
      },
      {
        type: 'input-number',
        name: 'isLength',
        visibleOn: 'data.type == "isLength"',
        placeholder: '设置长度',
        value: '1'
      },
      {
        type: 'input-number',
        name: 'maximum',
        visibleOn: 'data.type == "maximum"',
        placeholder: '设置最大值'
      },
      {
        type: 'input-number',
        name: 'minimum',
        visibleOn: 'data.type == "minimum"',
        placeholder: '设置最小值'
      },
      {
        type: 'input-number',
        name: 'maxLength',
        visibleOn: 'data.type == "maxLength"',
        placeholder: '设置最大长度值'
      },
      {
        type: 'input-number',
        name: 'minLength',
        visibleOn: 'data.type == "minLength"',
        placeholder: '设置最小长度值'
      },
      {
        type: 'input-text',
        name: 'equals',
        visibleOn: 'data.type == "equals"',
        placeholder: '设置值',
        value: ''
      },
      {
        type: 'input-text',
        name: 'equalsField',
        visibleOn: 'data.type == "equalsField"',
        placeholder: '设置字段名',
        value: ''
      },
      {
        type: 'input-text',
        name: 'matchRegexp',
        visibleOn: 'data.type == "matchRegexp"',
        placeholder: '设置正则规则'
      },
      {
        type: 'input-text',
        name: 'matchRegexp1',
        visibleOn: 'data.type == "matchRegexp1"',
        placeholder: '设置正则规则'
      },
      {
        type: 'input-text',
        name: 'matchRegexp2',
        visibleOn: 'data.type == "matchRegexp2"',
        placeholder: '设置正则规则'
      },
      {
        type: 'input-text',
        name: 'matchRegexp3',
        visibleOn: 'data.type == "matchRegexp3"',
        placeholder: '设置正则规则'
      },
      {
        type: 'input-text',
        name: 'matchRegexp4',
        visibleOn: 'data.type == "matchRegexp4"',
        placeholder: '设置正则规则'
      }
    ]
  };
});

setSchemaTpl('validationErrors', function () {
  const options = [
    // {
    //     label: '必填',
    //     value: 'isRequired'
    // },
    {
      label: '邮箱格式',
      value: 'isEmail'
    },
    {
      label: 'Url格式',
      value: 'isUrl'
    },
    {
      label: '数字',
      value: 'isNumeric'
    },
    {
      label: '字母',
      value: 'isAlpha'
    },
    {
      label: '字母和数字',
      value: 'isAlphanumeric'
    },
    {
      label: '整型数字',
      value: 'isInt'
    },
    {
      label: '浮点型数字',
      value: 'isFloat'
    },
    {
      label: '固定长度',
      value: 'isLength'
    },
    {
      label: '最大长度',
      value: 'maxLength'
    },
    {
      label: '最小长度',
      value: 'minLength'
    },
    {
      label: '最大值',
      value: 'maximum'
    },
    {
      label: '最小值',
      value: 'minimum'
    },
    {
      label: 'JSON格式',
      value: 'isJson'
    },
    {
      label: '手机号码',
      value: 'isPhoneNumber'
    },
    {
      label: '电话号码',
      value: 'isTelNumber'
    },
    {
      label: '邮编号码',
      value: 'isZipcode'
    },
    {
      label: '身份证号码',
      value: 'isId'
    },
    {
      label: '与指定值相同',
      value: 'equals'
    },
    {
      label: '与指定字段值相同',
      value: 'equalsField'
    },
    {
      label: '自定义正则',
      value: 'matchRegexp'
    },
    {
      label: '自定义正则2',
      value: 'matchRegexp1'
    },
    {
      label: '自定义正则3',
      value: 'matchRegexp2'
    },
    {
      label: '自定义正则4',
      value: 'matchRegexp3'
    },
    {
      label: '自定义正则5',
      value: 'matchRegexp4'
    }
  ];

  const defaultMessages = {
    isEmail: 'Email 格式不正确',
    isRequired: '这是必填项',
    isUrl: 'Url 格式不正确',
    isInt: '请输入整形数字',
    isAlpha: '请输入字母',
    isNumeric: '请输入数字',
    isAlphanumeric: '请输入字母或者数字',
    isFloat: '请输入浮点型数值',
    isWords: '请输入字母',
    isUrlPath: '只能输入字母、数字、`-` 和 `_`.',
    matchRegexp: '格式不正确, 请输入符合规则为 `$1` 的内容。',
    minLength: '请输入更多的内容，至少输入 $1 个字符。',
    maxLength: '请控制内容长度, 请不要输入 $1 个字符以上',
    maximum: '当前输入值超出最大值 $1，请检查',
    minimum: '当前输入值低于最小值 $1，请检查',
    isJson: '请检查 Json 格式。',
    isPhoneNumber: '请输入合法的手机号码',
    isTelNumber: '请输入合法的电话号码',
    isZipcode: '请输入合法的邮编地址',
    isId: '请输入合法的身份证号',
    isLength: '请输入长度为 $1 的内容',
    notEmptyString: '请不要全输入空白字符',
    equalsField: '输入的数据与 $1 值不一致',
    equals: '输入的数据与 $1 不一致'
  };

  function firstValue(arr: Array<any>, iterator: (item: any) => any) {
    let theone = find(arr, iterator);
    return theone ? theone.value : '';
  }

  return {
    type: 'combo',
    syncDefaultValue: false,
    name: 'validationErrors',
    label: '自定义验证提示',
    description: '自带提示不满足时，可以自定义。',
    addButtonText: '新增提示',
    multiple: true,
    pipeIn: (value: any) => {
      if (!isObject(value)) {
        return value;
      }

      let arr: Array<any> = [];

      Object.keys(value).forEach(key => {
        if (/^\$\$/.test(key)) {
          return;
        }

        arr.push({
          type: key,
          msg: value[key]
        });
      });

      return arr;
    },
    pipeOut: (value: any) => {
      if (!Array.isArray(value)) {
        return value;
      }
      let obj: any = {};

      value.forEach((item: any) => {
        let key: string =
          item.type ||
          firstValue(options, (item: any) => !obj[item.value]) ||
          options[0].value;
        obj[key] = item.msg || (defaultMessages as any)[key] || '';
      });

      return obj;
    },
    items: [
      {
        type: 'select',
        unique: true,
        name: 'type',
        options: options,
        columnClassName: 'w-sm'
      },

      {
        type: 'input-text',
        name: 'msg',
        placeholder: '提示信息'
      },

      {
        type: 'formula',
        name: 'msg',
        initSet: false,
        formula: `({
          isEmail: 'Email 格式不正确',
          isRequired: '这是必填项',
          isUrl: 'Url 格式不正确',
          isInt: '请输入整形数字',
          isAlpha: '请输入字母',
          isNumeric: '请输入数字',
          isAlphanumeric: '请输入字母或者数字',
          isFloat: '请输入浮点型数值',
          isWords: '请输入字母',
          isUrlPath: '只能输入字母、数字、\`-\` 和 \`_\`.',
          matchRegexp: '格式不正确, 请输入符合规则为 \`$1\` 的内容。',
          minLength: '请输入更多的内容，至少输入 $1 个字符。',
          maxLength: '请控制内容长度, 请不要输入 $1 个字符以上',
          maximum: '当前输入值超出最大值 $1，请检查',
          minimum: '当前输入值低于最小值 $1，请检查',
          isJson: '请检查 Json 格式。',
          isLength: '请输入长度为 $1 的内容',
          notEmptyString: '请不要全输入空白字符',
          equalsField: '输入的数据与 $1 值不一致',
          equals: '输入的数据与 $1 不一致',
          isPhoneNumber: '请输入合法的手机号码',
          isTelNumber: '请输入合法的电话号码',
          isZipcode: '请输入合法的邮编地址',
          isId: '请输入合法的身份证号',
      })[data.type] || ''`
      }
    ]
  };
});

setSchemaTpl('submitOnChange', {
  type: 'switch',
  label: '修改即提交',
  name: 'submitOnChange',
  mode: 'horizontal',
  horizontal: {
    justify: true,
    left: 8
  },
  inputClassName: 'is-inline ',
  labelRemark: {
    trigger: 'click',
    className: 'm-l-xs',
    rootClose: true,
    content: '设置后，表单中每次有修改都会触发提交',
    placement: 'left'
  }
});

setSchemaTpl('validateOnChange', {
  type: 'select',
  name: 'validateOnChange',
  label: '校验触发',
  options: [
    {
      label: '提交后每次修改即触发',
      value: ''
    },

    {
      label: '修改即触发',
      value: true
    },

    {
      label: '提交触发',
      value: false
    }
  ],
  pipeIn: defaultValue(''),
  pipeOut: (value: any) => (value === '' ? undefined : !!value)
});

setSchemaTpl(
  'validation',
  (config: {tag: ValidatorTag | ((ctx: any) => ValidatorTag)}) => {
    let a = {
      title: '校验',
      body: [
        {
          type: 'ae-validationControl',
          mode: 'normal',
          ...config
          // pipeIn: (value: any, data: any) => {
          //   // return reduce(value, (arr: any, item) => {
          //   //   if (typeof item === 'string') {
          //   //     arr.push(item);
          //   //   }
          //   //   else {
          //   //     let isAdd = false;
          //   //     // 优先判断是否具备可展示条件
          //   //     forEach(item?.isShow, (val, key) => {
          //   //       if ([...val].includes(data?.data[key])) {
          //   //         isAdd = true;
          //   //         return false;
          //   //       }
          //   //     })
          //   //     !isAdd  && forEach(item?.isHidden, (val, key) => {
          //   //       const hasExist = [...val].includes(data?.data[key]);
          //   //         isAdd = hasExist ? false : true;
          //   //         if (hasExist) {
          //   //           return false;
          //   //         }
          //   //     })
          //   //     isAdd && arr.push(item.option);
          //   //   }
          //   //   return arr;
          //   // }, []);
          // },
        },
        getSchemaTpl('validateOnChange')
      ]
    };
    return a;
  }
);

setSchemaTpl('validationControl', (value: Array<ValidationOptions> = []) => ({
  type: 'ae-validationControl',
  label: '校验规则',
  mode: 'normal',
  pipeIn: (value: any, data: any) => {
    return reduce(
      value,
      (arr: any, item) => {
        if (typeof item === 'string') {
          arr.push(item);
        } else {
          let isAdd = false;
          // 优先判断是否具备可展示条件
          forEach(item?.isShow, (val, key) => {
            if ([...val].includes(data?.data[key])) {
              isAdd = true;
              return false;
            }
            return true;
          });
          !isAdd &&
            forEach(item?.isHidden, (val, key) => {
              const hasExist = [...val].includes(data?.data[key]);
              isAdd = hasExist ? false : true;
              if (hasExist) {
                return false;
              }
              return true;
            });
          isAdd && arr.push(item.option);
        }
        return arr;
      },
      []
    );
  },
  value
}));
