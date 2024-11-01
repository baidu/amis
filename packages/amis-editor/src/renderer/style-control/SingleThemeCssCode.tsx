/**
 * 单类名输入框 + 自定义样式源码编辑器
 */
import React, {useEffect, useRef, useState} from 'react';
import {Editor, Overlay, PopOver} from 'amis-ui';
import {FormControlProps, FormItem} from 'amis-core';
// @ts-ignore
import {parse as cssParse} from 'amis-postcss';
import {PlainObject} from './types';
import isObject from 'lodash/isObject';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import {Icon} from '../../icons/index';

const conf: any = {
  ws: '[ \t\n\r\f]*',
  identifier:
    '-?-?([a-zA-Z]|(\\\\(([0-9a-fA-F]{1,6}\\s?)|[^[0-9a-fA-F])))([\\w\\-]|(\\\\(([0-9a-fA-F]{1,6}\\s?)|[^[0-9a-fA-F])))*',
  tokenizer: {
    root: [{include: '@selector'}],
    selector: [{include: '@selectorbody'}],
    selectorbody: [
      [
        '[*_]?@identifier@ws:(?=(\\s|\\d|[^{;}]*[;}]))',
        'attribute.name',
        '@rulevalue'
      ]
    ],
    rulevalue: [
      {include: '@strings'},
      {include: '@term'},
      ['!important', 'keyword'],
      [';', 'delimiter', '@pop'],
      ['(?=})', {token: '', next: '@pop'}]
    ],
    term: [
      [
        '(url-prefix)(\\()',
        [
          'attribute.value',
          {token: 'delimiter.parenthesis', next: '@urldeclaration'}
        ]
      ],
      [
        '(url)(\\()',
        [
          'attribute.value',
          {token: 'delimiter.parenthesis', next: '@urldeclaration'}
        ]
      ],
      {include: '@numbers'},
      {include: '@name'},
      {include: '@strings'},
      ['([<>=\\+\\-\\*\\/\\^\\|\\~,])', 'delimiter'],
      [',', 'delimiter']
    ],
    warndebug: [
      ['[@](warn|debug)', {token: 'keyword', next: '@declarationbody'}]
    ],
    urldeclaration: [
      {include: '@strings'},
      ['[^)\r\n]+', 'string'],
      ['\\)', {token: 'delimiter.parenthesis', next: '@pop'}]
    ],
    parenthizedterm: [
      {include: '@term'},
      ['\\)', {token: 'delimiter.parenthesis', next: '@pop'}]
    ],
    declarationbody: [
      {include: '@term'},
      [';', 'delimiter', '@pop'],
      ['(?=})', {token: '', next: '@pop'}] // missing semicolon
    ],
    name: [['@identifier', 'attribute.value']],
    numbers: [
      [
        '-?(\\d*\\.)?\\d+([eE][\\-+]?\\d+)?',
        {token: 'attribute.value.number', next: '@units'}
      ],
      ['#[0-9a-fA-F_]+(?!\\w)', 'attribute.value.hex']
    ],
    units: [
      [
        '(em|ex|ch|rem|fr|vmin|vmax|vw|vh|vm|cm|mm|in|px|pt|pc|deg|grad|rad|turn|s|ms|Hz|kHz|%)?',
        'attribute.value.unit',
        '@pop'
      ]
    ],
    strings: [
      ['~?"', {token: 'string', next: '@stringenddoublequote'}],
      ["~?'", {token: 'string', next: '@stringendquote'}]
    ],
    stringenddoublequote: [
      ['\\\\.', 'string'],
      ['"', {token: 'string', next: '@pop'}],
      [/[^\\"]+/, 'string'],
      ['.', 'string']
    ],
    stringendquote: [
      ['\\\\.', 'string'],
      ["'", {token: 'string', next: '@pop'}],
      [/[^\\']+/, 'string'],
      ['.', 'string']
    ]
  }
};

const keywords: PlainObject = {
  'additive-symbols': {},
  'align-content': {
    values: [
      'center',
      'flex-end',
      'flex-start',
      'space-around',
      'space-between',
      'stretch',
      'start',
      'end',
      'normal',
      'baseline',
      'first baseline',
      'last baseline',
      'space-around',
      'space-between',
      'space-evenly',
      'stretch',
      'safe',
      'unsafe'
    ]
  },
  'align-items': {
    values: [
      'baseline',
      'center',
      'flex-end',
      'flex-start',
      'stretch',
      'normal',
      'start',
      'end',
      'self-start',
      'self-end',
      'first baseline',
      'last baseline',
      'stretch',
      'safe',
      'unsafe'
    ]
  },
  'justify-items': {
    values: [
      'auto',
      'normal',
      'end',
      'start',
      'flex-end',
      'flex-start',
      'self-end',
      'self-start',
      'center',
      'left',
      'right',
      'baseline',
      'first baseline',
      'last baseline',
      'stretch',
      'safe',
      'unsafe',
      'legacy'
    ]
  },
  'justify-self': {
    values: [
      'auto',
      'normal',
      'end',
      'start',
      'flex-end',
      'flex-start',
      'self-end',
      'self-start',
      'center',
      'left',
      'right',
      'baseline',
      'first baseline',
      'last baseline',
      'stretch',
      'save',
      'unsave'
    ]
  },
  'align-self': {
    values: [
      'auto',
      'normal',
      'self-end',
      'self-start',
      'baseline',
      'center',
      'flex-end',
      'flex-start',
      'stretch',
      'baseline',
      'first baseline',
      'last baseline',
      'safe',
      'unsafe'
    ]
  },
  'all': {
    values: []
  },
  'alt': {
    values: []
  },
  'animation': {
    values: [
      'alternate',
      'alternate-reverse',
      'backwards',
      'both',
      'forwards',
      'infinite',
      'none',
      'normal',
      'reverse'
    ]
  },
  'animation-delay': {},
  'animation-direction': {
    values: ['alternate', 'alternate-reverse', 'normal', 'reverse']
  },
  'animation-duration': {},
  'animation-fill-mode': {
    values: ['backwards', 'both', 'forwards', 'none']
  },
  'animation-iteration-count': {
    values: ['infinite']
  },
  'animation-name': {
    values: ['none']
  },
  'animation-play-state': {
    values: ['paused', 'running']
  },
  'animation-timing-function': {},
  'backface-visibility': {
    values: ['hidden', 'visible']
  },
  'background': {
    values: ['fixed', 'local', 'none', 'scroll']
  },
  'background-attachment': {
    values: ['fixed', 'local', 'scroll']
  },
  'background-blend-mode': {
    values: [
      'normal',
      'multiply',
      'screen',
      'overlay',
      'darken',
      'lighten',
      'color-dodge',
      'color-burn',
      'hard-light',
      'soft-light',
      'difference',
      'exclusion',
      'hue',
      'saturation',
      'color',
      'luminosity'
    ]
  },
  'background-clip': {},
  'background-color': {},
  'background-image': {
    values: ['none']
  },
  'background-origin': {},
  'background-position': {},
  'background-position-x': {
    values: ['center', 'left', 'right']
  },
  'background-position-y': {
    values: ['bottom', 'center', 'top']
  },
  'background-repeat': {
    values: []
  },
  'background-size': {
    values: ['auto', 'contain', 'cover']
  },
  'behavior': {},
  'block-size': {
    values: ['auto']
  },
  'border': {},
  'border-block-end': {},
  'border-block-start': {},
  'border-block-end-color': {},
  'border-block-start-color': {},
  'border-block-end-style': {},
  'border-block-start-style': {},
  'border-block-end-width': {},
  'border-block-start-width': {},
  'border-bottom': {},
  'border-bottom-color': {},
  'border-bottom-left-radius': {},
  'border-bottom-right-radius': {},
  'border-bottom-style': {},
  'border-bottom-width': {},
  'border-collapse': {
    values: ['collapse', 'separate']
  },
  'border-color': {
    values: []
  },
  'border-image': {
    values: [
      'auto',
      'fill',
      'none',
      'repeat',
      'round',
      'space',
      'stretch',
      'url()'
    ]
  },
  'border-image-outset': {},
  'border-image-repeat': {
    values: ['repeat', 'round', 'space', 'stretch']
  },
  'border-image-slice': {
    values: ['fill']
  },
  'border-image-source': {
    values: ['none']
  },
  'border-image-width': {
    values: ['auto']
  },
  'border-inline-end': {},
  'border-inline-start': {},
  'border-inline-end-color': {},
  'border-inline-start-color': {},
  'border-inline-end-style': {},
  'border-inline-start-style': {},
  'border-inline-end-width': {},
  'border-inline-start-width': {},
  'border-left': {},
  'border-left-color': {},
  'border-left-style': {},
  'border-left-width': {},
  'border-radius': {},
  'border-right': {},
  'border-right-color': {},
  'border-right-style': {},
  'border-right-width': {},
  'border-spacing': {},
  'border-style': {
    values: []
  },
  'border-top': {},
  'border-top-color': {},
  'border-top-left-radius': {},
  'border-top-right-radius': {},
  'border-top-style': {},
  'border-top-width': {},
  'border-width': {
    values: []
  },
  'bottom': {
    values: ['auto']
  },
  'box-decoration-break': {
    values: ['clone', 'slice']
  },
  'box-shadow': {
    values: ['inset', 'none']
  },
  'box-sizing': {
    values: ['border-box', 'content-box']
  },
  'break-after': {
    values: [
      'always',
      'auto',
      'avoid',
      'avoid-column',
      'avoid-page',
      'column',
      'left',
      'page',
      'right'
    ]
  },
  'break-before': {
    values: [
      'always',
      'auto',
      'avoid',
      'avoid-column',
      'avoid-page',
      'column',
      'left',
      'page',
      'right'
    ]
  },
  'break-inside': {
    values: ['auto', 'avoid', 'avoid-column', 'avoid-page']
  },
  'caption-side': {
    values: ['bottom', 'top']
  },
  'caret-color': {
    values: ['auto']
  },
  'clear': {
    values: ['both', 'left', 'none', 'right']
  },
  'clip': {
    values: ['auto', 'rect()']
  },
  'clip-path': {
    values: ['none', 'url()']
  },
  'clip-rule': {
    values: ['evenodd', 'nonzero']
  },
  'color': {},
  'color-interpolation-filters': {
    values: ['auto', 'linearRGB', 'sRGB']
  },
  'column-count': {
    values: ['auto']
  },
  'column-fill': {
    values: ['auto', 'balance']
  },
  'column-gap': {
    values: ['normal']
  },
  'column-rule': {},
  'column-rule-color': {},
  'column-rule-style': {},
  'column-rule-width': {},
  'columns': {
    values: ['auto']
  },
  'column-span': {
    values: ['all', 'none']
  },
  'column-width': {
    values: ['auto']
  },
  'contain': {
    values: ['none', 'strict', 'content', 'size', 'layout', 'style', 'paint']
  },
  'content': {
    values: ['attr()', 'counter(name)', 'icon', 'none', 'normal', 'url()']
  },
  'counter-increment': {
    values: ['none']
  },
  'counter-reset': {
    values: ['none']
  },
  'cursor': {
    values: [
      'alias',
      'all-scroll',
      'auto',
      'cell',
      'col-resize',
      'context-menu',
      'copy',
      'crosshair',
      'default',
      'e-resize',
      'ew-resize',
      'grab',
      'grabbing',
      'help',
      'move',
      '-moz-grab',
      '-moz-grabbing',
      '-moz-zoom-in',
      '-moz-zoom-out',
      'ne-resize',
      'nesw-resize',
      'no-drop',
      'none',
      'not-allowed',
      'n-resize',
      'ns-resize',
      'nw-resize',
      'nwse-resize',
      'pointer',
      'progress',
      'row-resize',
      'se-resize',
      's-resize',
      'sw-resize',
      'text',
      'vertical-text',
      'wait',
      '-webkit-grab',
      '-webkit-grabbing',
      '-webkit-zoom-in',
      '-webkit-zoom-out',
      'w-resize',
      'zoom-in',
      'zoom-out'
    ]
  },
  'direction': {
    values: ['ltr', 'rtl']
  },
  'display': {
    values: [
      'block',
      'contents',
      'flex',
      'flexbox',
      'flow-root',
      'grid',
      'inline',
      'inline-block',
      'inline-flex',
      'inline-flexbox',
      'inline-table',
      'list-item',
      '-moz-box',
      '-moz-deck',
      '-moz-grid',
      '-moz-grid-group',
      '-moz-grid-line',
      '-moz-groupbox',
      '-moz-inline-box',
      '-moz-inline-grid',
      '-moz-inline-stack',
      '-moz-marker',
      '-moz-popup',
      '-moz-stack',
      '-ms-flexbox',
      '-ms-grid',
      '-ms-inline-flexbox',
      '-ms-inline-grid',
      'none',
      'ruby',
      'ruby-base',
      'ruby-base-container',
      'ruby-text',
      'ruby-text-container',
      'run-in',
      'table',
      'table-caption',
      'table-cell',
      'table-column',
      'table-column-group',
      'table-footer-group',
      'table-header-group',
      'table-row',
      'table-row-group',
      '-webkit-box',
      '-webkit-flex',
      '-webkit-inline-box',
      '-webkit-inline-flex'
    ]
  },
  'empty-cells': {
    values: ['hide', '-moz-show-background', 'show']
  },
  'enable-background': {
    values: ['accumulate', 'new']
  },
  'fallback': {},
  'fill': {
    values: ['url()', 'none']
  },
  'fill-opacity': {},
  'fill-rule': {
    values: ['evenodd', 'nonzero']
  },
  'filter': {
    values: [
      'none',
      'blur()',
      'brightness()',
      'contrast()',
      'drop-shadow()',
      'grayscale()',
      'hue-rotate()',
      'invert()',
      'opacity()',
      'saturate()',
      'sepia()',
      'url()'
    ]
  },
  'flex': {
    values: ['auto', 'content', 'none']
  },
  'flex-basis': {
    values: ['auto', 'content']
  },
  'flex-direction': {
    values: ['column', 'column-reverse', 'row', 'row-reverse']
  },
  'flex-flow': {
    values: [
      'column',
      'column-reverse',
      'nowrap',
      'row',
      'row-reverse',
      'wrap',
      'wrap-reverse'
    ]
  },
  'flex-grow': {},
  'flex-shrink': {},
  'flex-wrap': {
    values: ['nowrap', 'wrap', 'wrap-reverse']
  },
  'float': {
    values: ['inline-end', 'inline-start', 'left', 'none', 'right']
  },
  'flood-color': {},
  'flood-opacity': {},
  'font': {
    values: [
      '100',
      '200',
      '300',
      '400',
      '500',
      '600',
      '700',
      '800',
      '900',
      'bold',
      'bolder',
      'caption',
      'icon',
      'italic',
      'large',
      'larger',
      'lighter',
      'medium',
      'menu',
      'message-box',
      'normal',
      'oblique',
      'small',
      'small-caps',
      'small-caption',
      'smaller',
      'status-bar',
      'x-large',
      'x-small',
      'xx-large',
      'xx-small'
    ]
  },
  'font-family': {
    values: [
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
      'Arial, Helvetica, sans-serif',
      "Cambria, Cochin, Georgia, Times, 'Times New Roman', serif",
      "'Courier New', Courier, monospace",
      'cursive',
      'fantasy',
      "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif",
      "Georgia, 'Times New Roman', Times, serif",
      "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
      "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
      "'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif",
      'monospace',
      'sans-serif',
      "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      'serif',
      "'Times New Roman', Times, serif",
      "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
      'Verdana, Geneva, Tahoma, sans-serif'
    ]
  },
  'font-feature-settings': {
    values: [
      '"aalt"',
      '"abvf"',
      '"abvm"',
      '"abvs"',
      '"afrc"',
      '"akhn"',
      '"blwf"',
      '"blwm"',
      '"blws"',
      '"calt"',
      '"case"',
      '"ccmp"',
      '"cfar"',
      '"cjct"',
      '"clig"',
      '"cpct"',
      '"cpsp"',
      '"cswh"',
      '"curs"',
      '"c2pc"',
      '"c2sc"',
      '"dist"',
      '"dlig"',
      '"dnom"',
      '"dtls"',
      '"expt"',
      '"falt"',
      '"fin2"',
      '"fin3"',
      '"fina"',
      '"flac"',
      '"frac"',
      '"fwid"',
      '"half"',
      '"haln"',
      '"halt"',
      '"hist"',
      '"hkna"',
      '"hlig"',
      '"hngl"',
      '"hojo"',
      '"hwid"',
      '"init"',
      '"isol"',
      '"ital"',
      '"jalt"',
      '"jp78"',
      '"jp83"',
      '"jp90"',
      '"jp04"',
      '"kern"',
      '"lfbd"',
      '"liga"',
      '"ljmo"',
      '"lnum"',
      '"locl"',
      '"ltra"',
      '"ltrm"',
      '"mark"',
      '"med2"',
      '"medi"',
      '"mgrk"',
      '"mkmk"',
      '"nalt"',
      '"nlck"',
      '"nukt"',
      '"numr"',
      '"onum"',
      '"opbd"',
      '"ordn"',
      '"ornm"',
      '"palt"',
      '"pcap"',
      '"pkna"',
      '"pnum"',
      '"pref"',
      '"pres"',
      '"pstf"',
      '"psts"',
      '"pwid"',
      '"qwid"',
      '"rand"',
      '"rclt"',
      '"rlig"',
      '"rkrf"',
      '"rphf"',
      '"rtbd"',
      '"rtla"',
      '"rtlm"',
      '"ruby"',
      '"salt"',
      '"sinf"',
      '"size"',
      '"smcp"',
      '"smpl"',
      '"ssty"',
      '"stch"',
      '"subs"',
      '"sups"',
      '"swsh"',
      '"titl"',
      '"tjmo"',
      '"tnam"',
      '"tnum"',
      '"trad"',
      '"twid"',
      '"unic"',
      '"valt"',
      '"vatu"',
      '"vert"',
      '"vhal"',
      '"vjmo"',
      '"vkna"',
      '"vkrn"',
      '"vpal"',
      '"vrt2"',
      '"zero"',
      'normal',
      'off',
      'on'
    ]
  },
  'font-kerning': {
    values: ['auto', 'none', 'normal']
  },
  'font-language-override': {
    values: ['normal']
  },
  'font-size': {
    values: [
      'large',
      'larger',
      'medium',
      'small',
      'smaller',
      'x-large',
      'x-small',
      'xx-large',
      'xx-small'
    ]
  },
  'font-size-adjust': {
    values: ['none']
  },
  'font-stretch': {
    values: [
      'condensed',
      'expanded',
      'extra-condensed',
      'extra-expanded',
      'narrower',
      'normal',
      'semi-condensed',
      'semi-expanded',
      'ultra-condensed',
      'ultra-expanded',
      'wider'
    ]
  },
  'font-style': {
    values: ['italic', 'normal', 'oblique']
  },
  'font-synthesis': {
    values: ['none', 'style', 'weight']
  },
  'font-variant': {
    values: ['normal', 'small-caps']
  },
  'font-variant-alternates': {
    values: [
      'annotation()',
      'character-variant()',
      'historical-forms',
      'normal',
      'ornaments()',
      'styleset()',
      'stylistic()',
      'swash()'
    ]
  },
  'font-variant-caps': {
    values: [
      'all-petite-caps',
      'all-small-caps',
      'normal',
      'petite-caps',
      'small-caps',
      'titling-caps',
      'unicase'
    ]
  },
  'font-variant-east-asian': {
    values: [
      'full-width',
      'jis04',
      'jis78',
      'jis83',
      'jis90',
      'normal',
      'proportional-width',
      'ruby',
      'simplified',
      'traditional'
    ]
  },
  'font-variant-ligatures': {
    values: [
      'additional-ligatures',
      'common-ligatures',
      'contextual',
      'discretionary-ligatures',
      'historical-ligatures',
      'no-additional-ligatures',
      'no-common-ligatures',
      'no-contextual',
      'no-discretionary-ligatures',
      'no-historical-ligatures',
      'none',
      'normal'
    ]
  },
  'font-variant-numeric': {
    values: [
      'diagonal-fractions',
      'lining-nums',
      'normal',
      'oldstyle-nums',
      'ordinal',
      'proportional-nums',
      'slashed-zero',
      'stacked-fractions',
      'tabular-nums'
    ]
  },
  'font-variant-position': {
    values: ['normal', 'sub', 'super']
  },
  'font-weight': {
    values: [
      '100',
      '200',
      '300',
      '400',
      '500',
      '600',
      '700',
      '800',
      '900',
      'bold',
      'bolder',
      'lighter',
      'normal'
    ]
  },
  'glyph-orientation-horizontal': {},
  'glyph-orientation-vertical': {
    values: ['auto']
  },
  'grid-area': {
    values: ['auto', 'span']
  },
  'grid': {},
  'grid-auto-columns': {
    values: ['min-content', 'max-content', 'auto', 'minmax()']
  },
  'grid-auto-flow': {
    values: ['row', 'column', 'dense']
  },
  'grid-auto-rows': {
    values: ['min-content', 'max-content', 'auto', 'minmax()']
  },
  'grid-column': {
    values: ['auto', 'span']
  },
  'grid-column-end': {
    values: ['auto', 'span']
  },
  'grid-column-gap': {},
  'grid-column-start': {
    values: ['auto', 'span']
  },
  'grid-gap': {},
  'grid-row': {
    values: ['auto', 'span']
  },
  'grid-row-end': {
    values: ['auto', 'span']
  },
  'grid-row-gap': {},
  'grid-row-start': {
    values: ['auto', 'span']
  },
  'grid-template': {
    values: [
      'none',
      'min-content',
      'max-content',
      'auto',
      'subgrid',
      'minmax()',
      'repeat()'
    ]
  },
  'grid-template-areas': {
    values: ['none']
  },
  'grid-template-columns': {
    values: [
      'none',
      'min-content',
      'max-content',
      'auto',
      'subgrid',
      'minmax()',
      'repeat()'
    ]
  },
  'grid-template-rows': {
    values: [
      'none',
      'min-content',
      'max-content',
      'auto',
      'subgrid',
      'minmax()',
      'repeat()'
    ]
  },
  'height': {
    values: ['auto', 'fit-content', 'max-content', 'min-content']
  },
  'hyphens': {
    values: ['auto', 'manual', 'none']
  },
  'image-orientation': {
    values: ['flip', 'from-image']
  },
  'image-rendering': {
    values: [
      'auto',
      'crisp-edges',
      '-moz-crisp-edges',
      'optimizeQuality',
      'optimizeSpeed',
      'pixelated'
    ]
  },
  'ime-mode': {
    values: ['active', 'auto', 'disabled', 'inactive', 'normal']
  },
  'inline-size': {
    values: ['auto']
  },
  'isolation': {
    values: ['auto', 'isolate']
  },
  'justify-content': {
    values: [
      'center',
      'start',
      'end',
      'left',
      'right',
      'safe',
      'unsafe',
      'stretch',
      'space-evenly',
      'flex-end',
      'flex-start',
      'space-around',
      'space-between',
      'baseline',
      'first baseline',
      'last baseline'
    ]
  },
  'kerning': {
    values: ['auto']
  },
  'left': {
    values: ['auto']
  },
  'letter-spacing': {
    values: ['normal']
  },
  'lighting-color': {},
  'line-break': {
    values: ['auto', 'loose', 'normal', 'strict', 'anywhere']
  },
  'line-height': {
    values: ['normal']
  },
  'list-style': {
    values: [
      'armenian',
      'circle',
      'decimal',
      'decimal-leading-zero',
      'disc',
      'georgian',
      'inside',
      'lower-alpha',
      'lower-greek',
      'lower-latin',
      'lower-roman',
      'none',
      'outside',
      'square',
      'symbols()',
      'upper-alpha',
      'upper-latin',
      'upper-roman',
      'url()'
    ]
  },
  'list-style-image': {
    values: ['none']
  },
  'list-style-position': {
    values: ['inside', 'outside']
  },
  'list-style-type': {
    values: [
      'armenian',
      'circle',
      'decimal',
      'decimal-leading-zero',
      'disc',
      'georgian',
      'lower-alpha',
      'lower-greek',
      'lower-latin',
      'lower-roman',
      'none',
      'square',
      'symbols()',
      'upper-alpha',
      'upper-latin',
      'upper-roman'
    ]
  },
  'margin': {
    values: ['auto']
  },
  'margin-block-end': {
    values: ['auto']
  },
  'margin-block-start': {
    values: ['auto']
  },
  'margin-bottom': {
    values: ['auto']
  },
  'margin-inline-end': {
    values: ['auto']
  },
  'margin-inline-start': {
    values: ['auto']
  },
  'margin-left': {
    values: ['auto']
  },
  'margin-right': {
    values: ['auto']
  },
  'margin-top': {
    values: ['auto']
  },
  'marker': {
    values: ['none', 'url()']
  },
  'marker-end': {
    values: ['none', 'url()']
  },
  'marker-mid': {
    values: ['none', 'url()']
  },
  'marker-start': {
    values: ['none', 'url()']
  },
  'mask-image': {
    values: ['none', 'url()']
  },
  'mask-mode': {
    values: ['alpha', 'auto', 'luminance']
  },
  'mask-origin': {},
  'mask-position': {},
  'mask-repeat': {},
  'mask-size': {
    values: ['auto', 'contain', 'cover']
  },
  'mask-type': {
    values: ['alpha', 'luminance']
  },
  'max-block-size': {
    values: ['none']
  },
  'max-height': {
    values: ['none', 'fit-content', 'max-content', 'min-content']
  },
  'max-inline-size': {
    values: ['none']
  },
  'max-width': {
    values: ['none', 'fit-content', 'max-content', 'min-content']
  },
  'min-block-size': {},
  'min-height': {
    values: ['auto', 'fit-content', 'max-content', 'min-content']
  },
  'min-inline-size': {},
  'min-width': {
    values: ['auto', 'fit-content', 'max-content', 'min-content']
  },
  'mix-blend-mode': {
    values: [
      'normal',
      'multiply',
      'screen',
      'overlay',
      'darken',
      'lighten',
      'color-dodge',
      'color-burn',
      'hard-light',
      'soft-light',
      'difference',
      'exclusion',
      'hue',
      'saturation',
      'color',
      'luminosity'
    ]
  },
  'motion': {
    values: ['none', 'path()', 'auto', 'reverse']
  },
  'motion-offset': {},
  'motion-path': {
    values: ['none', 'path()']
  },
  'motion-rotation': {
    values: ['auto', 'reverse']
  },
  '-moz-animation': {
    values: [
      'alternate',
      'alternate-reverse',
      'backwards',
      'both',
      'forwards',
      'infinite',
      'none',
      'normal',
      'reverse'
    ]
  },
  '-moz-animation-delay': {},
  '-moz-animation-direction': {
    values: ['alternate', 'alternate-reverse', 'normal', 'reverse']
  },
  '-moz-animation-duration': {},
  '-moz-animation-iteration-count': {
    values: ['infinite']
  },
  '-moz-animation-name': {
    values: ['none']
  },
  '-moz-animation-play-state': {
    values: ['paused', 'running']
  },
  '-moz-animation-timing-function': {},
  '-moz-appearance': {
    values: [
      'button',
      'button-arrow-down',
      'button-arrow-next',
      'button-arrow-previous',
      'button-arrow-up',
      'button-bevel',
      'checkbox',
      'checkbox-container',
      'checkbox-label',
      'dialog',
      'groupbox',
      'listbox',
      'menuarrow',
      'menuimage',
      'menuitem',
      'menuitemtext',
      'menulist',
      'menulist-button',
      'menulist-text',
      'menulist-textfield',
      'menupopup',
      'menuradio',
      'menuseparator',
      '-moz-mac-unified-toolbar',
      '-moz-win-borderless-glass',
      '-moz-win-browsertabbar-toolbox',
      '-moz-win-communications-toolbox',
      '-moz-win-glass',
      '-moz-win-media-toolbox',
      'none',
      'progressbar',
      'progresschunk',
      'radio',
      'radio-container',
      'radio-label',
      'radiomenuitem',
      'resizer',
      'resizerpanel',
      'scrollbarbutton-down',
      'scrollbarbutton-left',
      'scrollbarbutton-right',
      'scrollbarbutton-up',
      'scrollbar-small',
      'scrollbartrack-horizontal',
      'scrollbartrack-vertical',
      'separator',
      'spinner',
      'spinner-downbutton',
      'spinner-textfield',
      'spinner-upbutton',
      'statusbar',
      'statusbarpanel',
      'tab',
      'tabpanels',
      'tab-scroll-arrow-back',
      'tab-scroll-arrow-forward',
      'textfield',
      'textfield-multiline',
      'toolbar',
      'toolbox',
      'tooltip',
      'treeheadercell',
      'treeheadersortarrow',
      'treeitem',
      'treetwistyopen',
      'treeview',
      'treewisty',
      'window'
    ]
  },
  '-moz-backface-visibility': {
    values: ['hidden', 'visible']
  },
  '-moz-background-clip': {
    values: ['padding']
  },
  '-moz-background-inline-policy': {
    values: ['bounding-box', 'continuous', 'each-box']
  },
  '-moz-background-origin': {},
  '-moz-border-bottom-colors': {},
  '-moz-border-image': {
    values: [
      'auto',
      'fill',
      'none',
      'repeat',
      'round',
      'space',
      'stretch',
      'url()'
    ]
  },
  '-moz-border-left-colors': {},
  '-moz-border-right-colors': {},
  '-moz-border-top-colors': {},
  '-moz-box-align': {
    values: ['baseline', 'center', 'end', 'start', 'stretch']
  },
  '-moz-box-direction': {
    values: ['normal', 'reverse']
  },
  '-moz-box-flex': {},
  '-moz-box-flexgroup': {},
  '-moz-box-ordinal-group': {},
  '-moz-box-orient': {
    values: ['block-axis', 'horizontal', 'inline-axis', 'vertical']
  },
  '-moz-box-pack': {
    values: ['center', 'end', 'justify', 'start']
  },
  '-moz-box-sizing': {
    values: ['border-box', 'content-box', 'padding-box']
  },
  '-moz-column-count': {
    values: ['auto']
  },
  '-moz-column-gap': {
    values: ['normal']
  },
  '-moz-column-rule': {},
  '-moz-column-rule-color': {},
  '-moz-column-rule-style': {},
  '-moz-column-rule-width': {},
  '-moz-columns': {
    values: ['auto']
  },
  '-moz-column-width': {
    values: ['auto']
  },
  '-moz-font-feature-settings': {
    values: [
      '"c2cs"',
      '"dlig"',
      '"kern"',
      '"liga"',
      '"lnum"',
      '"onum"',
      '"smcp"',
      '"swsh"',
      '"tnum"',
      'normal',
      'off',
      'on'
    ]
  },
  '-moz-hyphens': {
    values: ['auto', 'manual', 'none']
  },
  '-moz-perspective': {
    values: ['none']
  },
  '-moz-perspective-origin': {},
  '-moz-text-align-last': {
    values: ['auto', 'center', 'justify', 'left', 'right']
  },
  '-moz-text-decoration-color': {},
  '-moz-text-decoration-line': {
    values: ['line-through', 'none', 'overline', 'underline']
  },
  '-moz-text-decoration-style': {
    values: ['dashed', 'dotted', 'double', 'none', 'solid', 'wavy']
  },
  '-moz-text-size-adjust': {
    values: ['auto', 'none']
  },
  '-moz-transform': {
    values: [
      'matrix()',
      'matrix3d()',
      'none',
      'perspective',
      'rotate()',
      'rotate3d()',
      "rotateX('angle')",
      "rotateY('angle')",
      "rotateZ('angle')",
      'scale()',
      'scale3d()',
      'scaleX()',
      'scaleY()',
      'scaleZ()',
      'skew()',
      'skewX()',
      'skewY()',
      'translate()',
      'translate3d()',
      'translateX()',
      'translateY()',
      'translateZ()'
    ]
  },
  '-moz-transform-origin': {},
  '-moz-transition': {
    values: ['all', 'none']
  },
  '-moz-transition-delay': {},
  '-moz-transition-duration': {},
  '-moz-transition-property': {
    values: ['all', 'none']
  },
  '-moz-transition-timing-function': {},
  '-moz-user-focus': {
    values: ['ignore', 'normal']
  },
  '-moz-user-select': {
    values: [
      'all',
      'element',
      'elements',
      '-moz-all',
      '-moz-none',
      'none',
      'text',
      'toggle'
    ]
  },
  '-ms-accelerator': {
    values: ['false', 'true']
  },
  '-ms-behavior': {},
  '-ms-block-progression': {
    values: ['bt', 'lr', 'rl', 'tb']
  },
  '-ms-content-zoom-chaining': {
    values: ['chained', 'none']
  },
  '-ms-content-zooming': {
    values: ['none', 'zoom']
  },
  '-ms-content-zoom-limit': {},
  '-ms-content-zoom-limit-max': {},
  '-ms-content-zoom-limit-min': {},
  '-ms-content-zoom-snap': {
    values: [
      'mandatory',
      'none',
      'proximity',
      'snapInterval(100%, 100%)',
      'snapList()'
    ]
  },
  '-ms-content-zoom-snap-points': {
    values: ['snapInterval(100%, 100%)', 'snapList()']
  },
  '-ms-content-zoom-snap-type': {
    values: ['mandatory', 'none', 'proximity']
  },
  '-ms-filter': {},
  '-ms-flex': {
    values: ['auto', 'none']
  },
  '-ms-flex-align': {
    values: ['baseline', 'center', 'end', 'start', 'stretch']
  },
  '-ms-flex-direction': {
    values: ['column', 'column-reverse', 'row', 'row-reverse']
  },
  '-ms-flex-flow': {
    values: [
      'column',
      'column-reverse',
      'nowrap',
      'row',
      'wrap',
      'wrap-reverse'
    ]
  },
  '-ms-flex-item-align': {
    values: ['auto', 'baseline', 'center', 'end', 'start', 'stretch']
  },
  '-ms-flex-line-pack': {
    values: ['center', 'distribute', 'end', 'justify', 'start', 'stretch']
  },
  '-ms-flex-order': {},
  '-ms-flex-pack': {
    values: ['center', 'distribute', 'end', 'justify', 'start']
  },
  '-ms-flex-wrap': {
    values: ['nowrap', 'wrap', 'wrap-reverse']
  },
  '-ms-flow-from': {
    values: ['none']
  },
  '-ms-flow-into': {
    values: ['none']
  },
  '-ms-grid-column': {
    values: ['auto', 'end', 'start']
  },
  '-ms-grid-column-align': {
    values: ['center', 'end', 'start', 'stretch']
  },
  '-ms-grid-columns': {},
  '-ms-grid-column-span': {},
  '-ms-grid-layer': {},
  '-ms-grid-row': {
    values: ['auto', 'end', 'start']
  },
  '-ms-grid-row-align': {
    values: ['center', 'end', 'start', 'stretch']
  },
  '-ms-grid-rows': {},
  '-ms-grid-row-span': {},
  '-ms-high-contrast-adjust': {
    values: ['auto', 'none']
  },
  '-ms-hyphenate-limit-chars': {
    values: ['auto']
  },
  '-ms-hyphenate-limit-lines': {
    values: ['no-limit']
  },
  '-ms-hyphenate-limit-zone': {},
  '-ms-hyphens': {
    values: ['auto', 'manual', 'none']
  },
  '-ms-ime-mode': {
    values: ['active', 'auto', 'disabled', 'inactive', 'normal']
  },
  '-ms-interpolation-mode': {
    values: ['bicubic', 'nearest-neighbor']
  },
  '-ms-layout-grid': {
    values: ['char', 'line', 'mode', 'type']
  },
  '-ms-layout-grid-char': {
    values: ['auto', 'none']
  },
  '-ms-layout-grid-line': {
    values: ['auto', 'none']
  },
  '-ms-layout-grid-mode': {
    values: ['both', 'char', 'line', 'none']
  },
  '-ms-layout-grid-type': {
    values: ['fixed', 'loose', 'strict']
  },
  '-ms-line-break': {
    values: ['auto', 'keep-all', 'newspaper', 'normal', 'strict']
  },
  '-ms-overflow-style': {
    values: ['auto', '-ms-autohiding-scrollbar', 'none', 'scrollbar']
  },
  '-ms-perspective': {
    values: ['none']
  },
  '-ms-perspective-origin': {},
  '-ms-perspective-origin-x': {},
  '-ms-perspective-origin-y': {},
  '-ms-progress-appearance': {
    values: ['bar', 'ring']
  },
  '-ms-scrollbar-3dlight-color': {},
  '-ms-scrollbar-arrow-color': {},
  '-ms-scrollbar-base-color': {},
  '-ms-scrollbar-darkshadow-color': {},
  '-ms-scrollbar-face-color': {},
  '-ms-scrollbar-highlight-color': {},
  '-ms-scrollbar-shadow-color': {},
  '-ms-scrollbar-track-color': {},
  '-ms-scroll-chaining': {
    values: ['chained', 'none']
  },
  '-ms-scroll-limit': {
    values: ['auto']
  },
  '-ms-scroll-limit-x-max': {
    values: ['auto']
  },
  '-ms-scroll-limit-x-min': {},
  '-ms-scroll-limit-y-max': {
    values: ['auto']
  },
  '-ms-scroll-limit-y-min': {},
  '-ms-scroll-rails': {
    values: ['none', 'railed']
  },
  '-ms-scroll-snap-points-x': {
    values: ['snapInterval(100%, 100%)', 'snapList()']
  },
  '-ms-scroll-snap-points-y': {
    values: ['snapInterval(100%, 100%)', 'snapList()']
  },
  '-ms-scroll-snap-type': {
    values: ['none', 'mandatory', 'proximity']
  },
  '-ms-scroll-snap-x': {
    values: [
      'mandatory',
      'none',
      'proximity',
      'snapInterval(100%, 100%)',
      'snapList()'
    ]
  },
  '-ms-scroll-snap-y': {
    values: [
      'mandatory',
      'none',
      'proximity',
      'snapInterval(100%, 100%)',
      'snapList()'
    ]
  },
  '-ms-scroll-translation': {
    values: ['none', 'vertical-to-horizontal']
  },
  '-ms-text-align-last': {
    values: ['auto', 'center', 'justify', 'left', 'right']
  },
  '-ms-text-autospace': {
    values: [
      'ideograph-alpha',
      'ideograph-numeric',
      'ideograph-parenthesis',
      'ideograph-space',
      'none',
      'punctuation'
    ]
  },
  '-ms-text-combine-horizontal': {
    values: ['all', 'digits', 'none']
  },
  '-ms-text-justify': {
    values: [
      'auto',
      'distribute',
      'inter-cluster',
      'inter-ideograph',
      'inter-word',
      'kashida'
    ]
  },
  '-ms-text-kashida-space': {},
  '-ms-text-overflow': {
    values: ['clip', 'ellipsis']
  },
  '-ms-text-size-adjust': {
    values: ['auto', 'none']
  },
  '-ms-text-underline-position': {
    values: ['alphabetic', 'auto', 'over', 'under']
  },
  '-ms-touch-action': {
    values: [
      'auto',
      'double-tap-zoom',
      'manipulation',
      'none',
      'pan-x',
      'pan-y',
      'pinch-zoom'
    ]
  },
  '-ms-touch-select': {
    values: ['grippers', 'none']
  },
  '-ms-transform': {
    values: [
      'matrix()',
      'matrix3d()',
      'none',
      'rotate()',
      'rotate3d()',
      "rotateX('angle')",
      "rotateY('angle')",
      "rotateZ('angle')",
      'scale()',
      'scale3d()',
      'scaleX()',
      'scaleY()',
      'scaleZ()',
      'skew()',
      'skewX()',
      'skewY()',
      'translate()',
      'translate3d()',
      'translateX()',
      'translateY()',
      'translateZ()'
    ]
  },
  '-ms-transform-origin': {},
  '-ms-transform-origin-x': {},
  '-ms-transform-origin-y': {},
  '-ms-transform-origin-z': {},
  '-ms-user-select': {
    values: ['element', 'none', 'text']
  },
  '-ms-word-break': {
    values: ['break-all', 'keep-all', 'normal']
  },
  '-ms-word-wrap': {
    values: ['break-word', 'normal']
  },
  '-ms-wrap-flow': {
    values: ['auto', 'both', 'clear', 'end', 'maximum', 'minimum', 'start']
  },
  '-ms-wrap-margin': {},
  '-ms-wrap-through': {
    values: ['none', 'wrap']
  },
  '-ms-writing-mode': {
    values: [
      'bt-lr',
      'bt-rl',
      'lr-bt',
      'lr-tb',
      'rl-bt',
      'rl-tb',
      'tb-lr',
      'tb-rl'
    ]
  },
  '-ms-zoom': {
    values: ['normal']
  },
  '-ms-zoom-animation': {
    values: ['default', 'none']
  },
  'nav-down': {
    values: ['auto', 'current', 'root']
  },
  'nav-index': {
    values: ['auto']
  },
  'nav-left': {
    values: ['auto', 'current', 'root']
  },
  'nav-right': {
    values: ['auto', 'current', 'root']
  },
  'nav-up': {
    values: ['auto', 'current', 'root']
  },
  'negative': {},
  '-o-animation': {
    values: [
      'alternate',
      'alternate-reverse',
      'backwards',
      'both',
      'forwards',
      'infinite',
      'none',
      'normal',
      'reverse'
    ]
  },
  '-o-animation-delay': {},
  '-o-animation-direction': {
    values: ['alternate', 'alternate-reverse', 'normal', 'reverse']
  },
  '-o-animation-duration': {},
  '-o-animation-fill-mode': {
    values: ['backwards', 'both', 'forwards', 'none']
  },
  '-o-animation-iteration-count': {
    values: ['infinite']
  },
  '-o-animation-name': {
    values: ['none']
  },
  '-o-animation-play-state': {
    values: ['paused', 'running']
  },
  '-o-animation-timing-function': {},
  'object-fit': {
    values: ['contain', 'cover', 'fill', 'none', 'scale-down']
  },
  'object-position': {},
  '-o-border-image': {
    values: ['auto', 'fill', 'none', 'repeat', 'round', 'space', 'stretch']
  },
  '-o-object-fit': {
    values: ['contain', 'cover', 'fill', 'none', 'scale-down']
  },
  '-o-object-position': {},
  'opacity': {},
  'order': {},
  'orphans': {},
  '-o-table-baseline': {},
  '-o-tab-size': {},
  '-o-text-overflow': {
    values: ['clip', 'ellipsis']
  },
  '-o-transform': {
    values: [
      'matrix()',
      'matrix3d()',
      'none',
      'rotate()',
      'rotate3d()',
      "rotateX('angle')",
      "rotateY('angle')",
      "rotateZ('angle')",
      'scale()',
      'scale3d()',
      'scaleX()',
      'scaleY()',
      'scaleZ()',
      'skew()',
      'skewX()',
      'skewY()',
      'translate()',
      'translate3d()',
      'translateX()',
      'translateY()',
      'translateZ()'
    ]
  },
  '-o-transform-origin': {},
  '-o-transition': {
    values: ['all', 'none']
  },
  '-o-transition-delay': {},
  '-o-transition-duration': {},
  '-o-transition-property': {
    values: ['all', 'none']
  },
  '-o-transition-timing-function': {},
  'offset-block-end': {
    values: ['auto']
  },
  'offset-block-start': {
    values: ['auto']
  },
  'offset-inline-end': {
    values: ['auto']
  },
  'offset-inline-start': {
    values: ['auto']
  },
  'outline': {
    values: ['auto', 'invert']
  },
  'outline-color': {
    values: ['invert']
  },
  'outline-offset': {},
  'outline-style': {
    values: ['auto']
  },
  'outline-width': {},
  'overflow': {
    values: ['auto', 'hidden', '-moz-hidden-unscrollable', 'scroll', 'visible']
  },
  'overflow-wrap': {
    values: ['break-word', 'normal']
  },
  'overflow-x': {
    values: ['auto', 'hidden', 'scroll', 'visible']
  },
  'overflow-y': {
    values: ['auto', 'hidden', 'scroll', 'visible']
  },
  'pad': {},
  'padding': {
    values: []
  },
  'padding-bottom': {},
  'padding-block-end': {},
  'padding-block-start': {},
  'padding-inline-end': {},
  'padding-inline-start': {},
  'padding-left': {},
  'padding-right': {},
  'padding-top': {},
  'page-break-after': {
    values: ['always', 'auto', 'avoid', 'left', 'right']
  },
  'page-break-before': {
    values: ['always', 'auto', 'avoid', 'left', 'right']
  },
  'page-break-inside': {
    values: ['auto', 'avoid']
  },
  'paint-order': {
    values: ['fill', 'markers', 'normal', 'stroke']
  },
  'perspective': {
    values: ['none']
  },
  'perspective-origin': {},
  'pointer-events': {
    values: [
      'all',
      'fill',
      'none',
      'painted',
      'stroke',
      'visible',
      'visibleFill',
      'visiblePainted',
      'visibleStroke'
    ]
  },
  'position': {
    values: [
      'absolute',
      'fixed',
      '-ms-page',
      'relative',
      'static',
      'sticky',
      '-webkit-sticky'
    ]
  },
  'prefix': {},
  'quotes': {
    values: ['none']
  },
  'range': {
    values: ['auto', 'infinite']
  },
  'resize': {
    values: ['both', 'horizontal', 'none', 'vertical']
  },
  'right': {
    values: ['auto']
  },
  'ruby-align': {
    values: [
      'auto',
      'center',
      'distribute-letter',
      'distribute-space',
      'left',
      'line-edge',
      'right',
      'start',
      'space-between',
      'space-around'
    ]
  },
  'ruby-overhang': {
    values: ['auto', 'end', 'none', 'start']
  },
  'ruby-position': {
    values: ['after', 'before', 'inline', 'right']
  },
  'ruby-span': {
    values: ['attr(x)', 'none']
  },
  'scrollbar-3dlight-color': {},
  'scrollbar-arrow-color': {},
  'scrollbar-base-color': {},
  'scrollbar-darkshadow-color': {},
  'scrollbar-face-color': {},
  'scrollbar-highlight-color': {},
  'scrollbar-shadow-color': {},
  'scrollbar-track-color': {},
  'scroll-behavior': {
    values: ['auto', 'smooth']
  },
  'scroll-snap-coordinate': {
    values: ['none']
  },
  'scroll-snap-destination': {},
  'scroll-snap-points-x': {
    values: ['none', 'repeat()']
  },
  'scroll-snap-points-y': {
    values: ['none', 'repeat()']
  },
  'scroll-snap-type': {
    values: ['none', 'mandatory', 'proximity']
  },
  'shape-image-threshold': {},
  'shape-margin': {},
  'shape-outside': {
    values: ['margin-box', 'none']
  },
  'shape-rendering': {
    values: ['auto', 'crispEdges', 'geometricPrecision', 'optimizeSpeed']
  },
  'size': {},
  'src': {
    values: ['url()', 'format()', 'local()']
  },
  'stop-color': {},
  'stop-opacity': {},
  'stroke': {
    values: ['url()', 'none']
  },
  'stroke-dasharray': {
    values: ['none']
  },
  'stroke-dashoffset': {},
  'stroke-linecap': {
    values: ['butt', 'round', 'square']
  },
  'stroke-linejoin': {
    values: ['bevel', 'miter', 'round']
  },
  'stroke-miterlimit': {},
  'stroke-opacity': {},
  'stroke-width': {},
  'suffix': {},
  'system': {
    values: [
      'additive',
      'alphabetic',
      'cyclic',
      'extends',
      'fixed',
      'numeric',
      'symbolic'
    ]
  },
  'symbols': {},
  'table-layout': {
    values: ['auto', 'fixed']
  },
  'tab-size': {},
  'text-align': {
    values: ['center', 'end', 'justify', 'left', 'right', 'start']
  },
  'text-align-last': {
    values: ['auto', 'center', 'justify', 'left', 'right']
  },
  'text-anchor': {
    values: ['end', 'middle', 'start']
  },
  'text-decoration': {
    values: [
      'dashed',
      'dotted',
      'double',
      'line-through',
      'none',
      'overline',
      'solid',
      'underline',
      'wavy'
    ]
  },
  'text-decoration-color': {},
  'text-decoration-line': {
    values: ['line-through', 'none', 'overline', 'underline']
  },
  'text-decoration-style': {
    values: ['dashed', 'dotted', 'double', 'none', 'solid', 'wavy']
  },
  'text-indent': {
    values: []
  },
  'text-justify': {
    values: [
      'auto',
      'distribute',
      'distribute-all-lines',
      'inter-cluster',
      'inter-ideograph',
      'inter-word',
      'kashida',
      'newspaper'
    ]
  },
  'text-orientation': {
    values: ['sideways', 'sideways-right', 'upright']
  },
  'text-overflow': {
    values: ['clip', 'ellipsis']
  },
  'text-rendering': {
    values: [
      'auto',
      'geometricPrecision',
      'optimizeLegibility',
      'optimizeSpeed'
    ]
  },
  'text-shadow': {
    values: ['none']
  },
  'text-transform': {
    values: ['capitalize', 'lowercase', 'none', 'uppercase']
  },
  'text-underline-position': {
    values: ['above', 'auto', 'below']
  },
  'top': {
    values: ['auto']
  },
  'touch-action': {
    values: [
      'auto',
      'cross-slide-x',
      'cross-slide-y',
      'double-tap-zoom',
      'manipulation',
      'none',
      'pan-x',
      'pan-y',
      'pinch-zoom'
    ]
  },
  'transform': {
    values: [
      'matrix()',
      'matrix3d()',
      'none',
      'perspective()',
      'rotate()',
      'rotate3d()',
      "rotateX('angle')",
      "rotateY('angle')",
      "rotateZ('angle')",
      'scale()',
      'scale3d()',
      'scaleX()',
      'scaleY()',
      'scaleZ()',
      'skew()',
      'skewX()',
      'skewY()',
      'translate()',
      'translate3d()',
      'translateX()',
      'translateY()',
      'translateZ()'
    ]
  },
  'transform-origin': {},
  'transform-style': {
    values: ['flat', 'preserve-3d']
  },
  'transition': {
    values: ['all', 'none']
  },
  'transition-delay': {},
  'transition-duration': {},
  'transition-property': {
    values: ['all', 'none']
  },
  'transition-timing-function': {},
  'unicode-bidi': {
    values: [
      'bidi-override',
      'embed',
      'isolate',
      'isolate-override',
      'normal',
      'plaintext'
    ]
  },
  'unicode-range': {
    values: [
      'U+26',
      'U+20-24F, U+2B0-2FF, U+370-4FF, U+1E00-1EFF, U+2000-20CF, U+2100-23FF, U+2500-26FF, U+E000-F8FF, U+FB00-FB4F',
      'U+20-17F, U+2B0-2FF, U+2000-206F, U+20A0-20CF, U+2100-21FF, U+2600-26FF',
      'U+20-2FF, U+370-4FF, U+1E00-20CF, U+2100-23FF, U+2500-26FF, U+FB00-FB4F, U+FFF0-FFFD',
      'U+20-4FF, U+530-58F, U+10D0-10FF, U+1E00-23FF, U+2440-245F, U+2500-26FF, U+FB00-FB4F, U+FE20-FE2F, U+FFF0-FFFD',
      'U+00-7F',
      'U+80-FF',
      'U+100-17F',
      'U+180-24F',
      'U+1E00-1EFF',
      'U+250-2AF',
      'U+370-3FF',
      'U+1F00-1FFF',
      'U+400-4FF',
      'U+500-52F',
      'U+00-52F, U+1E00-1FFF, U+2200-22FF',
      'U+530-58F',
      'U+590-5FF',
      'U+600-6FF',
      'U+750-77F',
      'U+8A0-8FF',
      'U+700-74F',
      'U+900-97F',
      'U+980-9FF',
      'U+A00-A7F',
      'U+A80-AFF',
      'U+B00-B7F',
      'U+B80-BFF',
      'U+C00-C7F',
      'U+C80-CFF',
      'U+D00-D7F',
      'U+D80-DFF',
      'U+118A0-118FF',
      'U+E00-E7F',
      'U+1A20-1AAF',
      'U+AA80-AADF',
      'U+E80-EFF',
      'U+F00-FFF',
      'U+1000-109F',
      'U+10A0-10FF',
      'U+1200-137F',
      'U+1380-139F',
      'U+2D80-2DDF',
      'U+AB00-AB2F',
      'U+1780-17FF',
      'U+1800-18AF',
      'U+1B80-1BBF',
      'U+1CC0-1CCF',
      'U+4E00-9FD5',
      'U+3400-4DB5',
      'U+2F00-2FDF',
      'U+2E80-2EFF',
      'U+1100-11FF',
      'U+AC00-D7AF',
      'U+3040-309F',
      'U+30A0-30FF',
      'U+A5, U+4E00-9FFF, U+30??, U+FF00-FF9F',
      'U+A4D0-A4FF',
      'U+A000-A48F',
      'U+A490-A4CF',
      'U+2000-206F',
      'U+3000-303F',
      'U+2070-209F',
      'U+20A0-20CF',
      'U+2100-214F',
      'U+2150-218F',
      'U+2190-21FF',
      'U+2200-22FF',
      'U+2300-23FF',
      'U+E000-F8FF',
      'U+FB00-FB4F',
      'U+FB50-FDFF',
      'U+1F600-1F64F',
      'U+2600-26FF',
      'U+1F300-1F5FF',
      'U+1F900-1F9FF',
      'U+1F680-1F6FF'
    ]
  },
  'user-select': {
    values: ['all', 'auto', 'contain', 'none', 'text']
  },
  'vertical-align': {
    values: [
      'auto',
      'baseline',
      'bottom',
      'middle',
      'sub',
      'super',
      'text-bottom',
      'text-top',
      'top',
      '-webkit-baseline-middle'
    ]
  },
  'visibility': {
    values: ['collapse', 'hidden', 'visible']
  },
  '-webkit-animation': {
    values: [
      'alternate',
      'alternate-reverse',
      'backwards',
      'both',
      'forwards',
      'infinite',
      'none',
      'normal',
      'reverse'
    ]
  },
  '-webkit-animation-delay': {},
  '-webkit-animation-direction': {
    values: ['alternate', 'alternate-reverse', 'normal', 'reverse']
  },
  '-webkit-animation-duration': {},
  '-webkit-animation-fill-mode': {
    values: ['backwards', 'both', 'forwards', 'none']
  },
  '-webkit-animation-iteration-count': {
    values: ['infinite']
  },
  '-webkit-animation-name': {
    values: ['none']
  },
  '-webkit-animation-play-state': {
    values: ['paused', 'running']
  },
  '-webkit-animation-timing-function': {},
  '-webkit-appearance': {
    values: [
      'button',
      'button-bevel',
      'caps-lock-indicator',
      'caret',
      'checkbox',
      'default-button',
      'listbox',
      'listitem',
      'media-fullscreen-button',
      'media-mute-button',
      'media-play-button',
      'media-seek-back-button',
      'media-seek-forward-button',
      'media-slider',
      'media-sliderthumb',
      'menulist',
      'menulist-button',
      'menulist-text',
      'menulist-textfield',
      'none',
      'push-button',
      'radio',
      'scrollbarbutton-down',
      'scrollbarbutton-left',
      'scrollbarbutton-right',
      'scrollbarbutton-up',
      'scrollbargripper-horizontal',
      'scrollbargripper-vertical',
      'scrollbarthumb-horizontal',
      'scrollbarthumb-vertical',
      'scrollbartrack-horizontal',
      'scrollbartrack-vertical',
      'searchfield',
      'searchfield-cancel-button',
      'searchfield-decoration',
      'searchfield-results-button',
      'searchfield-results-decoration',
      'slider-horizontal',
      'sliderthumb-horizontal',
      'sliderthumb-vertical',
      'slider-vertical',
      'square-button',
      'textarea',
      'textfield'
    ]
  },
  '-webkit-backdrop-filter': {
    values: [
      'none',
      'blur()',
      'brightness()',
      'contrast()',
      'drop-shadow()',
      'grayscale()',
      'hue-rotate()',
      'invert()',
      'opacity()',
      'saturate()',
      'sepia()',
      'url()'
    ]
  },
  '-webkit-backface-visibility': {
    values: ['hidden', 'visible']
  },
  '-webkit-background-clip': {},
  '-webkit-background-composite': {
    values: ['border', 'padding']
  },
  '-webkit-background-origin': {},
  '-webkit-border-image': {
    values: [
      'auto',
      'fill',
      'none',
      'repeat',
      'round',
      'space',
      'stretch',
      'url()'
    ]
  },
  '-webkit-box-align': {
    values: ['baseline', 'center', 'end', 'start', 'stretch']
  },
  '-webkit-box-direction': {
    values: ['normal', 'reverse']
  },
  '-webkit-box-flex': {},
  '-webkit-box-flex-group': {},
  '-webkit-box-ordinal-group': {},
  '-webkit-box-orient': {
    values: ['block-axis', 'horizontal', 'inline-axis', 'vertical']
  },
  '-webkit-box-pack': {
    values: ['center', 'end', 'justify', 'start']
  },
  '-webkit-box-reflect': {
    values: ['above', 'below', 'left', 'right']
  },
  '-webkit-box-sizing': {
    values: ['border-box', 'content-box']
  },
  '-webkit-break-after': {
    values: [
      'always',
      'auto',
      'avoid',
      'avoid-column',
      'avoid-page',
      'avoid-region',
      'column',
      'left',
      'page',
      'region',
      'right'
    ]
  },
  '-webkit-break-before': {
    values: [
      'always',
      'auto',
      'avoid',
      'avoid-column',
      'avoid-page',
      'avoid-region',
      'column',
      'left',
      'page',
      'region',
      'right'
    ]
  },
  '-webkit-break-inside': {
    values: ['auto', 'avoid', 'avoid-column', 'avoid-page', 'avoid-region']
  },
  '-webkit-column-break-after': {
    values: [
      'always',
      'auto',
      'avoid',
      'avoid-column',
      'avoid-page',
      'avoid-region',
      'column',
      'left',
      'page',
      'region',
      'right'
    ]
  },
  '-webkit-column-break-before': {
    values: [
      'always',
      'auto',
      'avoid',
      'avoid-column',
      'avoid-page',
      'avoid-region',
      'column',
      'left',
      'page',
      'region',
      'right'
    ]
  },
  '-webkit-column-break-inside': {
    values: ['auto', 'avoid', 'avoid-column', 'avoid-page', 'avoid-region']
  },
  '-webkit-column-count': {
    values: ['auto']
  },
  '-webkit-column-gap': {
    values: ['normal']
  },
  '-webkit-column-rule': {},
  '-webkit-column-rule-color': {},
  '-webkit-column-rule-style': {},
  '-webkit-column-rule-width': {},
  '-webkit-columns': {
    values: ['auto']
  },
  '-webkit-column-span': {
    values: ['all', 'none']
  },
  '-webkit-column-width': {
    values: ['auto']
  },
  '-webkit-filter': {
    values: [
      'none',
      'blur()',
      'brightness()',
      'contrast()',
      'drop-shadow()',
      'grayscale()',
      'hue-rotate()',
      'invert()',
      'opacity()',
      'saturate()',
      'sepia()',
      'url()'
    ]
  },
  '-webkit-flow-from': {
    values: ['none']
  },
  '-webkit-flow-into': {
    values: ['none']
  },
  '-webkit-font-feature-settings': {
    values: [
      '"c2cs"',
      '"dlig"',
      '"kern"',
      '"liga"',
      '"lnum"',
      '"onum"',
      '"smcp"',
      '"swsh"',
      '"tnum"',
      'normal',
      'off',
      'on'
    ]
  },
  '-webkit-hyphens': {
    values: ['auto', 'manual', 'none']
  },
  '-webkit-line-break': {
    values: ['after-white-space', 'normal']
  },
  '-webkit-margin-bottom-collapse': {
    values: ['collapse', 'discard', 'separate']
  },
  '-webkit-margin-collapse': {
    values: ['collapse', 'discard', 'separate']
  },
  '-webkit-margin-start': {
    values: ['auto']
  },
  '-webkit-margin-top-collapse': {
    values: ['collapse', 'discard', 'separate']
  },
  '-webkit-mask-clip': {},
  '-webkit-mask-image': {
    values: ['none', 'url()']
  },
  '-webkit-mask-origin': {},
  '-webkit-mask-repeat': {},
  '-webkit-mask-size': {
    values: ['auto', 'contain', 'cover']
  },
  '-webkit-nbsp-mode': {
    values: ['normal', 'space']
  },
  '-webkit-overflow-scrolling': {
    values: ['auto', 'touch']
  },
  '-webkit-padding-start': {},
  '-webkit-perspective': {
    values: ['none']
  },
  '-webkit-perspective-origin': {},
  '-webkit-region-fragment': {
    values: ['auto', 'break']
  },
  '-webkit-tap-highlight-color': {},
  '-webkit-text-fill-color': {},
  '-webkit-text-size-adjust': {
    values: ['auto', 'none']
  },
  '-webkit-text-stroke': {},
  '-webkit-text-stroke-color': {},
  '-webkit-text-stroke-width': {},
  '-webkit-touch-callout': {
    values: ['none']
  },
  '-webkit-transform': {
    values: [
      'matrix()',
      'matrix3d()',
      'none',
      'perspective()',
      'rotate()',
      'rotate3d()',
      "rotateX('angle')",
      "rotateY('angle')",
      "rotateZ('angle')",
      'scale()',
      'scale3d()',
      'scaleX()',
      'scaleY()',
      'scaleZ()',
      'skew()',
      'skewX()',
      'skewY()',
      'translate()',
      'translate3d()',
      'translateX()',
      'translateY()',
      'translateZ()'
    ]
  },
  '-webkit-transform-origin': {},
  '-webkit-transform-origin-x': {},
  '-webkit-transform-origin-y': {},
  '-webkit-transform-origin-z': {},
  '-webkit-transform-style': {
    values: ['flat']
  },
  '-webkit-transition': {
    values: ['all', 'none']
  },
  '-webkit-transition-delay': {},
  '-webkit-transition-duration': {},
  '-webkit-transition-property': {
    values: ['all', 'none']
  },
  '-webkit-transition-timing-function': {},
  '-webkit-user-drag': {
    values: ['auto', 'element', 'none']
  },
  '-webkit-user-modify': {
    values: ['read-only', 'read-write', 'read-write-plaintext-only']
  },
  '-webkit-user-select': {
    values: ['auto', 'none', 'text']
  },
  'widows': {},
  'width': {
    values: ['auto', 'fit-content', 'max-content', 'min-content']
  },
  'will-change': {
    values: ['auto', 'contents', 'scroll-position']
  },
  'word-break': {
    values: ['break-all', 'keep-all', 'normal']
  },
  'word-spacing': {
    values: ['normal']
  },
  'word-wrap': {
    values: ['break-word', 'normal']
  },
  'writing-mode': {
    values: [
      'horizontal-tb',
      'sideways-lr',
      'sideways-rl',
      'vertical-lr',
      'vertical-rl'
    ]
  },
  'z-index': {
    values: ['auto']
  },
  'zoom': {
    values: ['normal']
  },
  '-ms-ime-align': {
    values: ['auto', 'after']
  },
  '-moz-binding': {},
  '-moz-context-properties': {},
  '-moz-float-edge': {
    values: ['border-box', 'content-box', 'margin-box', 'padding-box']
  },
  '-moz-force-broken-image-icon': {
    values: ['0', '1']
  },
  '-moz-image-region': {},
  '-moz-orient': {
    values: ['inline', 'block', 'horizontal', 'vertical']
  },
  '-moz-outline-radius': {},
  '-moz-outline-radius-bottomleft': {},
  '-moz-outline-radius-bottomright': {},
  '-moz-outline-radius-topleft': {},
  '-moz-outline-radius-topright': {},
  '-moz-stack-sizing': {
    values: ['ignore', 'stretch-to-fit']
  },
  '-moz-text-blink': {
    values: ['none', 'blink']
  },
  '-moz-user-input': {
    values: ['auto', 'none', 'enabled', 'disabled']
  },
  '-moz-user-modify': {
    values: ['read-only', 'read-write', 'write-only']
  },
  '-moz-window-dragging': {
    values: ['drag', 'no-drag']
  },
  '-moz-window-shadow': {
    values: ['default', 'menu', 'tooltip', 'sheet', 'none']
  },
  '-webkit-border-before': {},
  '-webkit-border-before-color': {},
  '-webkit-border-before-style': {},
  '-webkit-border-before-width': {},
  '-webkit-line-clamp': {},
  '-webkit-mask': {},
  '-webkit-mask-attachment': {},
  '-webkit-mask-composite': {},
  '-webkit-mask-position': {},
  '-webkit-mask-position-x': {},
  '-webkit-mask-position-y': {},
  '-webkit-mask-repeat-x': {
    values: ['repeat', 'no-repeat', 'space', 'round']
  },
  '-webkit-mask-repeat-y': {
    values: ['repeat', 'no-repeat', 'space', 'round']
  },
  'accent-color': {},
  'align-tracks': {},
  'animation-composition': {},
  'animation-timeline': {},
  'appearance': {},
  'aspect-ratio': {},
  'azimuth': {},
  'backdrop-filter': {},
  'border-block': {},
  'border-block-color': {},
  'border-block-style': {},
  'border-block-width': {},
  'border-end-end-radius': {},
  'border-end-start-radius': {},
  'border-inline': {},
  'border-inline-color': {},
  'border-inline-style': {},
  'border-inline-width': {},
  'border-start-end-radius': {},
  'border-start-start-radius': {},
  'box-align': {
    values: ['start', 'center', 'end', 'baseline', 'stretch']
  },
  'box-direction': {
    values: ['normal', 'reverse', 'inherit']
  },
  'box-flex': {},
  'box-flex-group': {},
  'box-lines': {
    values: ['single', 'multiple']
  },
  'box-ordinal-group': {},
  'box-orient': {
    values: ['horizontal', 'vertical', 'inline-axis', 'block-axis', 'inherit']
  },
  'box-pack': {
    values: ['start', 'center', 'end', 'justify']
  },
  'caret': {},
  'caret-shape': {
    values: ['auto', 'bar', 'block', 'underscore']
  },
  'print-color-adjust': {
    values: ['economy', 'exact']
  },
  'color-scheme': {},
  'contain-intrinsic-size': {},
  'contain-intrinsic-block-size': {},
  'contain-intrinsic-height': {},
  'contain-intrinsic-inline-size': {},
  'contain-intrinsic-width': {},
  'content-visibility': {
    values: ['visible', 'auto', 'hidden']
  },
  'counter-set': {},
  'font-optical-sizing': {
    values: ['auto', 'none']
  },
  'font-variation-settings': {},
  'font-smooth': {},
  'forced-color-adjust': {
    values: ['auto', 'none']
  },
  'gap': {},
  'hanging-punctuation': {},
  'hyphenate-character': {},
  'image-resolution': {},
  'initial-letter': {},
  'initial-letter-align': {},
  'input-security': {
    values: ['auto', 'none']
  },
  'inset': {},
  'inset-block': {},
  'inset-block-end': {},
  'inset-block-start': {},
  'inset-inline': {},
  'inset-inline-end': {},
  'inset-inline-start': {},
  'justify-tracks': {},
  'line-clamp': {},
  'line-height-step': {},
  'margin-block': {},
  'margin-inline': {},
  'margin-trim': {
    values: ['none', 'in-flow', 'all']
  },
  'mask': {},
  'mask-border': {},
  'mask-border-mode': {
    values: ['luminance', 'alpha']
  },
  'mask-border-outset': {},
  'mask-border-repeat': {},
  'mask-border-slice': {},
  'mask-border-source': {},
  'mask-border-width': {},
  'mask-clip': {},
  'mask-composite': {},
  'masonry-auto-flow': {},
  'math-depth': {},
  'math-shift': {
    values: ['normal', 'compact']
  },
  'math-style': {
    values: ['normal', 'compact']
  },
  'max-lines': {},
  'offset': {},
  'offset-anchor': {},
  'offset-distance': {},
  'offset-path': {},
  'offset-position': {},
  'offset-rotate': {},
  'overflow-anchor': {
    values: ['auto', 'none']
  },
  'overflow-block': {
    values: ['visible', 'hidden', 'clip', 'scroll', 'auto']
  },
  'overflow-clip-box': {
    values: ['padding-box', 'content-box']
  },
  'overflow-clip-margin': {},
  'overflow-inline': {
    values: ['visible', 'hidden', 'clip', 'scroll', 'auto']
  },
  'overscroll-behavior': {},
  'overscroll-behavior-block': {
    values: ['contain', 'none', 'auto']
  },
  'overscroll-behavior-inline': {
    values: ['contain', 'none', 'auto']
  },
  'overscroll-behavior-x': {
    values: ['contain', 'none', 'auto']
  },
  'overscroll-behavior-y': {
    values: ['contain', 'none', 'auto']
  },
  'padding-block': {},
  'padding-inline': {},
  'place-content': {},
  'place-items': {},
  'place-self': {},
  'rotate': {},
  'row-gap': {},
  'ruby-merge': {
    values: ['separate', 'collapse', 'auto']
  },
  'scale': {},
  'scrollbar-color': {},
  'scrollbar-gutter': {},
  'scrollbar-width': {
    values: ['auto', 'thin', 'none']
  },
  'scroll-margin': {},
  'scroll-margin-block': {},
  'scroll-margin-block-start': {},
  'scroll-margin-block-end': {},
  'scroll-margin-bottom': {},
  'scroll-margin-inline': {},
  'scroll-margin-inline-start': {},
  'scroll-margin-inline-end': {},
  'scroll-margin-left': {},
  'scroll-margin-right': {},
  'scroll-margin-top': {},
  'scroll-padding': {},
  'scroll-padding-block': {},
  'scroll-padding-block-start': {},
  'scroll-padding-block-end': {},
  'scroll-padding-bottom': {},
  'scroll-padding-inline': {},
  'scroll-padding-inline-start': {},
  'scroll-padding-inline-end': {},
  'scroll-padding-left': {},
  'scroll-padding-right': {},
  'scroll-padding-top': {},
  'scroll-snap-align': {},
  'scroll-snap-stop': {
    values: ['normal', 'always']
  },
  'scroll-snap-type-x': {
    values: ['none', 'mandatory', 'proximity']
  },
  'scroll-snap-type-y': {
    values: ['none', 'mandatory', 'proximity']
  },
  'scroll-timeline': {},
  'scroll-timeline-axis': {
    values: ['block', 'inline', 'vertical', 'horizontal']
  },
  'scroll-timeline-name': {},
  'text-combine-upright': {},
  'text-decoration-skip': {},
  'text-decoration-skip-ink': {
    values: ['auto', 'all', 'none']
  },
  'text-decoration-thickness': {},
  'text-emphasis': {},
  'text-emphasis-color': {},
  'text-emphasis-position': {},
  'text-emphasis-style': {},
  'text-size-adjust': {},
  'text-underline-offset': {},
  'transform-box': {
    values: ['content-box', 'border-box', 'fill-box', 'stroke-box', 'view-box']
  },
  'translate': {},
  'white-space': {
    values: ['normal', 'pre', 'nowrap', 'pre-wrap', 'pre-line', 'break-spaces']
  },
  'speak-as': {},
  'ascent-override': {},
  'descent-override': {},
  'font-display': {},
  'line-gap-override': {},
  'size-adjust': {},
  'bleed': {},
  'marks': {},
  'syntax': {},
  'inherits': {
    values: ['true', 'false']
  },
  'initial-value': {},
  'max-zoom': {},
  'min-zoom': {},
  'orientation': {
    values: ['auto', 'portrait', 'landscape']
  },
  'user-zoom': {
    values: ['zoom', 'fixed']
  },
  'viewport-fit': {
    values: ['auto', 'contain', 'cover']
  }
};

const validate = (editor: any, monaco: any) => {
  const model = editor.getModel();
  const markers = [];
  const lineLen = model.getLineCount();
  for (let i = 1; i < lineLen + 1; i++) {
    const range = {
      startLineNumber: i,
      startColumn: 1,
      endLineNumber: i,
      endColumn: model.getLineLength(i) + 1
    };
    const content: string = model.getValueInRange(range);
    if (content !== '') {
      // 检测是否有冒号
      if (!content.includes(':')) {
        markers.push({
          message: '应为冒号',
          severity: monaco.MarkerSeverity.Error,
          startLineNumber: range.startLineNumber,
          startColumn: range.endColumn,
          endLineNumber: range.endLineNumber,
          endColumn: range.endColumn + 1
        });
      }
      // 检测是否有属性
      else if (/^(.*):\s?;?$/.test(content)) {
        markers.push({
          message: '应为属性',
          severity: monaco.MarkerSeverity.Error,
          startLineNumber: range.startLineNumber,
          startColumn: range.endColumn,
          endLineNumber: range.endLineNumber,
          endColumn: range.endColumn + 1
        });
      }
      // 检测是否以分号结尾
      else if (!content.endsWith(';')) {
        markers.push({
          message: '缺少分号',
          severity: monaco.MarkerSeverity.Error,
          startLineNumber: range.startLineNumber,
          startColumn: range.endColumn,
          endLineNumber: range.endLineNumber,
          endColumn: range.endColumn + 1
        });
      }
    }
  }
  monaco.editor.setModelMarkers(model, 'owner', markers);
};

const editorFactory = (
  containerElement: HTMLElement,
  monaco: any,
  options: any
) => {
  if (!monaco.languages.getEncodedLanguageId('amisTheme')) {
    // 注册语言
    monaco.languages.register({id: 'amisTheme'});
    // 设置高亮
    monaco.languages.setMonarchTokensProvider('amisTheme', conf);
    // 设置提示
    monaco.languages.registerCompletionItemProvider('amisTheme', {
      provideCompletionItems: (model: any, position: any) => {
        const {lineNumber, column} = position;
        // 获取输入前的字符
        const textBeforePointer = model.getValueInRange({
          startLineNumber: lineNumber,
          startColumn: 0,
          endLineNumber: lineNumber,
          endColumn: column
        });
        // 如果已经配置了key和value就不给建议了
        if (/(.*):(.*);/.test(textBeforePointer)) {
          return {suggestions: []};
        }
        const token = /(.*):/.exec(textBeforePointer) || [];
        const valueTip = keywords[token[1]];
        let suggestions;

        // 判断是需要提示key还是value
        if (!isEmpty(valueTip)) {
          suggestions = [
            ...valueTip.values.map((k: string) => ({
              label: k,
              kind: monaco.languages.CompletionItemKind.Enum,
              insertText: k + ';'
            }))
          ];
        } else {
          suggestions = [
            ...Object.keys(keywords).map(k => ({
              label: k,
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: k + ': '
            }))
          ];
        }

        return {
          suggestions: suggestions
        };
      },
      triggerCharacters: [' ']
    });
  }

  const editor = monaco.editor.create(containerElement, {
    ...options,
    'language': 'amisTheme',
    'autoIndent': true,
    'formatOnType': true,
    'formatOnPaste': true,
    'selectOnLineNumbers': true,
    'scrollBeyondLastLine': false,
    'folding': true,
    'minimap': {
      enabled: false
    },
    'scrollbar': {
      alwaysConsumeMouseWheel: false
    },
    'bracketPairColorization.enabled': true,
    'automaticLayout': true,
    'lineNumbers': 'off',
    'glyphMargin': false,
    'wordWrap': 'on',
    'lineDecorationsWidth': 0,
    'lineNumbersMinChars': 0
  });

  editor.onDidChangeModelContent(() => {
    validate(editor, monaco);
    options.onChange && options.onChange(editor.getValue());
  });

  return editor;
};

interface ISingleThemeCssCode extends FormControlProps {
  selector: {
    label: string;
    selector: string;
    isRoot?: boolean;
  };
}

const SingleThemeCssCode = (props: ISingleThemeCssCode) => {
  const {data, onChange, selector: _selector} = props;
  const {label, selector, isRoot} = _selector;
  const {wrapperCustomStyle} = data;
  const ref = useRef<HTMLDivElement>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [value, setValue] = useState('');
  const finalSelector = isRoot ? 'root' : selector;

  useEffect(() => {
    setValue(getCssAndSetValue(wrapperCustomStyle?.[finalSelector], '', 0));
  }, []);

  // 前面加上空格
  const getSpaceByDep = (dep: number) => {
    let spaces = '';
    for (let i = 0; i < dep; i++) {
      spaces += '  ';
    }
    return spaces;
  };

  const getCssAndSetValue = (data: any, str: string, dep: number) => {
    if (isEmpty(data)) {
      return '';
    }
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (isObject(data[key])) {
          str += getSpaceByDep(dep) + `${key} {\n`;
          str += getCssAndSetValue(data[key], '', dep + 1);
          str += getSpaceByDep(dep) + `}\n`;
          if (dep === 0) {
            str += '\n';
          }
        } else {
          str += getSpaceByDep(dep) + `${key}: ${data[key]};\n`;
        }
      }
    }
    return str;
  };

  // 递归获取自定义样式
  const getStyle = (style: any): PlainObject => {
    const newStyle: PlainObject = {};
    if (isEmpty(style)) {
      return newStyle;
    }
    style.nodes.forEach((node: any) => {
      const {prop, value, selector} = node;
      if (value) {
        newStyle[prop] = value;
        if (node.important) {
          newStyle[prop] += ' !important';
        }
      }
      if (node.nodes) {
        newStyle[selector] = getStyle(node);
      }
    });
    return newStyle;
  };

  const editorChange = debounce((value: string) => {
    try {
      const style = cssParse(value);
      const newStyle: PlainObject = getStyle(style);
      onChange && onChange(newStyle);
    } catch (error) {}
  });

  const handleChange = (value: string) => {
    editorChange(value);
    setValue(value);
  };

  const StyleEditor = (
    <>
      <div className="ae-SingleThemeCssCode-header">
        <div className="ae-SingleThemeCssCode-title mtk14">
          {selector + ' {'}
        </div>
      </div>
      <div className="ae-SingleThemeCssCode-content">
        <Editor
          className="ae-SingleThemeCssCode-custom-editor"
          value={value}
          editorFactory={editorFactory}
          onChange={handleChange}
        />
      </div>
      <div className="ae-SingleThemeCssCode-footer mtk14">{'}'}</div>
    </>
  );

  return (
    <>
      <div className="ae-SingleThemeCssCode-label">{label}</div>
      <div ref={ref} className="ae-SingleThemeCssCode">
        <a
          className="ae-SingleThemeCssCode-button ae-SingleThemeCssCode-icon"
          onClick={() => setShowPanel(true)}
        >
          <Icon icon="expand-alt" className="icon" />
        </a>
        {StyleEditor}
      </div>
      <Overlay
        container={document.body}
        placement="left"
        target={ref.current as any}
        show={showPanel}
        rootClose={false}
      >
        <PopOver overlay onHide={() => setShowPanel(false)}>
          <div className="ae-SingleThemeCssCode-panel">
            <div className="ae-SingleThemeCssCode-panel-title">编辑样式</div>
            <div className="ae-SingleThemeCssCode-panel-close">
              <a
                onClick={() => setShowPanel(false)}
                className="ae-SingleThemeCssCode-icon"
              >
                <Icon icon="close" className="icon" />
              </a>
            </div>
            <div className="ae-SingleThemeCssCode-panel-content">
              {StyleEditor}
            </div>
          </div>
        </PopOver>
      </Overlay>
    </>
  );
};

@FormItem({
  type: 'ae-single-theme-cssCode',
  strictMode: false
})
export class SingleThemeCssCodeRenderer extends React.Component<ISingleThemeCssCode> {
  render() {
    return <SingleThemeCssCode {...this.props} />;
  }
}
