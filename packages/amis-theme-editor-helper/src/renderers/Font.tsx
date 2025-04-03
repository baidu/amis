/**
 * @file Font.tsx
 * @description 设置文字
 */

import React, {useEffect} from 'react';
import {FormItem} from 'amis-core';
import type {FormControlProps} from 'amis-core';
import {Icon as ThemeIcon} from '../icons/index';
import cx from 'classnames';
import {TooltipWrapper} from 'amis-ui';
import ColorPicker from './ColorPicker';
import cloneDeep from 'lodash/cloneDeep';
import assign from 'lodash/assign';
import {ThemeWrapperHeader} from './ThemeWrapper';
import ThemeSelect from './ThemeSelect';
import {getDefaultValue} from '../util';

interface FontEditorProps extends FormControlProps {}

interface FontDataProps {
  'font-family'?: string;
  'fontSize'?: string;
  'fontWeight'?: string;
  'lineHeight'?: string;
  'color'?: string;
  'font-style'?: string;
  'text-decoration'?: string;
  'text-align'?: string;
  'vertical-align'?: string;
}

interface OptionProps {
  label: string;
  type: keyof FontDataProps;
  value: string;
}

const defaultFontSize = [
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '22px',
  '24px',
  '26px',
  '28px',
  '30px',
  '32px',
  '34px',
  '36px',
  '38px',
  '40px'
].map(n => ({value: n, label: n, realValue: n}));

const defaultFontWeight = [
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900'
].map(n => ({value: n, label: n, realValue: n}));

const defaultlineHeight = [
  {
    label: '1.3倍',
    value: '1.3',
    realValue: '1.3'
  },
  {
    label: '1.5倍',
    value: '1.5',
    realValue: '1.5'
  },
  {
    label: '1.7倍',
    value: '1.7',
    realValue: '1.7'
  }
];

