import {registerIcon, Icon} from 'amis';

import CheckboxCheck from './checkbox-check.svg';
import Checkbox from './checkbox.svg';
import Code from './code.svg';
import Component from './component.svg';
import Global from './global.svg';
import Custom from './custom.svg';
import Lock from './lock.svg';
import Unlock from './unlock.svg';
import Italic from './italic.svg';
import Underline from './underline.svg';
import LineThrough from './line-through.svg';
import textLeft from './text-left.svg';
import textCenter from './text-center.svg';
import textRight from './text-right.svg';
import textJustify from './text-justify.svg';
import verticalTop from './vertical-top.svg';
import verticalMiddle from './vertical-middle.svg';
import verticalBottom from './vertical-bottom.svg';

registerIcon('checkbox-check', CheckboxCheck);
registerIcon('checkbox', Checkbox);
registerIcon('code', Code);
registerIcon('component', Component);
registerIcon('global', Global);
registerIcon('custom', Custom);
registerIcon('lock', Lock);
registerIcon('unlock', Unlock);
registerIcon('italic', Italic);
registerIcon('underline', Underline);
registerIcon('line-through', LineThrough);
registerIcon('text-align-left', textLeft);
registerIcon('text-align-center', textCenter);
registerIcon('text-align-right', textRight);
registerIcon('text-align-justify', textJustify);
registerIcon('vertical-align-top', verticalTop);
registerIcon('vertical-align-middle', verticalMiddle);
registerIcon('vertical-align-bottom', verticalBottom);

import AddButton from './add-button.svg';
registerIcon('add-button', AddButton);

import DeleteButton from './delete-button.svg';
registerIcon('delete-button', DeleteButton);

// 颜色选择器
import ColorPickerImg from './color-picker-img.svg';
import ColorPickerImgActive from './color-picker-img-active.svg';

registerIcon('color-picker-img', ColorPickerImg);
registerIcon('color-picker-img-active', ColorPickerImgActive);

export {Icon};
