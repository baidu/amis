/** @license amis v@version
 *
 * Copyright Baidu
 *
 * This source code is licensed under the Apache license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {
  render,
  Renderer,
  getRendererByName,
  resolveRenderer,
  filterSchema,
  clearStoresCache,
  updateEnv
} from './factory';
import { wrapFetcher, buildApi } from './utils/api';
import {
  filter,
  registerTplEnginer,
  evalExpression,
  evalJS,
  setCustomEvalJs,
  setCustomEvalExpression
} from './utils/tpl';
import * as utils from './utils/helper';
import { resizeSensor } from './utils/resize-sensor';
import { setIconVendor } from './renderers/Form/IconPickerIcons';
import { Icon, registerIcon } from './components/icons';
import { RegisterStore } from './store';
import {
  setDefaultLocale,
  getDefaultLocale,
  makeTranslator,
  register as registerLocale
} from './locale';

// 注册渲染器
import './renderers/Action';
import './renderers/Alert';
import './renderers/Remark';
import './renderers/ButtonGroup';
import './renderers/ButtonToolbar';
import './renderers/DropDownButton';
import './renderers/Collapse';
import './renderers/Color';
import './renderers/CRUD';
import './renderers/Pagination';
import './renderers/Cards';
import './renderers/Card';
import './renderers/Date';
import './renderers/Dialog';
import './renderers/Divider';
import './renderers/Each';
import './renderers/Form/index';
import './renderers/Form/Control';
import './renderers/Form/Hidden';
import './renderers/Form/Text';
import './renderers/Form/Tag';
import './renderers/Form/Number';
import './renderers/Form/Textarea';
import './renderers/Form/Checkboxes';
import './renderers/Form/Checkbox';
import './renderers/Form/City';
import './renderers/Form/Rating';
import './renderers/Form/Switch';
import './renderers/Form/Button';
import './renderers/Form/ButtonGroup';
import './renderers/Form/ButtonToolbar';
import './renderers/Form/Radios';
import './renderers/Form/List';
import './renderers/Form/Location';
import './renderers/Form/Select';
import './renderers/Form/Static';
import './renderers/Form/Date';
import './renderers/Form/DateRange';
import './renderers/Form/Repeat';
import './renderers/Form/Tree';
import './renderers/Form/TreeSelect';
import './renderers/Form/Image';
import './renderers/Form/File';
import './renderers/Form/Matrix';
import './renderers/Form/Range';
import './renderers/Form/Array';
import './renderers/Form/Combo';
import './renderers/Form/ConditionBuilder';
import './renderers/Form/Container';
import './renderers/Form/SubForm';
import './renderers/Form/RichText';
import './renderers/Form/Editor';
import './renderers/Form/DiffEditor';
import './renderers/Form/Grid';
import './renderers/Form/HBox';
import './renderers/Form/Panel';
import './renderers/Form/Color';
import './renderers/Form/ChainedSelect';
import './renderers/Form/NestedSelect';
import './renderers/Form/Transfer';
import './renderers/Form/Service';
import './renderers/Form/Table';
import './renderers/Form/Picker';
import './renderers/Form/IconPicker';
import './renderers/Form/Formula';
import './renderers/Form/FieldSet';
import './renderers/Form/Tabs';
import './renderers/Form/TabsTransfer';
import './renderers/Form/Group';
import './renderers/Form/InputGroup';
import './renderers/Grid';
import './renderers/HBox';
import './renderers/VBox';
import './renderers/Image';
import './renderers/Images';
import './renderers/List';
import './renderers/Operation';
import './renderers/Page';
import './renderers/Panel';
import './renderers/Plain';
import './renderers/Spinner';
import './renderers/Table/index';
import './renderers/Tabs';
import './renderers/Tpl';
import './renderers/Mapping';
import './renderers/Progress';
import './renderers/Status';
import './renderers/Json';
import './renderers/Link';
import './renderers/Switch';
import './renderers/Wizard';
import './renderers/Chart';
import './renderers/Container';
import './renderers/Service';
import './renderers/Video';
import './renderers/Audio';
import './renderers/Nav';
import './renderers/Tasks';
import './renderers/Drawer';
import './renderers/Wrapper';
import './renderers/IFrame';
import './renderers/QRCode';
import './renderers/Icon';
import './renderers/Carousel';
import Scoped, { ScopedContext } from './Scoped';

import { FormItem } from './renderers/Form/Item';

// 兼容旧版本用法
import './compat';

import './themes/default';
import './themes/cxd';
import './themes/dark';
import {
  registerFilter,
  filterDate,
  relativeValueRe,
  resolveVariable,
  resolveVariableAndFilter
} from './utils/tpl-builtin';
import {
  addRule,
  str2rules,
  validate,
  validateObject
} from './utils/validations';
import { normalizeOptions } from './components/Select';
import { OptionsControl } from './renderers/Form/Options';

import {
  classnames,
  getClassPrefix,
  setDefaultTheme,
  theme,
  getTheme
} from './theme';
const classPrefix = getClassPrefix();

export * from './components/index';

export {
  render,
  clearStoresCache,
  updateEnv,
  Renderer,
  RegisterStore,
  FormItem,
  OptionsControl,
  wrapFetcher,
  buildApi,
  filter,
  // 其他功能类方法
  utils,
  resizeSensor,
  registerFilter,
  registerTplEnginer,
  evalExpression,
  evalJS,
  setCustomEvalJs,
  setCustomEvalExpression,
  addRule,
  str2rules,
  normalizeOptions,
  getRendererByName,
  resolveRenderer,
  filterSchema,
  filterDate,
  relativeValueRe,
  resolveVariable,
  resolveVariableAndFilter,
  setIconVendor,
  Icon,
  registerIcon,
  Scoped,
  ScopedContext,
  validate,
  validateObject,
  setDefaultTheme,
  theme,
  getTheme,
  classPrefix,
  getClassPrefix,
  classnames,
  // 多语言相关
  getDefaultLocale,
  setDefaultLocale,
  registerLocale,
  makeTranslator
};
