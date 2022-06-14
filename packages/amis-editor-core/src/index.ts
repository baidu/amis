/**
 * @file 总入口
 */
import Editor from './component/Editor';
import './component/ClassNameControl';
import './component/control/OptionControl';
import './component/control/APIControl';
import './component/control/ValidationControl';
import './component/control/ValidationItem';
import './component/control/SwitchMoreControl';
import './component/control/StatusControl';
import './component/control/FormulaControl';
import './component/control/DateShortCutControl';
import './component/control/BadgeControl';
import './component/control/style-control/BoxModel';
import './component/control/style-control/Font';
import './component/control/style-control/Border';
import './component/control/style-control/BoxShadow';
import './component/control/style-control/Background';
import './component/control/style-control/Display';
import './component/control/RangePartsControl';
import './component/control/DataBindingControl';
import './component/control/DataMappingControl';
import './component/control/DataPickerControl';

// 引入editor公共组件
import 'amis-editor-comp';
import 'amis-editor-comp/dist/index.css';

import './plugin/Others/BasicToolbar';
import './plugin/Others/Unknown';
import './plugin/Others/Action';
import './plugin/Others/TableCell';
import './plugin/Others/DataDebug';
import './plugin/Panel/AvailableRenderers';
import './plugin/Panel/Code';
import './plugin/Panel/Outline';
import './plugin/Panel/Name';
import './plugin/ErrorRenderer';
import './plugin/Form/InputArray';
import './plugin/Form/ButtonGroupSelect';
import './plugin/Form/ButtonToolbar';
import './plugin/Form/ChainedSelect';
import './plugin/Form/Checkbox';
import './plugin/Form/Checkboxes';
import './plugin/Form/InputCity';
import './plugin/Form/InputColor';
import './plugin/Form/Combo';
import './plugin/Form/ConditionBuilder';
import './plugin/Form/Control';
import './plugin/Form/InputDate';
import './plugin/Form/InputDateRange';
import './plugin/Form/InputDateTime';
import './plugin/Form/InputDateTimeRange';
import './plugin/Form/DiffEditor';
import './plugin/Form/CodeEditor';
import './plugin/Form/InputEmail';
import './plugin/Form/FieldSet';
import './plugin/Form/InputFile';
import './plugin/Form/Form';
import './plugin/Form/Formula';
import './plugin/Form/Group';
import './plugin/Form/Hidden';
import './plugin/Form/InputImage';
import './plugin/Form/InputGroup';
import './plugin/Form/Item';
import './plugin/Form/ListSelect';
import './plugin/Form/LocationPicker';
import './plugin/Form/UUID';
import './plugin/Form/MatrixCheckboxes';
import './plugin/Form/InputMonth';
import './plugin/Form/InputMonthRange';
import './plugin/Form/NestedSelect';
import './plugin/Form/InputNumber';
import './plugin/Form/InputPassword';
import './plugin/Form/InputQuarter';
import './plugin/Form/InputQuarterRange';
import './plugin/Form/Picker';
import './plugin/Form/Radios';
import './plugin/Form/InputRange';
import './plugin/Form/InputRating';
import './plugin/Form/InputRepeat';
import './plugin/Form/InputRichText';
import './plugin/Form/Select';
import './plugin/Form/Static';
import './plugin/Form/InputSubForm';
import './plugin/Form/Switch';
import './plugin/Form/InputTable';
import './plugin/Form/InputTag';
import './plugin/Form/InputText';
import './plugin/Form/TabsTransfer';
import './plugin/Form/Textarea';
import './plugin/Form/Transfer';
import './plugin/Form/InputTime';
import './plugin/Form/InputTimeRange';
import './plugin/Form/InputTree';
import './plugin/Form/TreeSelect';
import './plugin/Form/InputURL';
import './plugin/Form/InputYear';
import './plugin/Form/InputYearRange';
import './plugin/Form/InputExcel';
import './plugin/Form/InputKV';
import './plugin/Alert';
import './plugin/Audio';
import './plugin/Avatar';
import './plugin/Button';
import './plugin/ButtonGroup';
import './plugin/ButtonToolbar';
import './plugin/Breadcrumb';
import './plugin/Card';
import './plugin/Cards';
import './plugin/Carousel';
import './plugin/Chart';
import './plugin/Collapse';
import './plugin/CollapseGroup';
import './plugin/Container';
import './plugin/CRUD';
import './plugin/Custom';
import './plugin/CustomRegion';
import './plugin/Date';
import './plugin/Datetime';
import './plugin/Dialog';
import './plugin/Divider';
import './plugin/Drawer';
import './plugin/DropDownButton';
import './plugin/Each';
import './plugin/Flex';
import './plugin/Grid';
import './plugin/HBox';
import './plugin/IFrame';
import './plugin/Image';
import './plugin/Images';
import './plugin/Json';
import './plugin/Link';
import './plugin/List';
import './plugin/ListItem';
import './plugin/Log';
import './plugin/Mapping';
import './plugin/Markdown';
import './plugin/Nav';
import './plugin/Operation';
import './plugin/Page';
import './plugin/Pagination';
import './plugin/Panel';
import './plugin/Plain';
import './plugin/Progress';
import './plugin/Property';
import './plugin/QRCode';
import './plugin/Reset';
import './plugin/Service';
import './plugin/Status';
import './plugin/Steps';
import './plugin/Sparkline';
import './plugin/Submit';
import './plugin/Table';
import './plugin/Tabs';
import './plugin/Tasks';
import './plugin/Time';
import './plugin/Tpl';
import './plugin/AnchorNav';
import './plugin/Video';
import './plugin/Wizard';
import './plugin/Wrapper';
import './plugin/TooltipWrapper';
import './plugin/TableView';
import './plugin/CodeView';
import './plugin/WebComponent';

import * as utils from './util';
import {getSchemaTpl, defaultValue, setSchemaTpl} from './component/schemaTpl';
import {
  registerEditorPlugin,
  unRegisterEditorPlugin,
  getEditorPlugins
} from './manager';
import {BasePlugin} from './plugin';
import {BasicEditor, RendererEditor} from './compat';
import MiniEditor from './component/MiniEditor';
import CodeEditor from './component/Panel/AMisCodeEditor';
import IFramePreview from './component/IFramePreview';
import {mountInIframe} from './component/IFrameBridge';
import {AvailableRenderersPlugin} from './plugin/Panel/AvailableRenderers';
import SearchPanel from './component/base/SearchPanel';
import {BasicToolbarPlugin} from './plugin/Others/BasicToolbar';
import {VRenderer} from './component/VRenderer';
import {RegionWrapper} from './component/RegionWrapper';
import {GridPlugin} from './plugin/Grid';
import {mapReactElement} from './component/factory';
import {tipedLabel} from './component/control/BaseControl';

export {
  Editor,
  MiniEditor,
  utils,
  BasePlugin,
  tipedLabel,
  getSchemaTpl,
  setSchemaTpl,
  defaultValue,
  registerEditorPlugin,
  unRegisterEditorPlugin,
  getEditorPlugins,
  mapReactElement,
  RendererEditor,
  BasicEditor,
  CodeEditor,
  VRenderer,
  RegionWrapper,
  mountInIframe,
  IFramePreview as IFrameEditor,
  AvailableRenderersPlugin,
  BasicToolbarPlugin,
  GridPlugin,
  SearchPanel
};
