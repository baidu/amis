import {registerIcon, Icon} from 'amis-editor-core';

/**
 * 新版组件 icon
 * 备注: 合计 107 个 icon，详细如下:
 * 1. 功能类组件 icon x 11
 * 2. 容器类组件 icon x 12
 * 3. 按钮类组件 icon x 5
 * 4. 展示类组件 icon x 23
 * 5. 表单类组件 icon x 53
 * 6. 其他类组件 icon x 3
 * 7. 常见布局组件 icon x 12
 */

// 功能类组件 icon x 11
import audio from './feat/audio.svg';
import custom from './feat/custom.svg';
import each from './feat/each.svg';
import form from './feat/form.svg';
import nav from './feat/nav.svg';
import qrcode from './feat/qrcode.svg';
import service from './feat/service.svg';
import table from './feat/table.svg';
import tasks from './feat/tasks.svg';
import video from './feat/video.svg';
import wizard from './feat/wizard.svg';

// 容器类组件 icon x 12
import anchorNav from './container/anchor-nav.svg';
import collapse from './container/collapse.svg';
import container from './container/container.svg';
import flexContainer from './container/flex-container.svg';
import formGroup from './container/form-group.svg';
import grid from './container/grid.svg';
import iframe from './container/iframe.svg';
import panel from './container/panel.svg';
import tableView from './container/table-view.svg';
import tabs from './container/tabs.svg';
import webComponent from './container/web-component.svg';
import tooltipWrapper from './container/tooltip-wrapper.svg';

// 按钮类组件 icon x 5
import btnGroup from './btn/btn-group.svg';
import btnSelect from './btn/btn-select.svg';
import btnToolbar from './btn/btn-toolbar.svg';
import button from './btn/button.svg';
import dropdownBtn from './btn/dropdown-btn.svg';

// 展示类组件 icon x 23
import breadcrumb from './show/breadcrumb.svg';
import card from './show/card.svg';
import cards from './show/cards.svg';
import carousel from './show/carousel.svg';
import chart from './show/chart.svg';
import code from './show/code.svg';
import date from './show/date.svg';
import datetime from './show/datetime.svg';
import time from './show/time.svg';
import image from './show/image.svg';
import images from './show/images.svg';
import list from './show/list.svg';
import log from './show/log.svg';
import mapping from './show/mapping.svg';
import avatar from './show/avatar.svg';
import sparkline from './show/sparkline.svg';
import progress from './show/progress.svg';
import jsonView from './show/json-view.svg';
import markdown from './show/markdown.svg';
import steps from './show/steps.svg';
import status from './show/status.svg';
import plain from './show/plain.svg';
import URL from './show/URL.svg';

// 表单类组件 icon x 53
import chainedSelect from './form/chained-select.svg';
import checkbox from './form/checkbox.svg';
import checkboxes from './form/checkboxes.svg';
import combo from './form/combo.svg';
import conditionBuilder from './form/condition-builder.svg';
import diffEditor from './form/diff-editor.svg';
import editor from './form/editor.svg';
import hidden from './form/hidden.svg';
import inputCity from './form/input-city.svg';
import inputColor from './form/input-color.svg';

import inputTimeRange from './form/input-time-range.svg';
import inputDateRange from './form/input-date-range.svg';
import inputMonthRange from './form/input-month-range.svg';
import inputQuarterRange from './form/input-quarter-range.svg';
import inputDate from './form/input-date.svg';
import inputDatetime from './form/input-datetime.svg';
import inputEmail from './form/input-email.svg';
import inputExcel from './form/input-excel.svg';
import inputFile from './form/input-file.svg';
import inputGroup from './form/input-group.svg';

import inputImage from './form/input-image.svg';
import inputKv from './form/input-kv.svg';
import inputNumber from './form/input-number.svg';
import inputPassword from './form/input-password.svg';
import inputRange from './form/input-range.svg';
import inputRating from './form/input-rating.svg';
import inputRepeat from './form/input-repeat.svg';
import inputRichText from './form/input-rich-text.svg';
import inputTag from './form/input-tag.svg';
import inputText from './form/input-text.svg';