const SYSTEM_FONT_FAMILY = [
  {
    label: 'Academy Engraved LET',
    value: 'Academy Engraved LET'
  },
  {
    label: 'Al Bayan',
    value: 'Al Bayan'
  },
  {
    label: 'Al Nile',
    value: 'Al Nile'
  },
  {
    label: 'Al Tarikh',
    value: 'Al Tarikh'
  },
  {
    label: 'American Typewriter',
    value: 'American Typewriter'
  },
  {
    label: 'Andale Mono',
    value: 'Andale Mono'
  },
  {
    label: 'Apple Braille',
    value: 'Apple Braille'
  },
  {
    label: 'Apple Chancery',
    value: 'Apple Chancery'
  },
  {
    label: 'Apple Color Emoji',
    value: 'Apple Color Emoji'
  },
  {
    label: 'Apple SD Gothic Neo',
    value: 'Apple SD Gothic Neo'
  },
  {
    label: 'Apple Symbols',
    value: 'Apple Symbols'
  },
  {
    label: 'AppleGothic',
    value: 'AppleGothic'
  },
  {
    label: 'AppleMyungjo',
    value: 'AppleMyungjo'
  },
  {
    label: 'Arial',
    value: 'Arial'
  },
  {
    label: 'Arial Black',
    value: 'Arial Black'
  },
  {
    label: 'Arial Hebrew',
    value: 'Arial Hebrew'
  },
  {
    label: 'Arial Hebrew Scholar',
    value: 'Arial Hebrew Scholar'
  },
  {
    label: 'Arial Narrow',
    value: 'Arial Narrow'
  },
  {
    label: 'Arial Rounded MT Bold',
    value: 'Arial Rounded MT Bold'
  },
  {
    label: 'Arial Unicode MS',
    value: 'Arial Unicode MS'
  },
  {
    label: 'Avenir',
    value: 'Avenir'
  },
  {
    label: 'Avenir Next',
    value: 'Avenir Next'
  },
  {
    label: 'Avenir Next Condensed',
    value: 'Avenir Next Condensed'
  },
  {
    label: 'Ayuthaya',
    value: 'Ayuthaya'
  },
  {
    label: 'Baghdad',
    value: 'Baghdad'
  },
  {
    label: 'Bangla MN',
    value: 'Bangla MN'
  },
  {
    label: 'Bangla Sangam MN',
    value: 'Bangla Sangam MN'
  },
  {
    label: 'Baskerville',
    value: 'Baskerville'
  },
  {
    label: 'Beirut',
    value: 'Beirut'
  },
  {
    label: 'Big Caslon',
    value: 'Big Caslon'
  },
  {
    label: 'Bodoni 72',
    value: 'Bodoni 72'
  },
  {
    label: 'Bodoni 72 Oldstyle',
    value: 'Bodoni 72 Oldstyle'
  },
  {
    label: 'Bodoni 72 Smallcaps',
    value: 'Bodoni 72 Smallcaps'
  },
  {
    label: 'Bodoni Ornaments',
    value: 'Bodoni Ornaments'
  },
  {
    label: 'Bradley Hand',
    value: 'Bradley Hand'
  },
  {
    label: 'Brush Script MT',
    value: 'Brush Script MT'
  },
  {
    label: 'Chalkboard',
    value: 'Chalkboard'
  },
  {
    label: 'Chalkboard SE',
    value: 'Chalkboard SE'
  },
  {
    label: 'Chalkduster',
    value: 'Chalkduster'
  },
  {
    label: 'Charter',
    value: 'Charter'
  },
  {
    label: 'Cochin',
    value: 'Cochin'
  },
  {
    label: 'Comic Sans MS',
    value: 'Comic Sans MS'
  },
  {
    label: 'Copperplate',
    value: 'Copperplate'
  },
  {
    label: 'Corsiva Hebrew',
    value: 'Corsiva Hebrew'
  },
  {
    label: 'Courier New',
    value: 'Courier New'
  },
  {
    label: 'Damascus',
    value: 'Damascus'
  },
  {
    label: 'DecoType Naskh',
    value: 'DecoType Naskh'
  },
  {
    label: 'Devanagari MT',
    value: 'Devanagari MT'
  },
  {
    label: 'Devanagari Sangam MN',
    value: 'Devanagari Sangam MN'
  },
  {
    label: 'Didot',
    value: 'Didot'
  },
  {
    label: 'DIN Alternate',
    value: 'DIN Alternate'
  },
  {
    label: 'DIN Condensed',
    value: 'DIN Condensed'
  },
  {
    label: 'Diwan Kufi',
    value: 'Diwan Kufi'
  },
  {
    label: 'Diwan Thuluth',
    value: 'Diwan Thuluth'
  },
  {
    label: 'Euphemia UCAS',
    value: 'Euphemia UCAS'
  },
  {
    label: 'Farah',
    value: 'Farah'
  },
  {
    label: 'Farisi',
    value: 'Farisi'
  },
  {
    label: 'Futura',
    value: 'Futura'
  },
  {
    label: 'Galvji',
    value: 'Galvji'
  },
  {
    label: 'GB18030 Bitmap',
    value: 'GB18030 Bitmap'
  },
  {
    label: 'Geeza Pro',
    value: 'Geeza Pro'
  },
  {
    label: 'Geneva',
    value: 'Geneva'
  },
  {
    label: 'Georgia',
    value: 'Georgia'
  },
  {
    label: 'Gill Sans',
    value: 'Gill Sans'
  },
  {
    label: 'Grantha Sangam MN',
    value: 'Grantha Sangam MN'
  },
  {
    label: 'Gujarati MT',
    value: 'Gujarati MT'
  },
  {
    label: 'Gujarati Sangam MN',
    value: 'Gujarati Sangam MN'
  },
  {
    label: 'Gurmukhi MN',
    value: 'Gurmukhi MN'
  },
  {
    label: 'Gurmukhi MT',
    value: 'Gurmukhi MT'
  },
  {
    label: 'Gurmukhi Sangam MN',
    value: 'Gurmukhi Sangam MN'
  },
  {
    label: '黑体-简',
    value: '黑体-简'
  },
  {
    label: '黑体-繁',
    value: '黑体-繁'
  },
  {
    label: 'Helvetica',
    value: 'Helvetica'
  },
  {
    label: 'Helvetica Neue',
    value: 'Helvetica Neue'
  },
  {
    label: 'Herculanum',
    value: 'Herculanum'
  },
  {
    label: 'Hiragino Maru Gothic ProN',
    value: 'Hiragino Maru Gothic ProN'
  },
  {
    label: 'Hiragino Mincho ProN',
    value: 'Hiragino Mincho ProN'
  },
  {
    label: 'Hiragino Sans',
    value: 'Hiragino Sans'
  },
  {
    label: '冬青黑体简体中文',
    value: '冬青黑体简体中文'
  },
  {
    label: 'Hoefler Text',
    value: 'Hoefler Text'
  },
  {
    label: 'Impact',
    value: 'Impact'
  },
  {
    label: 'InaiMathi',
    value: 'InaiMathi'
  },
  {
    label: 'ITF Devanagari',
    value: 'ITF Devanagari'
  },
  {
    label: 'ITF Devanagari Marathi',
    value: 'ITF Devanagari Marathi'
  },
  {
    label: 'Kailasa',
    value: 'Kailasa'
  },
  {
    label: 'Kannada MN',
    value: 'Kannada MN'
  },
  {
    label: 'Kannada Sangam MN',
    value: 'Kannada Sangam MN'
  },
  {
    label: 'Kefa',
    value: 'Kefa'
  },
  {
    label: 'Khmer MN',
    value: 'Khmer MN'
  },
  {
    label: 'Khmer Sangam MN',
    value: 'Khmer Sangam MN'
  },
  {
    label: 'Kohinoor Bangla',
    value: 'Kohinoor Bangla'
  },
  {
    label: 'Kohinoor Devanagari',
    value: 'Kohinoor Devanagari'
  },
  {
    label: 'Kohinoor Gujarati',
    value: 'Kohinoor Gujarati'
  },
  {
    label: 'Kohinoor Telugu',
    value: 'Kohinoor Telugu'
  },
  {
    label: 'Kokonor',
    value: 'Kokonor'
  },
  {
    label: 'Krungthep',
    value: 'Krungthep'
  },
  {
    label: 'KufiStandardGK',
    value: 'KufiStandardGK'
  },
  {
    label: 'Lao MN',
    value: 'Lao MN'
  },
  {
    label: 'Lao Sangam MN',
    value: 'Lao Sangam MN'
  },
  {
    label: 'Lucida Grande',
    value: 'Lucida Grande'
  },
  {
    label: 'Luminari',
    value: 'Luminari'
  },
  {
    label: 'Malayalam MN',
    value: 'Malayalam MN'
  },
  {
    label: 'Malayalam Sangam MN',
    value: 'Malayalam Sangam MN'
  },
  {
    label: 'Marker Felt',
    value: 'Marker Felt'
  },
  {
    label: 'Menlo',
    value: 'Menlo'
  },
  {
    label: 'Microsoft Sans Serif',
    value: 'Microsoft Sans Serif'
  },
  {
    label: 'Mishafi',
    value: 'Mishafi'
  },
  {
    label: 'Mishafi Gold',
    value: 'Mishafi Gold'
  },
  {
    label: 'Monaco',
    value: 'Monaco'
  },
  {
    label: 'Mshtakan',
    value: 'Mshtakan'
  },
  {
    label: 'Mukta Mahee',
    value: 'Mukta Mahee'
  },
  {
    label: 'Muna',
    value: 'Muna'
  },
  {
    label: 'Myanmar MN',
    value: 'Myanmar MN'
  },
  {
    label: 'Myanmar Sangam MN',
    value: 'Myanmar Sangam MN'
  },
  {
    label: 'Nadeem',
    value: 'Nadeem'
  },
  {
    label: 'New Peninim MT',
    value: 'New Peninim MT'
  },
  {
    label: 'Noteworthy',
    value: 'Noteworthy'
  },
  {
    label: 'Noto Nastaliq Urdu',
    value: 'Noto Nastaliq Urdu'
  },
  {
    label: 'Noto Sans Kannada',
    value: 'Noto Sans Kannada'
  },
  {
    label: 'Noto Sans Myanmar',
    value: 'Noto Sans Myanmar'
  },
  {
    label: 'Noto Sans Oriya',
    value: 'Noto Sans Oriya'
  },
  {
    label: 'Noto Serif Myanman',
    value: 'Noto Serif Myanman'
  },
  {
    label: 'Optima',
    value: 'Optima'
  },
  {
    label: 'Oriya MN',
    value: 'Oriya MN'
  },
  {
    label: 'Oriya Sangam MN',
    value: 'Oriya Sangam MN'
  },
  {
    label: 'Palatino',
    value: 'Palatino'
  },
  {
    label: 'Papyrus',
    value: 'Papyrus'
  },
  {
    label: 'Party LET',
    value: 'Party LET'
  },
  {
    label: 'Phosphate',
    value: 'Phosphate'
  },
  {
    label: '苹方-港',
    value: '苹方-港'
  },
  {
    label: '苹方-简',
    value: '苹方-简'
  },
  {
    label: '苹方-繁',
    value: '苹方-繁'
  },
  {
    label: 'Plantagenet Cherokee',
    value: 'Plantagenet Cherokee'
  },
  {
    label: 'PT Mono',
    value: 'PT Mono'
  },
  {
    label: 'PT Sans',
    value: 'PT Sans'
  },
  {
    label: 'PT Sans Caption',
    value: 'PT Sans Caption'
  },
  {
    label: 'PT Sans Narrow',
    value: 'PT Sans Narrow'
  },
  {
    label: 'PT Serif',
    value: 'PT Serif'
  },
  {
    label: 'PT Serif Caption',
    value: 'PT Serif Caption'
  },
  {
    label: 'Raanana',
    value: 'Raanana'
  },
  {
    label: 'Rockwell',
    value: 'Rockwell'
  },
  {
    label: 'Sana',
    value: 'Sana'
  },
  {
    label: 'Sathu',
    value: 'Sathu'
  },
  {
    label: 'Savoye LET',
    value: 'Savoye LET'
  },
  {
    label: 'Shree Devanagari 714',
    value: 'Shree Devanagari 714'
  },
  {
    label: 'SignPainter',
    value: 'SignPainter'
  },
  {
    label: 'Silom',
    value: 'Silom'
  },
  {
    label: 'Sinhala MN',
    value: 'Sinhala MN'
  },
  {
    label: 'Sinhala Sangam MN',
    value: 'Sinhala Sangam MN'
  },
  {
    label: 'Skia',
    value: 'Skia'
  },
  {
    label: 'Snell Roundhand',
    value: 'Snell Roundhand'
  },
  {
    label: '宋体-简',
    value: '宋体-简'
  },
  {
    label: '宋体-繁',
    value: '宋体-繁'
  },
  {
    label: '华文黑体',
    value: '华文黑体'
  },
  {
    label: 'STIXGeneral',
    value: 'STIXGeneral'
  },
  {
    label: 'STIXIntegralsD',
    value: 'STIXIntegralsD'
  },
  {
    label: 'STIXIntegralsSm',
    value: 'STIXIntegralsSm'
  },
  {
    label: 'STIXIntegralsUp',
    value: 'STIXIntegralsUp'
  },
  {
    label: 'STIXIntegralsUpD',
    value: 'STIXIntegralsUpD'
  },
  {
    label: 'STIXIntegralsUpSm',
    value: 'STIXIntegralsUpSm'
  },
  {
    label: 'STIXNonUnicode',
    value: 'STIXNonUnicode'
  },
  {
    label: 'STIXSizeFiveSym',
    value: 'STIXSizeFiveSym'
  },
  {
    label: 'STIXSizeFourSym',
    value: 'STIXSizeFourSym'
  },
  {
    label: 'STIXSizeOneSym',
    value: 'STIXSizeOneSym'
  },
  {
    label: 'STIXSizeThreeSym',
    value: 'STIXSizeThreeSym'
  },
  {
    label: 'STIXSizeTwoSym',
    value: 'STIXSizeTwoSym'
  },
  {
    label: 'STIXVariants',
    value: 'STIXVariants'
  },
  {
    label: '华文宋体',
    value: '华文宋体'
  },
  {
    label: 'Sukhumvit Set',
    value: 'Sukhumvit Set'
  },
  {
    label: 'Symbol',
    value: 'Symbol'
  },
  {
    label: 'Tahoma',
    value: 'Tahoma'
  },
  {
    label: 'Tamil MN',
    value: 'Tamil MN'
  },
  {
    label: 'Tamil Sangam MN',
    value: 'Tamil Sangam MN'
  },
  {
    label: 'Telugu MN',
    value: 'Telugu MN'
  },
  {
    label: 'Teluau nasmln',
    value: 'Teluau nasmln'
  },
  {
    label: 'Thonburi',
    value: 'Thonburi'
  },
  {
    label: 'Times New Roman',
    value: 'Times New Roman'
  },
  {
    label: 'Trattatello',
    value: 'Trattatello'
  },
  {
    label: 'Trebuchet MS',
    value: 'Trebuchet MS'
  },
  {
    label: 'Verdana',
    value: 'Verdana'
  },
  {
    label: 'Waseem',
    value: 'Waseem'
  },
  {
    label: 'Webdings',
    value: 'Webdings'
  },
  {
    label: 'Wingdings',
    value: 'Wingdings'
  },
  {
    label: 'Wingdings 2',
    value: 'Wingdings 2'
  },
  {
    label: 'Wingdings 3',
    value: 'Wingdings 3'
  },
  {
    label: 'Zapf Dingbats',
    value: 'Zapf Dingbats'
  },
  {
    label: 'Zapfino',
    value: 'Zapfino'
  }
];

