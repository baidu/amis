/**
 * 只包含 amis 最小集，不引入其他模块
 */
import {registerRenderer} from 'amis-core';
export * from 'amis-core';
import './preset';

// 注册渲染器

// import './renderers/Action';
registerRenderer({
  type: 'action',
  alias: ['button', 'submit', 'reset'],
  getComponent: () => import('./renderers/Action')
});

// import './renderers/Alert';
registerRenderer({
  type: 'alert',
  getComponent: () => import('./renderers/Alert')
});

// import './renderers/App';
registerRenderer({
  type: 'app',
  getComponent: () => import('./renderers/App')
});

// import './renderers/Avatar';
registerRenderer({
  type: 'avatar',
  getComponent: () => import('./renderers/Avatar')
});

// import './renderers/Remark';
registerRenderer({
  type: 'remark',
  getComponent: () => import('./renderers/Remark')
});

// import './renderers/ButtonGroup';
registerRenderer({
  type: 'button-group',
  getComponent: () => import('./renderers/ButtonGroup')
});
// import './renderers/Form/ButtonToolbar';
registerRenderer({
  type: 'button-toolbar',
  getComponent: () => import('./renderers/Form/ButtonToolbar')
});

// import './renderers/Breadcrumb';
registerRenderer({
  type: 'breadcrumb',
  getComponent: () => import('./renderers/Breadcrumb')
});
// import './renderers/DropDownButton';
registerRenderer({
  type: 'dropdown-button',
  getComponent: () => import('./renderers/DropDownButton')
});

// import './renderers/Calendar';
registerRenderer({
  type: 'calendar',
  getComponent: () => import('./renderers/Calendar')
});

// import './renderers/Collapse';
registerRenderer({
  type: 'collapse',
  getComponent: () => import('./renderers/Collapse')
});
// import './renderers/CollapseGroup';
registerRenderer({
  type: 'collapse-group',
  getComponent: () => import('./renderers/CollapseGroup')
});
// import './renderers/Color';
registerRenderer({
  type: 'color',
  getComponent: () => import('./renderers/Color')
});

// import './renderers/CRUD';
registerRenderer({
  type: 'crud',
  getComponent: () => import('./renderers/CRUD')
});

// import './renderers/CRUD2';
registerRenderer({
  type: 'crud2',
  getComponent: () => import('./renderers/CRUD2')
});

