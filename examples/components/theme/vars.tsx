/**
 * 基础变量配置项，生成对应的 combo 配置项
 */

const colors = [
  {
    label: '文字颜色',
    name: '--text-color',
    cxdValue: '#666',
    antdValue: 'rgba(0, 0, 0, 0.85)'
  },
  {
    label: '文字置灰时的颜色',
    name: '--text--muted-color',
    cxdValue: '#a6a6a6',
    antdValue: 'rgba(64, 64, 64, 0.85)'
  },
  {
    label: '标题文字颜色',
    name: '--text--loud-color',
    cxdValue: '#4d4d4d',
    antdValue: 'rgba(0, 0, 0, 0.85)'
  },
  {
    label: '按钮文字颜色',
    name: '--button-color',
    cxdValue: '#fff',
    antdValue: '#fff'
  },

  {label: '最浅色', name: '--light', cxdValue: '#eaf6fe', antdValue: '#d9d9d9'},
  {label: '最深色', name: '--dark', cxdValue: '#343a40', antdValue: '#343a40'},
  {
    label: '全局背景色',
    name: '--body-bg',
    cxdValue: '#eaf6fe',
    antdValue: '#d9d9d9'
  },
  {
    label: '常用背景色',
    name: '--background',
    cxdValue: '#fff',
    antdValue: '#fff'
  },
  {
    label: '主颜色',
    name: '--primary',
    cxdValue: '#108cee',
    antdValue: '#1890ff'
  },
  {
    label: '主颜色鼠标放上去的颜色',
    name: '--primary-onHover',
    cxdValue: '#0e77ca',
    antdValue: '#007df1'
  },
  {
    label: '主颜色激活时的颜色',
    name: '--primary-onActive',
    cxdValue: '#0d70be',
    antdValue: '#0076e4'
  },
  {
    label: '次颜色',
    name: '--secondary',
    cxdValue: '#6c757d',
    antdValue: '#6c757d'
  },
  {
    label: '次颜色鼠标放上去的颜色',
    name: '--secondary-onHover',
    cxdValue: '#5a6268',
    antdValue: '#5a6268'
  },
  {
    label: '次颜色激活时的颜色',
    name: '--secondary-onActive',
    cxdValue: '#545b62',
    antdValue: '#545b62'
  },
  {
    label: '成功时的颜色',
    name: '--success',
    cxdValue: '#5fb333',
    antdValue: '#52c41a'
  },
  {
    label: '成功时在鼠标移上去后的颜色',
    name: '--success-onHover',
    cxdValue: '#4f952b',
    antdValue: '#44a216'
  },
  {
    label: '成功时激活的颜色',
    name: '--success-onActive',
    cxdValue: '#4a8b28',
    antdValue: '#3f9714'
  },
  {
    label: '信息的颜色',
    name: '--info',
    cxdValue: '#108cee',
    antdValue: '#1890ff'
  },
  {
    label: '信息在鼠标移上去后的颜色',
    name: '--info-onHover',
    cxdValue: '#0e77ca',
    antdValue: '#007df1'
  },
  {
    label: '信息在激活时的颜色',
    name: '--info-onActive',
    cxdValue: '#0d70be',
    antdValue: '#0076e4'
  },
  {
    label: '警告的颜色',
    name: '--warning',
    cxdValue: '#f39000',
    antdValue: '#faad14'
  },
  {
    label: '警告在鼠标移上去后的颜色',
    name: '--warning-onHover',
    cxdValue: '#cd7900',
    antdValue: '#e39905'
  },
  {
    label: '警告在鼠标移上去后的颜色',
    name: '--warning-onActive',
    cxdValue: '#c07200',
    antdValue: '#d69005'
  },
  {
    label: '错误的颜色',
    name: '--danger',
    cxdValue: '#ea2e2e',
    antdValue: '#ff4d4f'
  },
  {
    label: '错误在鼠标移上去后的颜色',
    name: '--danger-onHover',
    cxdValue: '#dc1616',
    antdValue: '#ff2729'
  },
  {
    label: '错误在激活时的颜色',
    name: '--danger-onActive',
    cxdValue: '#d01515',
    antdValue: '#ff1a1d'
  }
];