import inputTime from './form/input-time.svg';
import inputTree from './form/input-tree.svg';
import inputUrl from './form/input-url.svg';
import inputYear from './form/input-year.svg';
import listSelect from './form/list-select.svg';
import locationPicker from './form/location-picker.svg';
import matrixCheckboxes from './form/matrix-checkboxes.svg';
import month from './form/month.svg';
import nestedSelect from './form/nested-select.svg';
import picker from './form/picker.svg';

import quarter from './form/quarter.svg';
import radios from './form/radios.svg';
import select from './form/select.svg';
import staticIcon from './form/static.svg';
import subForm from './form/sub-form.svg';
import switchIcon from './form/switch.svg';
import tabsTransfer from './form/tabs-transfer.svg';
import textarea from './form/textarea.svg';
import transfer from './form/transfer.svg';
import treeSelect from './form/tree-select.svg';

import uuid from './form/uuid.svg';
import formula from './form/formula.svg';
import inputArray from './form/inputArray.svg';

// 其他类组件 icon x 3
import propertySheet from './other/property-sheet.svg';
import tooltip from './other/tooltip.svg';
import divider from './other/divider.svg';

// 常见布局组件 icon x 12
import layout_absolute from './layout/layout-absolute.svg';
import layout_fixed from './layout/layout-fixed.svg';
import layout_1with2 from './layout/layout-1with2.svg';
import layout_2cols from './layout/layout-2cols.svg';
import layout_2row from './layout/layout-2row.svg';
import layout_2with1 from './layout/layout-2with1.svg';
import layout_3cols from './layout/layout-3cols.svg';
import layout_3row from './layout/layout-3row.svg';
import layout_full from './layout/layout-full.svg';
import layout_1_2 from './layout/layout1-2.svg';
import layout_2_1 from './layout/layout2-1.svg';
import layout_3_1 from './layout/layout3-1.svg';
import layout_3_2 from './layout/layout3-2.svg';

// 功能类组件 icon x 11
registerIcon('audio-plugin', audio);
registerIcon('custom-plugin', custom);
registerIcon('each-plugin', each);
registerIcon('form-plugin', form);
registerIcon('nav-plugin', nav);
registerIcon('qrcode-plugin', qrcode);
registerIcon('service-plugin', service);
registerIcon('table-plugin', table);
registerIcon('tasks-plugin', tasks);
registerIcon('video-plugin', video);
registerIcon('wizard-plugin', wizard);

// 容器类组件 icon x 10
registerIcon('anchor-nav-plugin', anchorNav);
registerIcon('collapse-plugin', collapse);
registerIcon('flex-container-plugin', flexContainer);
registerIcon('container-plugin', container);
registerIcon('form-group-plugin', formGroup);
registerIcon('panel-plugin', panel);
registerIcon('grid-plugin', grid);
registerIcon('iframe-plugin', iframe);
registerIcon('table-view-plugin', tableView);
registerIcon('tabs-plugin', tabs);
registerIcon('web-component-plugin', webComponent);
registerIcon('tooltip-wrapper-plugin', tooltipWrapper);

// 按钮类组件 icon x5
registerIcon('btn-group-plugin', btnGroup);
registerIcon('btn-select-plugin', btnSelect);
registerIcon('btn-toolbar-plugin', btnToolbar);
registerIcon('button-plugin', button);
registerIcon('dropdown-btn-plugin', dropdownBtn);

// 展示类组件 icon x 23
registerIcon('breadcrumb-plugin', breadcrumb);
registerIcon('card-plugin', card);
registerIcon('cards-plugin', cards);
registerIcon('carousel-plugin', carousel);
registerIcon('chart-plugin', chart);
registerIcon('code-plugin', code);
registerIcon('date-plugin', date);
registerIcon('datetime-plugin', datetime);
registerIcon('time-plugin', time);
registerIcon('image-plugin', image);
registerIcon('images-plugin', images);
registerIcon('list-plugin', list);
registerIcon('log-plugin', log);
registerIcon('mapping-plugin', mapping);
registerIcon('sparkline-plugin', sparkline);
registerIcon('avatar-plugin', avatar);
registerIcon('progress-plugin', progress);
registerIcon('json-view-plugin', jsonView);
registerIcon('markdown-plugin', markdown);
registerIcon('steps-plugin', steps);
registerIcon('status-plugin', status);
registerIcon('plain-plugin', plain);
registerIcon('url-plugin', URL);

