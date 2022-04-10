/**
 * @file 基于 amis 实现简单样式编辑
 */

// 此文件是基于 https://github.com/ChromeDevTools/devtools-frontend/blob/master/third_party/blink/renderer/core/css/css_properties.json5 编译出来的
const cssProperties = __inline('./css_properties.json');

const propertiesOptions = [];

const valueTypeControls = [];
let valueControls = [];

cssProperties.data.sort((a, b) => {
  return a.name.localeCompare(b.name);
});

for (const property of cssProperties.data) {
  if (property.svg || property.name.startsWith('-')) {
    // 忽略 svg 相关或古老的 -webkit 属性
    continue;
  }

  propertiesOptions.push(property.name);

  let valueTypeOptions = property.typedom_types || [];
  // 原来的定义中并没有这个类型
  if (property.type_name === 'StyleColor') {
    valueTypeOptions.push('Color');
    valueTypeOptions.push('ColorRGBA');
  }

  valueTypeOptions.sort();

  // 有些属性是中有 keyword 类型但没 keywords 列表，比如 scroll-margin-left，这时要去掉这个类型
  if (!property.keywords) {
    valueTypeOptions = valueTypeOptions.filter(function (item) {
      return item !== 'Keyword';
    });
  }

  if (valueTypeOptions.length > 0) {
    valueTypeControls.push({
      name: 'valueType',
      label: '值类型',
      visibleOn: `data.property === "${property.name}"`,
      type: 'select',
      value: valueTypeOptions[0],
      options: valueTypeOptions
    });
  }

  if (property.keywords) {
    const keywords = property.keywords;
    keywords.sort();
    valueControls.push({
      name: 'value',
      visibleOn: `data.property === "${property.name}" && data.valueType === "Keyword"`,
      label: '值',
      type: 'select',
      options: keywords
    });
  }
}

valueControls = valueControls.concat([
  {
    name: 'value',
    visibleOn: `data.valueType === "Color"`,
    label: '值',
    type: 'input-color'
  },
  {
    name: 'value',
    format: 'rgba',
    visibleOn: `data.valueType === "ColorRGBA"`,
    label: '值',
    type: 'input-color'
  },
  {
    name: 'value',
    visibleOn: `data.valueType === "Number"`,
    label: '值',
    type: 'input-number'
  },
  {
    type: 'input-group',
    label: '值',
    visibleOn: `data.valueType === "Length"`,
    body: [
      {
        name: 'value',
        label: '值',
        type: 'input-number'
      },
      {
        type: 'select',
        name: 'valueUnit',
        // https://www.w3.org/TR/css3-values/#lengths
        options: [
          'em',
          'ex',
          'ch',
          'rem',
          'vm',
          'vh',
          'vmin',
          'vmax',
          'cm',
          'mm',
          'Q',
          'in',
          'pt',
          'pc',
          'px'
        ],
        value: 'px'
      }
    ]
  },
  {
    name: 'value',
    visibleOn: `data.valueType === "Percentage"`,
    label: '值',
    type: 'input-text',
    addOn: {
      type: 'static',
      label: '%'
    }
  },
  {
    name: 'value',
    visibleOn: `data.valueType === "Angle"`,
    label: '值',
    type: 'input-group',
    body: [
      {
        name: 'value',
        label: '值',
        type: 'input-number'
      },
      {
        type: 'select',
        name: 'valueUnit',
        // https://www.w3.org/TR/css3-values/#angles
        options: ['deg', 'grad', 'rad', 'turn'],
        value: 'px'
      }
    ]
  },
  {
    name: 'value',
    visibleOn: `data.valueType === "Time"`,
    label: '值',
    type: 'input-group',
    body: [
      {
        name: 'value',
        label: '值',
        type: 'input-number'
      },
      {
        type: 'select',
        name: 'valueUnit',
        // https://www.w3.org/TR/css3-values/#time
        options: ['s', 'ms'],
        value: 's'
      }
    ]
  },
  {
    name: 'value',
    visibleOn: `data.valueType === "Frequency"`,
    label: '值',
    type: 'input-group',
    body: [
      {
        name: 'value',
        label: '值',
        type: 'input-number'
      },
      {
        type: 'select',
        name: 'valueUnit',
        // https://www.w3.org/TR/css3-values/#frequency
        options: ['Hz', 'kHz'],
        value: 'Hz'
      }
    ]
  },
  {
    name: 'value',
    visibleOn: `data.valueType === "Frequency"`,
    label: '值',
    type: 'input-group',
    body: [
      {
        name: 'value',
        label: '值',
        type: 'input-number'
      },
      {
        type: 'select',
        name: 'valueUnit',
        // https://www.w3.org/TR/css3-values/#resolution
        options: ['dpi', 'dpcm', 'dppx'],
        value: 'dpi'
      }
    ]
  },
  {
    name: 'value',
    visibleOn: `data.valueType === "Position"`,
    label: '值',

    type: 'input-tag',
    // https://www.w3.org/TR/css3-values/#position
    options: ['top', 'left', 'bottom', 'right', 'center']
  },
  // 这些类型支持起来好麻烦，先不弄
  {
    name: 'value',
    visibleOn: `!data.valueType || data.valueType === "Flex" || data.valueType === "Transform" || data.valueType === "Unparsed"|| data.valueType === "Image"`,
    label: '值',
    type: 'input-text'
  }
]);

export default {
  title: '样式编辑',
  data: {
    style: [
      {property: 'display', valueType: 'Keyword', value: 'inline'},
      {property: 'color', valueType: 'Color', value: '#5240a5'},
      {property: 'width', valueType: 'Percentage', value: '30'},
      {
        property: 'object-position',
        valueType: 'Position',
        value: ['left', '50%']
      }
    ]
  },
  body: [
    {
      type: 'form',
      api: '/api/mock2/saveForm',
      title: '',
      body: [
        {
          type: 'static',
          value:
            '演示基于 combo 及显隐联动来实现简易样式编辑，同时用来测试性能。'
        },
        {
          type: 'combo',
          name: 'style',
          label: '样式列表',
          multiple: true,
          items: [
            {
              name: 'property',
              label: '属性',
              type: 'select',
              searchable: true,
              unique: true,
              options: propertiesOptions
            },
            ...valueTypeControls,
            ...valueControls
          ]
        }
      ]
    }
  ]
};