export const colorControls: any = [];

for (const color of colors) {
  colorControls.push({
    type: 'group',
    controls: [
      {
        type: 'input-color',
        label: color.label,
        name: `config.theme._vars["${color.name}"]`
      },
      {
        label: '云舍默认值',
        type: 'static-color',
        value: color.cxdValue,
        visibleOn: 'data.config.theme.baseTheme === "cxd"',
        inputClassName: 'text-xs'
      },
      {
        label: 'AntD 默认值',
        type: 'static-color',
        value: color.antdValue,
        visibleOn: 'data.config.theme.baseTheme === "antd"',
        inputClassName: 'text-xs'
      }
    ]
  });
}

const fonts = [
  {
    label: '基础字体',
    name: '--fontFamilyBase',
    defaultValue:
      "-apple-system, BlinkMacSystemFont, 'SF Pro SC', 'SF Pro Text', 'Helvetica Neue', Helvetica, 'PingFang SC', 'Segoe UI', Roboto, 'Hiragino Sans GB', 'Arial', 'microsoft yahei ui', 'Microsoft YaHei',SimSun, sans-serif"
  },
  {
    label: '等宽字体',
    name: '--fontFamilyMonospace',
    defaultValue:
      "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
  },
  {
    label: '基础字体大小',
    name: '--fontSizeBase',
    defaultValue: '14px'
  },
  {
    label: '最小字体大小',
    name: '--fontSizeXs',
    defaultValue: '11px'
  },
  {
    label: '小字体大小',
    name: '--fontSizeSm',
    defaultValue: '12px'
  },
  {
    label: '中型字体大小',
    name: '--fontSizeMd',
    defaultValue: '14px'
  },
  {
    label: '大字体大小',
    name: '--fontSizeLg',
    defaultValue: '16px'
  },
  {
    label: '超大字体大小',
    name: '--fontSizeXl',
    defaultValue: '20px'
  },
  {
    label: '行高',
    name: '--lineHeightBase',
    defaultValue: '1.5'
  }
];

export const fontControls: any = [];

for (const font of fonts) {
  fontControls.push({
    type: 'input-text',
    label: font.label,
    name: `config.theme._vars["${font.name}"]`,
    placeholder: font.defaultValue
  });
}

const sizes = [
  {
    label: '基础间距',
    name: '--gap-base',
    defaultValue: '12px'
  },
  {
    label: '最小间距',
    name: '--gap-xs',
    defaultValue: '4px'
  },
  {
    label: '小间距',
    name: '--gap-sm',
    defaultValue: '8px'
  },
  {
    label: '中间距',
    name: '--gap-md',
    defaultValue: '16px'
  },
  {
    label: '小间距',
    name: '--gap-lg',
    defaultValue: '20px'
  },
  {
    label: '小间距',
    name: '--gap-xl',
    defaultValue: '24px'
  }
];

export const sizeControls: any = [];

for (const size of sizes) {
  sizeControls.push({
    type: 'input-text',
    label: size.label,
    name: `config.theme._vars["${size.name}"]`,
    placeholder: size.defaultValue
  });
}

export const borderControls: any = [
  {
    type: 'input-color',
    label: '边框颜色',
    name: 'config.theme._vars["--buttonColor"]'
  },
  {
    type: 'input-text',
    label: '边框圆角大小',
    placeholder: '2px',
    name: 'config.theme._vars["--borderRadius"]'
  }
];

export const linkControls: any = [
  {
    type: 'input-color',
    label: '链接颜色',
    name: 'config.theme._vars["--link-color"]'
  },
  {
    type: 'input-color',
    label: '链接在鼠标移上去的颜色',
    name: 'config.theme._vars["--link-onHover-color"]'
  },
  {
    type: 'input-text',
    label: '链接下划线',
    placeholder: 'none',
    name: 'config.theme._vars["--link-decoration"]'
  },
  {
    type: 'input-text',
    label: '链接在鼠标移上去后端下划线',
    placeholder: 'none',
    name: 'config.theme._vars["--link-onHover-decoration"]'
  }
];