// 表单类组件 icon x 53
registerIcon('chained-select-plugin', chainedSelect);
registerIcon('checkbox-plugin', checkbox);
registerIcon('checkboxes-plugin', checkboxes);
registerIcon('combo-plugin', combo);
registerIcon('condition-builder-plugin', conditionBuilder);
registerIcon('diff-editor-plugin', diffEditor);
registerIcon('editor-plugin', editor);
registerIcon('hidden-plugin', hidden);
registerIcon('input-city-plugin', inputCity);
registerIcon('input-color-plugin', inputColor);
registerIcon('input-date-range-plugin', inputDateRange);
registerIcon('input-date-plugin', inputDate);
registerIcon('input-datetime-plugin', inputDatetime);
registerIcon('input-email-plugin', inputEmail);
registerIcon('input-excel-plugin', inputExcel);

registerIcon('input-file-plugin', inputFile);
registerIcon('input-group-plugin', inputGroup);
registerIcon('input-image-plugin', inputImage);
registerIcon('input-kv-plugin', inputKv);
registerIcon('input-month-range-plugin', inputMonthRange);
registerIcon('input-number-plugin', inputNumber);
registerIcon('input-password-plugin', inputPassword);
registerIcon('input-quarter-range-plugin', inputQuarterRange);
registerIcon('input-range-plugin', inputRange);
registerIcon('input-rating-plugin', inputRating);
registerIcon('input-repeat-plugin', inputRepeat);
registerIcon('input-rich-text-plugin', inputRichText);
registerIcon('input-tag-plugin', inputTag);
registerIcon('input-text-plugin', inputText);
registerIcon('input-time-range-plugin', inputTimeRange);

registerIcon('input-time-plugin', inputTime);
registerIcon('input-tree-plugin', inputTree);
registerIcon('input-url-plugin', inputUrl);
registerIcon('input-year-plugin', inputYear);
registerIcon('list-select-plugin', listSelect);
registerIcon('location-picker-plugin', locationPicker);
registerIcon('matrix-checkboxes-plugin', matrixCheckboxes);
registerIcon('month-plugin', month);
registerIcon('nested-select-plugin', nestedSelect);
registerIcon('picker-plugin', picker);
registerIcon('quarter-plugin', quarter);
registerIcon('radios-plugin', radios);
registerIcon('select-plugin', select);
registerIcon('static-plugin', staticIcon);
registerIcon('sub-form-plugin', subForm);

registerIcon('switch-plugin', switchIcon);
registerIcon('tabs-transfer-plugin', tabsTransfer);
registerIcon('textarea-plugin', textarea);
registerIcon('transfer-plugin', transfer);
registerIcon('tree-select-plugin', treeSelect);
registerIcon('uuid-plugin', uuid);
registerIcon('input-array-plugin', inputArray); // 暂时没用上
registerIcon('formula-plugin', formula);

// 其他类组件 icon
registerIcon('property-sheet-plugin', propertySheet);
registerIcon('tooltip-plugin', tooltip);
registerIcon('divider-plugin', divider);

// 常见布局组件 icon x 13
registerIcon('layout-absolute-plugin', layout_absolute);
registerIcon('layout-fixed-plugin', layout_fixed);
registerIcon('layout-1with2-plugin', layout_1with2);
registerIcon('layout-2cols-plugin', layout_2cols);
registerIcon('layout-2row-plugin', layout_2row);
registerIcon('layout-2with1-plugin', layout_2with1);
registerIcon('layout-3cols-plugin', layout_3cols);
registerIcon('layout-3row-plugin', layout_3row);
registerIcon('layout-full-plugin', layout_full);
registerIcon('layout-1-2-plugin', layout_1_2);
registerIcon('layout-2-1-plugin', layout_2_1);
registerIcon('layout-3-1-plugin', layout_3_1);
registerIcon('layout-3-2-plugin', layout_3_2);

export {Icon};