const fontStyleOptions: OptionProps[] = [
  {
    label: '斜体',
    type: 'font-style',
    value: 'italic'
  },
  {
    label: '下划线',
    type: 'text-decoration',
    value: 'underline'
  },
  {
    label: '删除线',
    type: 'text-decoration',
    value: 'line-through'
  }
];
const textAlignOptions: OptionProps[] = [
  {
    label: '左对齐',
    type: 'text-align',
    value: 'left'
  },
  {
    label: '居中对齐',
    type: 'text-align',
    value: 'center'
  },
  {
    label: '右对齐',
    type: 'text-align',
    value: 'right'
  },
  {
    label: '两端对齐',
    type: 'text-align',
    value: 'justify'
  }
];

const verticalAlignOptions: OptionProps[] = [
  {
    label: '顶对齐',
    type: 'vertical-align',
    value: 'top'
  },
  {
    label: '垂直居中对齐',
    type: 'vertical-align',
    value: 'middle'
  },
  {
    label: '底对齐',
    type: 'vertical-align',
    value: 'bottom'
  }
];

function FontEditor(props: FontEditorProps) {
  const {
    state,
    data,
    title,
    label,
    value,
    onChange,
    hideColor,
    hideFontSize,
    hideFontWeight,
    hideLineHeight,
    hideFontFamily,
    hasSenior = true,
    hasVertical = true,
    fontStyle = true,
    textAlign = true,
    needColorCustom = false,
    colorOptions = data.colorOptions,
    fontSizeOptions = data.fontSizeOptions || defaultFontSize,
    fontWeightOptions = data.fontWeightOptions || defaultFontWeight,
    lineHeightOptions = data.lineHeightOptions || defaultlineHeight,
    fontFamilyOptions = data.fontFamilyOptions || SYSTEM_FONT_FAMILY,
    editorValueToken
  } = props;

  const alignOptions = hasVertical
    ? [...textAlignOptions, ...verticalAlignOptions]
    : textAlignOptions;

  const [open, toggleOpen] = React.useState(true);
  const [senior, toggleSenior] = React.useState(false);

  let fontToken;
  if (editorValueToken) {
    let color = `${editorValueToken}-color`;
    let fontSize = `${editorValueToken}-fontSize`;
    let fontWeight = `${editorValueToken}-fontWeight`;
    let lineHeight = `${editorValueToken}-lineHeight`;
    if (typeof editorValueToken === 'object') {
      color = editorValueToken.color || `${editorValueToken['*']}-color`;
      fontSize =
        editorValueToken.fontSize || `${editorValueToken['*']}-fontSize`;
      fontWeight =
        editorValueToken.fontWeight || `${editorValueToken['*']}-fontWeight`;
      lineHeight =
        editorValueToken.lineHeight || `${editorValueToken['*']}-lineHeight`;
    }
    fontToken = {
      color,
      fontSize,
      fontWeight,
      lineHeight
    };
  }
  const editorDefaultValue = getDefaultValue(fontToken, data);

  const [fontData, setFontData] = React.useState<FontDataProps>(
    assign({}, value)
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (value) {
        setFontData(assign({}, value));
        if (
          value['font-style'] ||
          value['text-decoration'] ||
          value['text-align'] ||
          value['vertical-align']
        ) {
          toggleSenior(true);
        }
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  function handleEdit(value: string | undefined, type: keyof FontDataProps) {
    const data = cloneDeep(fontData);
    if (
      [
        'font-style',
        'text-decoration',
        'text-align',
        'vertical-align'
      ].includes(type) &&
      data[type] === value // 这些属性是点击事件，所以如果第二次点击说明是要取消当前的选中状态
    ) {
      data[type] = undefined;
    } else {
      data[type] = value;
    }
    setFontData(data);
    onChange(data);
  }

  function getLabel(value?: string, option?: any) {
    const res = option?.find((item: any) => item.value === value);
    if (res) {
      return res.label;
    }
    return value;
  }

  return (
    <div className="Theme-FontEditor">
      <ThemeWrapperHeader
        title={title || label || '字符'}
        hasSenior={hasSenior}
        senior={senior}
        toggleSenior={toggleSenior}
        open={open}
        toggleOpen={toggleOpen}
      />
      {open && (
        <div className="Theme-FontEditor-body">
          <div className="Theme-FontEditor-line">
            {!hideColor && (
              <div className="Theme-FontEditor-item Theme-FontEditor-item-color-picker">
                <ColorPicker
                  {...props}
                  needCustom={needColorCustom ?? false}
                  value={fontData.color}
                  options={colorOptions}
                  onChange={(value: string) => {
                    handleEdit(value, 'color');
                  }}
                  itemName="color"
                  state={state}
                  placeholder={editorDefaultValue?.color || '字体颜色'}
                />
              </div>
            )}
            {!hideFontSize && (
              <div className="Theme-FontEditor-item">
                <ThemeSelect
                  {...props}
                  options={fontSizeOptions}
                  value={fontData['fontSize']}
                  onChange={(value: string) => {
                    handleEdit(value, 'fontSize');
                  }}
                  itemName="fontSize"
                  menuTpl="label"
                  state={state}
                  placeholder={editorDefaultValue?.fontSize || '字体大小'}
                />
              </div>
            )}
          </div>
          <div className="Theme-FontEditor-line Theme-FontEditor-font-line">
            {!hideFontWeight && (
              <div className="Theme-FontEditor-item">
                <ThemeSelect
                  {...props}
                  options={fontWeightOptions}
                  value={fontData['fontWeight']}
                  onChange={(value: string) => {
                    handleEdit(value, 'fontWeight');
                  }}
                  itemName="fontWeight"
                  menuTpl="label"
                  state={state}
                  placeholder={editorDefaultValue?.fontWeight || '字体字重'}
                />
                {(!hideLineHeight || !hideFontFamily) && (
                  <div className="Theme-FontEditor-item-label">字重</div>
                )}
              </div>
            )}
            {!hideLineHeight && (
              <div className="Theme-FontEditor-item">
                <ThemeSelect
                  {...props}
                  options={lineHeightOptions}
                  value={fontData['lineHeight']}
                  onChange={(value: string) => {
                    handleEdit(value, 'lineHeight');
                  }}
                  itemName="lineHeight"
                  menuTpl="label"
                  state={state}
                  placeholder={editorDefaultValue?.lineHeight || '字体行高'}
                />
                <div className="Theme-FontEditor-item-label">行高</div>
              </div>
            )}
            {!hideFontFamily && (
              <div className="Theme-FontEditor-item Theme-FontEditor-item-font-family">
                <ThemeSelect
                  {...props}
                  options={fontFamilyOptions}
                  value={fontData['font-family']}
                  onChange={(value: string) => {
                    handleEdit(value, 'font-family');
                  }}
                  itemName="fontFamily"
                  menuTpl="label"
                  menuLabelRender={(option: any) => {
                    return (
                      <div
                        className={option.className}
                        style={
                          option.previewUrl
                            ? {
                                background: `url(${option.previewUrl}) no-repeat`,
                                backgroundSize: 'contain',
                                height: '100%'
                              }
                            : {
                                fontFamily: option.value
                              }
                        }
                      >
                        {option.previewUrl ? ' ' : option.html || option.label}
                      </div>
                    );
                  }}
                  state={state}
                  placeholder={editorDefaultValue?.fontFamily || '字体'}
                />
                <div className="Theme-FontEditor-item-label">字体</div>
              </div>
            )}
          </div>
          {senior && fontStyle && (
            <div className="Theme-FontEditor-font-style">
              {fontStyleOptions.map((item, index) => (
                <TooltipWrapper
                  tooltip={item.label}
                  tooltipTheme="dark"
                  key={item.value}
                >
                  <div
                    className={cx(
                      'Theme-FontEditor-font-style-icon',
                      fontData[item.type] === item.value &&
                        'Theme-FontEditor-font-style-selected'
                    )}
                  >
                    <ThemeIcon
                      icon={item.value}
                      className="common-icon"
                      onClick={() => handleEdit(item.value, item.type)}
                    />
                  </div>
                </TooltipWrapper>
              ))}
            </div>
          )}
          {senior && textAlign && (
            <div className="Theme-FontEditor-font-style">
              {alignOptions.map((item, index) => (
                <TooltipWrapper
                  tooltip={item.label}
                  tooltipTheme="dark"
                  key={item.value}
                >
                  <div
                    className={cx(
                      'Theme-FontEditor-font-style-icon',
                      hasVertical && index === 3 && 'right-line',
                      fontData[item.type] === item.value &&
                        'Theme-FontEditor-font-style-selected'
                    )}
                  >
                    <ThemeIcon
                      icon={`${item.type}-${item.value}`}
                      className="common-icon"
                      onClick={() => handleEdit(item.value, item.type)}
                    />
                  </div>
                </TooltipWrapper>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

@FormItem({
  type: 'amis-theme-font-editor',
  strictMode: false,
  renderLabel: false
})
export class FontEditorRenderer extends React.Component<FontEditorProps> {
  render() {
    return <FontEditor {...this.props} />;
  }
}