// import './renderers/Pagination';
registerRenderer({
  type: 'pagination',
  alias: ['pager'],
  getComponent: () => import('./renderers/Pagination')
});
// import './renderers/Cards';
registerRenderer({
  type: 'cards',
  getComponent: () => import('./renderers/Cards')
});
// import './renderers/Card';
registerRenderer({
  type: 'card',
  getComponent: () => import('./renderers/Card')
});
// import './renderers/Card2';
registerRenderer({
  type: 'card2',
  getComponent: () => import('./renderers/Card2')
});
// import './renderers/Custom';
registerRenderer({
  type: 'custom',
  getComponent: () => import('./renderers/Custom')
});
// import './renderers/Date';
registerRenderer({
  type: 'date',
  getComponent: () => import('./renderers/Date')
});
registerRenderer({
  type: 'datetime',
  getComponent: () => import('./renderers/Date')
});
registerRenderer({
  type: 'time',
  getComponent: () => import('./renderers/Date')
});
registerRenderer({
  type: 'month',
  getComponent: () => import('./renderers/Date')
});
// import './renderers/Dialog';
registerRenderer({
  type: 'dialog',
  getComponent: () => import('./renderers/Dialog')
});
// import './renderers/Divider';
registerRenderer({
  type: 'divider',
  getComponent: () => import('./renderers/Divider')
});
// import './renderers/Each';
registerRenderer({
  type: 'each',
  getComponent: () => import('./renderers/Each')
});
// import './renderers/Flex';
registerRenderer({
  type: 'flex',
  getComponent: () => import('./renderers/Flex')
});
registerRenderer({
  type: 'shape',
  getComponent: () => import('./renderers/Shape')
});
// import './renderers/Form/ButtonGroupSelect';
registerRenderer({
  type: 'button-group-select',
  getComponent: () => import('./renderers/Form/ButtonGroupSelect')
});
// import './renderers/Form/Control';
registerRenderer({
  type: 'control',
  getComponent: () => import('./renderers/Form/Control')
});
// import './renderers/Form/Hidden';
registerRenderer({
  type: 'hidden',
  getComponent: () => import('./renderers/Form/Hidden')
});
// import './renderers/Form/InputText';
registerRenderer({
  type: 'input-text',
  alias: [
    'input-password',
    'native-date',
    'native-time',
    'native-number',
    'input-email',
    'input-url'
  ],
  getComponent: () => import('./renderers/Form/InputText')
});
// import './renderers/Form/InputTag';
registerRenderer({
  type: 'input-tag',
  getComponent: () => import('./renderers/Form/InputTag')
});
// import './renderers/Form/InputNumber';
registerRenderer({
  type: 'input-number',
  getComponent: () => import('./renderers/Form/InputNumber')
});
// import './renderers/Form/Textarea';
registerRenderer({
  type: 'textarea',
  getComponent: () => import('./renderers/Form/Textarea')
});
// import './renderers/Form/Checkboxes';
registerRenderer({
  type: 'checkboxes',
  getComponent: () => import('./renderers/Form/Checkboxes')
});
// import './renderers/Form/Checkbox';
registerRenderer({
  type: 'checkbox',
  getComponent: () => import('./renderers/Form/Checkbox')
});
// import './renderers/Form/InputCity';
registerRenderer({
  type: 'input-city',
  getComponent: () => import('./renderers/Form/InputCity')
});
// import './renderers/Form/ChartRadios';
registerRenderer({
  type: 'chart-radios',
  getComponent: () => import('./renderers/Form/ChartRadios')
});
// import './renderers/Form/InputRating';
registerRenderer({
  type: 'input-rating',
  getComponent: () => import('./renderers/Form/InputRating')
});
// import './renderers/Form/Switch';
registerRenderer({
  type: 'switch',
  getComponent: () => import('./renderers/Form/Switch')
});
// import './renderers/Form/Radios';
registerRenderer({
  type: 'radios',
  getComponent: () => import('./renderers/Form/Radios')
});
// import './renderers/Form/Radio';
registerRenderer({
  type: 'radio',
  getComponent: () => import('./renderers/Form/Radio')
});
// import './renderers/Form/JSONSchema';
registerRenderer({
  type: 'json-schema',
  getComponent: () => import('./renderers/Form/JSONSchema')
});

