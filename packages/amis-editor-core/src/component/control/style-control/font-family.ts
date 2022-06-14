/**
 * @file font.ts
 * @description 字体选项与字体名称的对应列表
 * @link http://icode.baidu.com/repos/baidu/legend/frontend/tree/master:frontend/client/widgets/attributeEditor/stringAttributeEditor/fontFamilyAttributeEditor
 */

export const fontFamilyList = [
  {
    label: '默认字体',
    value: ''
  },
  {
    label: 'Times New Roman',
    value: 'Times New Roman'
  }
  /** 下面的字体不知道是否能够免费商用，先隐藏了 */
  // {
  //   label: '方正黑体简体',
  //   value: 'FZHei-B01S'
  // },
  // {
  //   label: '方正楷体简体',
  //   value: 'FZKai-Z03S'
  // },
  // {
  //   label: '方正书宋简体',
  //   value: 'FZShuSong-Z01S'
  // },
  // {
  //   label: '方正仿宋简体',
  //   value: 'FZFangSong-Z02S'
  // },
  // {
  //   label: '思源极细体',
  //   value: 'NotoSansSC-Thin'
  // },
  // {
  //   label: '思源细体',
  //   value: 'NotoSansSC-Light'
  // },
  // {
  //   label: '思源正常',
  //   value: 'NotoSansSC-DemiLight'
  // },
  // {
  //   label: '思源常规',
  //   value: 'NotoSansSC-Regular'
  // },
  // {
  //   label: '思源中等粗体',
  //   value: 'NotoSansSC-Medium'
  // },
  // {
  //   label: '思源粗体',
  //   value: 'NotoSansSC-Bold'
  // },
  // {
  //   label: '思源特粗',
  //   value: 'NotoSansSC-Black'
  // },
  // {
  //   label: '站酷高端黑',
  //   value: 'zcool-gdh'
  // },
  // {
  //   label: '站酷快乐体',
  //   value: 'HappyZcool'
  // }
  // {
  //   label: 'Arial',
  //   value: 'Arial'
  // },
  // {
  //     label: 'Avant Garde',
  //     value: 'Avant Garde'
  // },
  // {
  //     label: 'Bodoni MT',
  //     value: 'Bodoni MT'
  // },
  // {
  //     label: 'Brush Script MT',
  //     value: 'Brush Script MT'
  // },
  // {
  //   label: 'Consolas',
  //   value: 'Consolas'
  // },
  // {
  //     label: 'Courier New',
  //     value: 'Courier New'
  // },
  // {
  //   label: 'Didot',
  //   value: 'Didot'
  // },
  // {
  //   label: 'Georgia',
  //   value: 'Georgia'
  // },
  // {
  //   label: 'Garamond',
  //   value: 'Garamond'
  // },
  // {
  //   label: 'Helvetica',
  //   value: 'Helvetica'
  // },
  // {
  //   label: 'Palatino',
  //   value: 'Palatino'
  // },
  // {
  //   label: 'Rockwell',
  //   value: 'Rockwell'
  // },
  // {
  //   label: 'Tahoma',
  //   value: 'Tahoma'
  // },
  // {
  //   label: 'Times',
  //   value: 'Times'
  // },
  // {
  //   label: 'Verdana',
  //   value: 'Verdana'
  // }
];

export const fontFamilyMap = fontFamilyList.reduce((memo, current) => {
  return {
    ...memo,
    [current.label]: current.value
  };
}, {});

export const fontFamilyMirror = fontFamilyList.reduce((memo, current) => {
  return {
    ...memo,
    [current.value]: current.label
  };
}, {});
