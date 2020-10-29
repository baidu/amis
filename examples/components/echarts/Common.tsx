/**
 * @file 生成一些通用的配置项
 */

/**
 * 支持三种类型，一种是关键字，比如 auto，一种是数字，另一种是百分比
 * @param name
 * @param label
 * @param labelForRadio 切换按钮的文字
 * @param keywordList 关键字列表
 */
export const keywordOrNumber = (
  name: string,
  label: string,
  labelForRadio: string,
  keywordList: string[]
) => {
  return [
    {
      type: 'button-group',
      name: name,
      label: labelForRadio,
      options: [
        {
          label: '关键字',
          value: keywordList[0]
        },
        {
          label: '数字',
          value: 2
        },
        {
          label: '百分比',
          value: 3
        }
      ],
      pipeIn: value => {
        if (typeof value === 'undefined') {
          return keywordList[0];
        }
        if (typeof value === 'string') {
          if (value.indexOf('%') !== -1) {
            return 3;
          } else {
            return keywordList[0];
          }
        } else if (typeof value === 'number') {
          return 2;
        } else {
          return keywordList[0];
        }
      },
      pipeOut: (value, oldValue) => {
        if (value === 1) {
          return keywordList[0];
        } else if (value === 2) {
          return 0;
        } else if (value === 3) {
          return '0%';
        } else {
          return keywordList[0];
        }
      }
    },
    {
      type: 'select',
      name: name,
      label: label,
      options: keywordList,
      value: keywordList[0],
      visibleOn: `(typeof data.${name} === "undefined") || ((typeof data.${name} === "string") && (data.${name}.indexOf("%") === -1))`
    },
    {
      type: 'number',
      name: name,
      label: label,
      visibleOn: `(typeof data.${name} === "number")`
    },
    {
      type: 'text',
      name: name,
      label: label,
      visibleOn: `(typeof data.${name} === "string") && (data.${name}.indexOf("%") !== -1)`
    }
  ];
};
