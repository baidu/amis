import {registerIcon, Icon} from 'amis';
import ArrowToRight from './arrow-to-right.svg';
import LeftArrowToleft from './left-arrow-to-left.svg';
import TopArrowToTop from './top-arrow-to-top.svg';
import ArrowToBottom from './arrow-to-bottom.svg';
import CollapseOpen from './collapse-open-icon.svg';
import DisplayInline from './display-inline.svg';
import DisplayBlock from './display-block.svg';
import DisplayInlineBlock from './display-inline-block.svg';
import DisplayFlex from './display-flex.svg';
import Harmmer from './hammer.svg';
import Dialog from './dialog.svg';
import API from './api.svg';

registerIcon('arrow-to-right', ArrowToRight);
registerIcon('left-arrow-to-left', LeftArrowToleft);
registerIcon('top-arrow-to-top', TopArrowToTop);
registerIcon('arrow-to-bottom', ArrowToBottom);
registerIcon('collapse-open', CollapseOpen);
registerIcon('harmmer', Harmmer);
registerIcon('dialog', Dialog);
registerIcon('api', API);

// 「页面设计器改版」设计侧提供的icon（组件头部工具栏icon）
import CopyBtn from './copy-btn.svg';
import MoreBtn from './more-btn.svg';
import DeleteBtn from './delete-btn.svg';
import DragBtn from './drag-btn.svg';
import UpBtn from './up-btn.svg';
import ClearBtn from './clear.svg';

import MergeIcon from './merge-icon.svg';
import CancelIcon from './cancel-icon.svg';
import CopyIcon from './copy-icon.svg';
import DeleteIcon from './delete-icon.svg';
import FixedIcon from './fixed.svg';
import NoFixedIcon from './no-fixed.svg';

// 3.0 升级 相关icon
import BackUpBtn from './v3/back-up.svg';
import DownArrow from './v3/down-arrow.svg';
import EditorSearch from './v3/search.svg';
import EditorHelp from './v3/editor-help.svg';
import EditorFixed from './v3/fixed.svg';
import EditorNoFixed from './v3/no-fixed.svg';
import EditorRenderer from './v3/renderer.svg';
import EditorOutline from './v3/outline.svg';
import EditorCode from './v3/code.svg';
import EditorCommonConfig from './v3/common-config.svg';
import EditorDoubleArrow from './v3/right-double-arrow.svg';
import SearchClear from './v3/search-clear.svg';
import Shortcut from './v3/shortcut.svg';

registerIcon('drag-btn', DragBtn);
registerIcon('more-btn', MoreBtn);
registerIcon('copy-btn', CopyBtn);
registerIcon('delete-btn', DeleteBtn);
registerIcon('up-btn', UpBtn);
registerIcon('clear-btn', ClearBtn);
registerIcon('open-btn', DownArrow);

registerIcon('merge-icon', MergeIcon);
registerIcon('cancel-icon', CancelIcon);
registerIcon('copy-icon', CopyIcon);
registerIcon('delete-icon', DeleteIcon);
registerIcon('fixed-icon', FixedIcon);
registerIcon('no-fixed-icon', NoFixedIcon);
registerIcon('editor-shortcut', Shortcut);

// 外观-显示类型
registerIcon('display-inline', DisplayInline);
registerIcon('display-block', DisplayBlock);
registerIcon('display-inline-block', DisplayInlineBlock);
registerIcon('display-flex', DisplayFlex);
registerIcon('back-up', BackUpBtn);
registerIcon('down-arrow', DownArrow);
registerIcon('editor-search', EditorSearch);
registerIcon('editor-help', EditorHelp);
registerIcon('editor-fixed', EditorFixed);
registerIcon('editor-no-fixed', EditorNoFixed);
registerIcon('editor-renderer', EditorRenderer);
registerIcon('editor-outline', EditorOutline);
registerIcon('editor-code', EditorCode);
registerIcon('editor-common-config', EditorCommonConfig);
registerIcon('editor-double-arrow', EditorDoubleArrow);
registerIcon('search-clear', SearchClear);

export {Icon};