// import './renderers/Form/JSONSchemaEditor';
registerRenderer({
  type: 'json-schema-editor',
  getComponent: () => import('./renderers/Form/JSONSchemaEditor')
});
// import './renderers/Form/ListSelect';
registerRenderer({
  type: 'list-select',
  getComponent: () => import('./renderers/Form/ListSelect')
});
// import './renderers/Form/LocationPicker';
registerRenderer({
  type: 'location-picker',
  getComponent: () => import('./renderers/Form/LocationPicker')
});
// import './renderers/Form/Select';
registerRenderer({
  type: 'select',
  getComponent: () => import('./renderers/Form/Select')
});
registerRenderer({
  type: 'multi-select',
  getComponent: () => import('./renderers/Form/Select')
});
import './renderers/Form/Static';
// import './renderers/Form/InputDate';
registerRenderer({
  type: 'input-date',
  getComponent: () => import('./renderers/Form/InputDate')
});
registerRenderer({
  type: 'input-datetime',
  getComponent: () => import('./renderers/Form/InputDate')
});
registerRenderer({
  type: 'input-time',
  getComponent: () => import('./renderers/Form/InputDate')
});
registerRenderer({
  type: 'input-month',
  getComponent: () => import('./renderers/Form/InputDate')
});
registerRenderer({
  type: 'input-quarter',
  getComponent: () => import('./renderers/Form/InputDate')
});
registerRenderer({
  type: 'input-year',
  getComponent: () => import('./renderers/Form/InputDate')
});
// import './renderers/Form/InputDateRange';
registerRenderer({
  type: 'input-date-range',
  getComponent: () => import('./renderers/Form/InputDateRange')
});
registerRenderer({
  type: 'input-datetime-range',
  getComponent: () => import('./renderers/Form/InputDateRange')
});
registerRenderer({
  type: 'input-time-range',
  getComponent: () => import('./renderers/Form/InputDateRange')
});
// import './renderers/Form/InputFormula';
registerRenderer({
  type: 'input-formula',
  getComponent: () => import('./renderers/Form/InputFormula')
});
// import './renderers/Form/InputRepeat';
registerRenderer({
  type: 'input-repeat',
  getComponent: () => import('./renderers/Form/InputRepeat')
});
// import './renderers/Form/InputTree';
registerRenderer({
  type: 'input-tree',
  getComponent: () => import('./renderers/Form/InputTree')
});
// import './renderers/Form/TreeSelect';
registerRenderer({
  type: 'tree-select',
  getComponent: () => import('./renderers/Form/TreeSelect')
});
// import './renderers/Form/InputImage';
registerRenderer({
  type: 'input-image',
  getComponent: () => import('./renderers/Form/InputImage')
});
// import './renderers/Form/InputFile';
registerRenderer({
  type: 'input-file',
  getComponent: () => import('./renderers/Form/InputFile')
});
// import './renderers/Form/UUID';
registerRenderer({
  type: 'uuid',
  getComponent: () => import('./renderers/Form/UUID')
});
// import './renderers/Form/MatrixCheckboxes';
registerRenderer({
  type: 'matrix-checkboxes',
  getComponent: () => import('./renderers/Form/MatrixCheckboxes')
});
// import './renderers/Form/InputMonthRange';
registerRenderer({
  type: 'input-month-range',
  getComponent: () => import('./renderers/Form/InputMonthRange')
});
// import './renderers/Form/InputQuarterRange';
registerRenderer({
  type: 'input-quarter-range',
  getComponent: () => import('./renderers/Form/InputQuarterRange')
});
// import './renderers/Form/InputYearRange';
registerRenderer({
  type: 'input-year-range',
  getComponent: () => import('./renderers/Form/InputYearRange')
});
// import './renderers/Form/InputRange';
registerRenderer({
  type: 'input-range',
  getComponent: () => import('./renderers/Form/InputRange')
});
// import './renderers/Form/InputArray';
registerRenderer({
  type: 'input-array',
  getComponent: () => import('./renderers/Form/InputArray')
});
// import './renderers/Form/Combo';
registerRenderer({
  type: 'combo',
  getComponent: () => import('./renderers/Form/Combo')
});
registerRenderer({
  type: 'input-kv',
  getComponent: () => import('./renderers/Form/Combo')
});
registerRenderer({
  type: 'input-kvs',
  getComponent: () => import('./renderers/Form/Combo')
});
// import './renderers/Form/ConditionBuilder';
registerRenderer({
  type: 'condition-builder',
  getComponent: () => import('./renderers/Form/ConditionBuilder')
});
// import './renderers/Form/InputSubForm';
registerRenderer({
  type: 'input-sub-form',
  getComponent: () => import('./renderers/Form/InputSubForm')
});
// import './renderers/Form/InputExcel';
registerRenderer({
  type: 'input-excel',
  getComponent: () => import('./renderers/Form/InputExcel')
});
// import './renderers/Form/InputRichText';
registerRenderer({
  type: 'input-rich-text',
  getComponent: () => import('./renderers/Form/InputRichText')
});
import './renderers/Form/Editor';
// registerRenderer({
//   type: 'input-rich-text',
//   getComponent: () => import('./renderers/Form/Editor')
// });
// import './renderers/Form/DiffEditor';
registerRenderer({
  type: 'diff-editor',
  getComponent: () => import('./renderers/Form/DiffEditor')
});
// import './renderers/Form/InputColor';
registerRenderer({
  type: 'input-color',
  getComponent: () => import('./renderers/Form/InputColor')
});
// import './renderers/Form/ChainedSelect';
registerRenderer({
  type: 'chained-select',
  getComponent: () => import('./renderers/Form/ChainedSelect')
});
// import './renderers/Form/NestedSelect';
registerRenderer({
  type: 'nested-select',
  getComponent: () => import('./renderers/Form/NestedSelect')
});
// import './renderers/Form/Transfer';
registerRenderer({
  type: 'transfer',
  getComponent: () => import('./renderers/Form/Transfer')
});
// import './renderers/Form/TransferPicker';
registerRenderer({
  type: 'transfer-picker',
  getComponent: () => import('./renderers/Form/TransferPicker')
});
// import './renderers/Form/InputTable';
registerRenderer({
  type: 'input-table',
  getComponent: () => import('./renderers/Form/InputTable')
});
// import './renderers/Form/Picker';
registerRenderer({
  type: 'picker',
  getComponent: () => import('./renderers/Form/Picker')
});
// import './renderers/Form/IconPicker';
registerRenderer({
  type: 'icon-picker',
  getComponent: () => import('./renderers/Form/IconPicker')
});
// import './renderers/Form/IconSelect';
registerRenderer({
  type: 'icon-select',
  getComponent: () => import('./renderers/Form/IconSelect')
});
// import './renderers/Form/Formula';
registerRenderer({
  type: 'formula',
  getComponent: () => import('./renderers/Form/Formula')
});
// import './renderers/Form/FieldSet';
registerRenderer({
  type: 'fieldset',
  getComponent: () => import('./renderers/Form/FieldSet')
});
// import './renderers/Form/TabsTransfer';
registerRenderer({
  type: 'tabs-transfer',
  getComponent: () => import('./renderers/Form/TabsTransfer')
});
// import './renderers/Form/TabsTransferPicker';
registerRenderer({
  type: 'tabs-transfer-picker',
  getComponent: () => import('./renderers/Form/TabsTransferPicker')
});
// import './renderers/Form/Group';
registerRenderer({
  type: 'group',
  getComponent: () => import('./renderers/Form/Group')
});
// import './renderers/Form/InputGroup';
registerRenderer({
  type: 'input-group',
  getComponent: () => import('./renderers/Form/InputGroup')
});
// import './renderers/Form/UserSelect';
registerRenderer({
  type: 'users-select',
  getComponent: () => import('./renderers/Form/UserSelect')
});
// import './renderers/Form/InputSignature';
registerRenderer({
  type: 'input-signature',
  getComponent: () => import('./renderers/Form/InputSignature')
});
// import './renderers/Form/InputVerificationCode';
registerRenderer({
  type: 'input-verification-code',
  getComponent: () => import('./renderers/Form/InputVerificationCode')
});
import './renderers/Grid';
// import './renderers/Grid2D';
registerRenderer({
  type: 'grid-2d',
  getComponent: () => import('./renderers/Grid2D')
});
// import './renderers/HBox';
registerRenderer({
  type: 'hbox',
  getComponent: () => import('./renderers/HBox')
});
// import './renderers/VBox';
registerRenderer({
  type: 'vbox',
  getComponent: () => import('./renderers/VBox')
});
// import './renderers/Image';
registerRenderer({
  type: 'image',
  getComponent: () => import('./renderers/Image')
});
// import './renderers/Images';
registerRenderer({
  type: 'images',
  getComponent: () => import('./renderers/Images')
});
// import './renderers/List';
registerRenderer({
  type: 'list',
  getComponent: () => import('./renderers/List')
});
// import './renderers/Log';
registerRenderer({
  type: 'log',
  getComponent: () => import('./renderers/Log')
});
// import './renderers/Operation';
registerRenderer({
  type: 'operation',
  getComponent: () => import('./renderers/Operation')
});
// import './renderers/Page';
registerRenderer({
  type: 'page',
  getComponent: () => import('./renderers/Page')
});
// import './renderers/PaginationWrapper';
registerRenderer({
  type: 'pagination-wrapper',
  getComponent: () => import('./renderers/PaginationWrapper')
});
// import './renderers/Panel';
registerRenderer({
  type: 'panel',
  getComponent: () => import('./renderers/Panel')
});
// import './renderers/Plain';
registerRenderer({
  type: 'plain',
  alias: ['text'],
  getComponent: () => import('./renderers/Plain')
});
// import './renderers/Property';
registerRenderer({
  type: 'property',
  getComponent: () => import('./renderers/Property')
});
// import './renderers/Portlet';
registerRenderer({
  type: 'portlet',
  getComponent: () => import('./renderers/Portlet')
});
// import './renderers/Spinner';
registerRenderer({
  type: 'spinner',
  getComponent: () => import('./renderers/Spinner')
});
// import './renderers/Table/index';
registerRenderer({
  type: 'table',
  getComponent: () => import('./renderers/Table/index')
});
// import './renderers/Tabs';
registerRenderer({
  type: 'tabs',
  getComponent: () => import('./renderers/Tabs')
});
// import './renderers/Tpl';
registerRenderer({
  type: 'tpl',
  alias: ['html'],
  getComponent: () => import('./renderers/Tpl')
});
// import './renderers/Mapping';
registerRenderer({
  type: 'mapping',
  alias: ['map'],
  getComponent: () => import('./renderers/Mapping')
});
// import './renderers/Progress';
registerRenderer({
  type: 'progress',
  getComponent: () => import('./renderers/Progress')
});
// import './renderers/Status';
registerRenderer({
  type: 'status',
  getComponent: () => import('./renderers/Status')
});
// import './renderers/Json';
registerRenderer({
  type: 'json',
  getComponent: () => import('./renderers/Json')
});
// import './renderers/Link';
registerRenderer({
  type: 'link',
  getComponent: () => import('./renderers/Link')
});
// import './renderers/Wizard';
registerRenderer({
  type: 'wizard',
  getComponent: () => import('./renderers/Wizard')
});
// import './renderers/Chart';
registerRenderer({
  type: 'chart',
  getComponent: () => import('./renderers/Chart')
});
// import './renderers/Container';
registerRenderer({
  type: 'container',
  getComponent: () => import('./renderers/Container')
});
// import './renderers/SwitchContainer';
registerRenderer({
  type: 'switch-container',
  getComponent: () => import('./renderers/SwitchContainer')
});
// import './renderers/SearchBox';
registerRenderer({
  type: 'search-box',
  getComponent: () => import('./renderers/SearchBox')
});
// import './renderers/Service';
registerRenderer({
  type: 'service',
  getComponent: () => import('./renderers/Service')
});
// import './renderers/SparkLine';
registerRenderer({
  type: 'sparkline',
  getComponent: () => import('./renderers/SparkLine')
});
// import './renderers/Video';
registerRenderer({
  type: 'video',
  getComponent: () => import('./renderers/Video')
});
// import './renderers/Audio';
registerRenderer({
  type: 'audio',
  getComponent: () => import('./renderers/Audio')
});
// import './renderers/Nav';
registerRenderer({
  type: 'nav',
  alias: ['navigation'],
  getComponent: () => import('./renderers/Nav')
});
// import './renderers/Number';
registerRenderer({
  type: 'number',
  getComponent: () => import('./renderers/Number')
});
// import './renderers/Tasks';
registerRenderer({
  type: 'tasks',
  getComponent: () => import('./renderers/Tasks')
});
// import './renderers/Drawer';
registerRenderer({
  type: 'drawer',
  getComponent: () => import('./renderers/Drawer')
});
// import './renderers/Wrapper';
registerRenderer({
  type: 'wrapper',
  getComponent: () => import('./renderers/Wrapper')
});
// import './renderers/IFrame';
registerRenderer({
  type: 'iframe',
  getComponent: () => import('./renderers/IFrame')
});
// import './renderers/BarCode';
registerRenderer({
  type: 'barcode',
  getComponent: () => import('./renderers/BarCode')
});
// import './renderers/QRCode';
registerRenderer({
  type: 'qrcode',
  alias: ['qr-code'],
  getComponent: () => import('./renderers/QRCode')
});
// import './renderers/Icon';
registerRenderer({
  type: 'icon',
  getComponent: () => import('./renderers/Icon')
});
// import './renderers/Carousel';
registerRenderer({
  type: 'carousel',
  getComponent: () => import('./renderers/Carousel')
});
// import './renderers/AnchorNav';
registerRenderer({
  type: 'anchor-nav',
  getComponent: () => import('./renderers/AnchorNav')
});
// import './renderers/Steps';
registerRenderer({
  type: 'steps',
  getComponent: () => import('./renderers/Steps')
});
// import './renderers/Timeline';
registerRenderer({
  type: 'timeline',
  getComponent: () => import('./renderers/Timeline')
});
// import './renderers/Markdown';
registerRenderer({
  type: 'markdown',
  getComponent: () => import('./renderers/Markdown')
});
// import './renderers/TableView';
registerRenderer({
  type: 'table-view',
  getComponent: () => import('./renderers/TableView')
});
// import './renderers/Code';
registerRenderer({
  type: 'code',
  getComponent: () => import('./renderers/Code')
});
// import './renderers/WebComponent';
registerRenderer({
  type: 'web-component',
  getComponent: () => import('./renderers/WebComponent')
});
// import './renderers/GridNav';
registerRenderer({
  type: 'grid-nav',
  getComponent: () => import('./renderers/GridNav')
});
// import './renderers/TooltipWrapper';
registerRenderer({
  type: 'tooltip-wrapper',
  getComponent: () => import('./renderers/TooltipWrapper')
});
// import './renderers/Tag';
registerRenderer({
  type: 'tag',
  getComponent: () => import('./renderers/Tag')
});
// import './renderers/Table2/index';
registerRenderer({
  type: 'table2',
  getComponent: () => import('./renderers/Table2/index')
});
registerRenderer({
  type: 'column-toggler',
  getComponent: () => import('./renderers/Table2/ColumnToggler')
});
// import './renderers/Words';
registerRenderer({
  type: 'words',
  getComponent: () => import('./renderers/Words')
});
registerRenderer({
  type: 'tags',
  getComponent: () => import('./renderers/Words')
});
// import './renderers/Password';
registerRenderer({
  type: 'password',
  getComponent: () => import('./renderers/Password')
});
// import './renderers/DateRange';
registerRenderer({
  type: 'date-range',
  getComponent: () => import('./renderers/DateRange')
});
// import './renderers/MultilineText';
registerRenderer({
  type: 'multiline-text',
  getComponent: () => import('./renderers/MultilineText')
});
// import './renderers/OfficeViewer';
registerRenderer({
  type: 'office-viewer',
  getComponent: () => import('./renderers/OfficeViewer')
});
// import './renderers/PdfViewer';
registerRenderer({
  type: 'pdf-viewer',
  getComponent: () => import('./renderers/PdfViewer')
});
// import './renderers/AMIS';
registerRenderer({
  type: 'amis',
  getComponent: () => import('./renderers/AMIS')
});

registerRenderer({
  type: 'slider',
  getComponent: () => import('./renderers/Slider')
});

import './compat';
import './schemaExtend';
