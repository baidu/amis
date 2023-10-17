/** @license amis v@version
 *
 * Copyright Baidu
 *
 * This source code is licensed under the Apache license found in the
 * LICENSE file in the root directory of this source tree.
 */
export * from 'amis-core';
export * from 'amis-ui';

import './preset';

// 注册渲染器
import './renderers/Action';
import './renderers/Alert';
import './renderers/App';
import './renderers/Avatar';
import './renderers/Remark';
import './renderers/ButtonGroup';
import './renderers/Form/ButtonToolbar';
import './renderers/Breadcrumb';
import './renderers/DropDownButton';
import './renderers/Calendar';
import './renderers/Collapse';
import './renderers/CollapseGroup';
import './renderers/Color';
import './renderers/CRUD';
import './renderers/CRUD2';
import './renderers/Pagination';
import './renderers/Cards';
import './renderers/Card';
import './renderers/Card2';
import './renderers/Custom';
import './renderers/Date';
import './renderers/Dialog';
import './renderers/Divider';
import './renderers/Each';
import './renderers/Flex';
import './renderers/Form/Control';
import './renderers/Form/Hidden';
import './renderers/Form/InputText';
import './renderers/Form/InputTag';
import './renderers/Form/InputNumber';
import './renderers/Form/Textarea';
import './renderers/Form/Checkboxes';
import './renderers/Form/Checkbox';
import './renderers/Form/InputCity';
import './renderers/Form/ChartRadios';
import './renderers/Form/InputRating';
import './renderers/Form/Switch';
import './renderers/Form/Radios';
import './renderers/Form/Radio';
import './renderers/Form/JSONSchema';
import './renderers/Form/JSONSchemaEditor';
import './renderers/Form/ListSelect';
import './renderers/Form/LocationPicker';
import './renderers/Form/Select';
import './renderers/Form/Static';
import './renderers/Form/InputDate';
import './renderers/Form/InputDateRange';
import './renderers/Form/InputFormula';
import './renderers/Form/InputRepeat';
import './renderers/Form/InputTree';
import './renderers/Form/TreeSelect';
import './renderers/Form/InputImage';
import './renderers/Form/InputFile';
import './renderers/Form/UUID';
import './renderers/Form/MatrixCheckboxes';
import './renderers/Form/InputMonthRange';
import './renderers/Form/InputQuarterRange';
import './renderers/Form/InputYearRange';
import './renderers/Form/InputRange';
import './renderers/Form/InputArray';
import './renderers/Form/Combo';
import './renderers/Form/ConditionBuilder';
import './renderers/Form/InputSubForm';
import './renderers/Form/InputExcel';
import './renderers/Form/InputRichText';
import './renderers/Form/Editor';
import './renderers/Form/DiffEditor';
import './renderers/Form/InputColor';
import './renderers/Form/ChainedSelect';
import './renderers/Form/NestedSelect';
import './renderers/Form/Transfer';
import './renderers/Form/TransferPicker';
import './renderers/Form/InputTable';
import './renderers/Form/Picker';
import './renderers/Form/IconPicker';
import './renderers/Form/IconSelect';
import './renderers/Form/Formula';
import './renderers/Form/FieldSet';
import './renderers/Form/TabsTransfer';
import './renderers/Form/TabsTransferPicker';
import './renderers/Form/Group';
import './renderers/Form/InputGroup';
import './renderers/Form/UserSelect';
import './renderers/Grid';
import './renderers/Grid2D';
import './renderers/HBox';
import './renderers/VBox';
import './renderers/Image';
import './renderers/Images';
import './renderers/List';
import './renderers/Log';
import './renderers/Operation';
import './renderers/Page';
import './renderers/PaginationWrapper';
import './renderers/Panel';
import './renderers/Plain';
import './renderers/Property';
import './renderers/Portlet';
import './renderers/Spinner';
import './renderers/Table/index';
import './renderers/Tabs';
import './renderers/Tpl';
import './renderers/Mapping';
import './renderers/Progress';
import './renderers/Status';
import './renderers/Json';
import './renderers/Link';
import './renderers/Wizard';
import './renderers/Chart';
import './renderers/Container';
import './renderers/SwitchContainer';
import './renderers/SearchBox';
import './renderers/Service';
import './renderers/SparkLine';
import './renderers/Video';
import './renderers/Audio';
import './renderers/Nav';
import './renderers/Number';
import './renderers/Tasks';
import './renderers/Drawer';
import './renderers/Wrapper';
import './renderers/IFrame';
import './renderers/BarCode';
import './renderers/QRCode';
import './renderers/Icon';
import './renderers/Carousel';
import './renderers/AnchorNav';
import './renderers/Steps';
import './renderers/Timeline';
import './renderers/Markdown';
import './renderers/TableView';
import './renderers/Code';
import './renderers/WebComponent';
import './renderers/GridNav';
import './renderers/TooltipWrapper';
import './renderers/Tag';
import './renderers/Table2/index';
import './renderers/Words';
import './renderers/Password';
import './renderers/DateRange';
import './renderers/MultilineText';
import './renderers/OfficeViewer';
import './renderers/AMIS';

import './compat';
import './schemaExtend';
import type {
  BaseSchema,
  FormSchema,
  SchemaApi,
  SchemaCollection,
  SchemaExpression,
  SchemaObject
} from './Schema';
import type {TableViewSchema, TrObject} from './renderers/TableView';
import type {ActionSchema, ButtonSchema} from './renderers/Action';
import type {CRUDCommonSchema} from './renderers/CRUD';
import type {CRUD2Schema} from './renderers/CRUD2';
import type {TabsSchema} from './renderers/Tabs';
import {availableLanguages as EditorAvailableLanguages} from './renderers/Form/Editor';
import type {Action} from './types';
export * from './renderers/Form/IconPickerIcons';
export * from './renderers/Form/IconSelectStore';

export {
  BaseSchema,
  SchemaCollection,
  FormSchema,
  SchemaApi,
  SchemaObject,
  TableViewSchema,
  TrObject,
  ActionSchema,
  CRUDCommonSchema,
  ButtonSchema,
  CRUD2Schema,
  TabsSchema,
  SchemaExpression,
  Action,
  EditorAvailableLanguages
};
