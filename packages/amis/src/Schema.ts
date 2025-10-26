import {AMISPageSchema} from './renderers/Page';
import {AMISFormSchema} from 'amis-core';
import {AMISAlertSchema} from './renderers/Alert';

import {AMISFlexSchema} from './renderers/Flex';
import {AMISTplSchema} from './renderers/Tpl';
import {RemarkSchema, SchemaRemark} from './renderers/Remark';
import {ActionSchema} from './renderers/Action';
import {AMISAudioSchema} from './renderers/Audio';
import {AMISButtonGroupSchema} from './renderers/ButtonGroup';
import {AMISButtonToolbarSchema} from './renderers/Form/ButtonToolbar';
import {AMISCardSchema} from './renderers/Card';
import {AMISCardsSchema} from './renderers/Cards';
import {AMISCalendarSchema} from './renderers/Calendar';
import {AMISCarouselSchema} from './renderers/Carousel';
import {AMISChartSchema} from './renderers/Chart';
import {AMISCollapseSchema} from './renderers/Collapse';
import {AMISCollapseGroupSchema} from './renderers/CollapseGroup';
import {AMISColorSchema} from './renderers/Color';
import {AMISContainerSchema} from './renderers/Container';
import {AMISSwitchContainerSchema} from './renderers/SwitchContainer';
import {AMISCRUDSchema} from './renderers/CRUD';
import {AMISCRUD2Schema} from './renderers/CRUD2';
import {AMISDateSchema} from './renderers/Date';
import {AMISDividerSchema} from './renderers/Divider';
import {AMISDropdownButtonSchema} from './renderers/DropDownButton';
import {AMISEachSchema} from './renderers/Each';
import {AMISGridSchema} from './renderers/Grid';
import {AMISGrid2DSchema} from './renderers/Grid2D';
import {AMISHBoxSchema} from './renderers/HBox';
import {AMISIconSchema} from './renderers/Icon';
import {AMISIFrameSchema} from './renderers/IFrame';
import {AMISImageSchema} from './renderers/Image';
import {AMISImagesSchema} from './renderers/Images';
import {AMISJsonSchema} from './renderers/Json';
import {AMISLinkSchema} from './renderers/Link';
import {AMISListSchema} from './renderers/List';
import {AMISMappingSchema} from './renderers/Mapping';
import {AMISNavSchema} from './renderers/Nav';
import {AMISOperationSchema} from './renderers/Operation';
import {AMISPanelSchema} from './renderers/Panel';
import {AMISPlainSchema} from './renderers/Plain';
import {AMISProgressSchema} from './renderers/Progress';
import {AMISQRCodeSchema} from './renderers/QRCode';
import {AMISServiceSchema} from './renderers/Service';
import {AMISStatusSchema} from './renderers/Status';
import {AMISTabsSchema} from './renderers/Tabs';
import {AMISPortletSchema} from './renderers/Portlet';
import {AMISTasksSchema} from './renderers/Tasks';
import {AMISVBoxSchema} from './renderers/VBox';
import {AMISVideoSchema} from './renderers/Video';
import {AMISWizardSchema} from './renderers/Wizard';
import {AMISWrapperSchema} from './renderers/Wrapper';
import {AMISTableSchema} from './renderers/Table';
import {AMISSearchBoxSchema} from './renderers/SearchBox';
import {AMISSparkLineSchema} from './renderers/SparkLine';
import {AMISTooltipWrapperSchema} from './renderers/TooltipWrapper';
import {AMISPaginationWrapperSchema} from './renderers/PaginationWrapper';
import {AMISPaginationSchema} from './renderers/Pagination';
import {AMISAnchorNavSchema} from './renderers/AnchorNav';
import {AMISAvatarSchema} from './renderers/Avatar';
import {AMISStepsSchema} from './renderers/Steps';
import {AMISSpinnerSchema} from './renderers/Spinner';
import {AMISTimelineSchema} from './renderers/Timeline';
import {AMISArrayControlSchema} from './renderers/Form/InputArray';
import {ButtonGroupControlSchema} from './renderers/Form/ButtonGroupSelect';
import {AMISChainedSelectControlSchema} from './renderers/Form/ChainedSelect';
import {AMISCheckboxControlSchema} from './renderers/Form/Checkbox';
import {AMISCheckboxesControlSchema} from './renderers/Form/Checkboxes';
import {AMISComboControlSchema} from './renderers/Form/Combo';
import {AMISConditionBuilderControlSchema} from './renderers/Form/ConditionBuilder';
import {AMISDiffControlSchema} from './renderers/Form/DiffEditor';
import {AMISEditorControlSchema} from './renderers/Form/Editor';
import {AMISFieldSetControlSchema} from './renderers/Form/FieldSet';
import {AMISFormulaControlSchema} from './renderers/Form/Formula';
import {AMISGroupControlSchema} from './renderers/Form/Group';
import {AMISHiddenControlSchema} from './renderers/Form/Hidden';
import {AMISIconPickerControlSchema} from './renderers/Form/IconPicker';
import {AMISInputCityControlSchema} from './renderers/Form/InputCity';
import {AMISInputColorControlSchema} from './renderers/Form/InputColor';
import {
  AMISDateControlSchema,
  AMISDateTimeControlSchema,
  AMISTimeControlSchema,
  AMISMonthControlSchema,
  AMISQuarterControlSchema,
  AMISYearControlSchema
} from './renderers/Form/InputDate';
import {AMISDateRangeControlSchema} from './renderers/Form/InputDateRange';
import {AMISFileControlSchema} from './renderers/Form/InputFile';
import {AMISInputGroupControlSchema} from './renderers/Form/InputGroup';
import {AMISImageControlSchema} from './renderers/Form/InputImage';
import {AMISMonthRangeControlSchema} from './renderers/Form/InputMonthRange';
import {AMISQuarterRangeControlSchema} from './renderers/Form/InputQuarterRange';
import {AMISNumberControlSchema} from './renderers/Form/InputNumber';
import {AMISInputRangeSchema} from './renderers/Form/InputRange';
import {AMISInputRatingSchema} from './renderers/Form/InputRating';
import {AMISInputRepeatSchema} from './renderers/Form/InputRepeat';
import {AMISInputRichTextSchema} from './renderers/Form/InputRichText';
import {AMISInputSubFormSchema} from './renderers/Form/InputSubForm';
import {AMISInputTableSchema} from './renderers/Form/InputTable';
import {AMISInputTagSchema} from './renderers/Form/InputTag';
import {AMISTextControlSchema} from './renderers/Form/InputText';
import {AMISInputTreeSchema} from './renderers/Form/InputTree';
import {AMISListControlSchema} from './renderers/Form/ListSelect';
import {AMISLocationControlSchema} from './renderers/Form/LocationPicker';
import {AMISMatrixControlSchema} from './renderers/Form/MatrixCheckboxes';
import {AMISNestedSelectControlSchema} from './renderers/Form/NestedSelect';
import {AMISPickerSchema} from './renderers/Form/Picker';
import {AMISRadiosControlSchema} from './renderers/Form/Radios';
import {AMISSelectSchema} from './renderers/Form/Select';
import {AMISStaticSchema} from './renderers/Form/Static';
import {AMISSwitchSchema} from './renderers/Form/Switch';
import {AMISTabsTransferSchema} from './renderers/Form/TabsTransfer';
import {AMISTextareaSchema} from './renderers/Form/Textarea';
import {AMISTransferSchema} from './renderers/Form/Transfer';
import {AMISTreeSelectSchema} from './renderers/Form/TreeSelect';
import {AMISUuidSchema} from './renderers/Form/UUID';
import {AMISFormControlSchema} from './renderers/Form/Control';
import {AMISTransferPickerSchema} from './renderers/Form/TransferPicker';
import {AMISTabsTransferPickerSchema} from './renderers/Form/TabsTransferPicker';
import {AMISUsersSelectSchema} from './renderers/Form/UserSelect';
import {JSONSchemaEditorControlSchema} from './renderers/Form/JSONSchemaEditor';
import {AMISInputSignatureSchema} from './renderers/Form/InputSignature';
import {AMISTableSchema2} from './renderers/Table2';
import {AMISAppSchema} from './renderers/App';
import {AMISWebComponentSchema} from './renderers/WebComponent';
import {AMISIShapeSchema} from './renderers/Shape';
import {AMISMarkdownSchema} from './renderers/Markdown';
import {AMISCustomSchema} from './renderers/Custom';
import {AIMSAMISSchema} from './renderers/AMIS';
import {AMISBreadcrumbSchema} from './renderers/Breadcrumb';
import {AMISBarCodeSchema} from './renderers/BarCode';
import {AMISCodeSchema} from './renderers/Code';
import {AMISLogSchema} from './renderers/Log';
import {AMISNumberSchema} from './renderers/Number';
import {AMISOfficeViewerSchema} from './renderers/OfficeViewer';
import {AMISPdfViewerSchema} from './renderers/PdfViewer';
import {AMISPropertySchema} from './renderers/Property';
import {AMISTagSchema} from './renderers/Tag';
import {AMISTableViewSchema} from './renderers/TableView';
import {
  BaseSchemaWithoutType,
  FormBaseControl,
  AMISFormItem,
  AMISFormItemWithOptions,
  FormOptionsControl,
  AMISClassName,
  SchemaExpression,
  AMISSchema,
  AMISSchemaType,
  AMISSchemaCollection
} from 'amis-core';
import type {
  AMISApi,
  AMISApiObject,
  AMISButtonSchema,
  AMISDefaultData,
  AMISFeedbackDialog,
  AMISFunction,
  AMISIcon,
  AMISLegacyActionSchema,
  AMISMessageConfig,
  AMISOption,
  AMISRedirect,
  AMISReloadTarget,
  AMISRemarkBase,
  AMISSchemaBase,
  AMISTemplate,
  AMISToastBase,
  AMISTokenizeableString,
  AMISTooltip,
  AMISUrlPath,
  AMISVariableName,
  FormSchemaBase,
  TestIdBuilder
} from 'amis-core';
import {AMISDateRangeSchema} from './renderers/DateRange';
import {AMISPasswordSchema} from './renderers/Password';
import {AMISWordsSchema} from './renderers/Words';
import {AMISRadioControlSchema} from './renderers/Form/Radio';
import {AMISSliderSchema} from './renderers/Slider';
import {AMISMultilineTextSchema} from './renderers/MultilineText';
import {AMISDialogSchema} from './renderers/Dialog';

export type SchemaType = AMISSchemaType;
export type SchemaObject = AMISSchema;

export type SchemaCollection = AMISSchemaCollection;
export type SchemaApiObject = AMISApiObject;
export type SchemaApi = AMISApi;
export type SchemaName = AMISVariableName;
export type SchemaReload = AMISReloadTarget;
export type SchemaRedirect = AMISRedirect;
export type SchemaTpl = AMISTemplate;
export type SchemaDefaultData = AMISDefaultData;

/**
 * 用来关联 json schema 的，不用管。
 */
export type SchemaSchema = string;
export type SchemaIcon = AMISIcon;
export type SchemaTokenizeableString = AMISTokenizeableString;
export type SchemaUrlPath = AMISUrlPath;

export type SchemaTooltip = AMISTooltip;

/**
 * 消息文案配置，记住这个优先级是最低的，如果你的接口返回了 msg，接口返回的优先。
 */
export type SchemaMessage = AMISMessageConfig;
export type SchemaFunction = AMISFunction;

export interface BaseSchema extends AMISSchemaBase {
  type: SchemaType;

  testid?: string;
}

export interface Option extends AMISOption {
  /**
   * 标记正在加载。只有 defer 为 true 时有意义。内部字段不可以外部设置
   */
  loading?: boolean;

  /**
   * 只有设置了 defer 才有意义，内部字段不可以外部设置
   */
  loaded?: boolean;

  [propName: string]: any;
}
export interface Options extends Array<Option> {}

export type FeedbackDialog = AMISFeedbackDialog;
export type ToastSchemaBase = AMISToastBase;
export type FormBaseControlSchema = AMISFormItem;

export interface FormOptionsSchema extends AMISFormItemWithOptions {}

export {AMISClassName, SchemaExpression};

export type RootSchema = AMISPageSchema;

declare module 'amis-core' {
  interface AMISSchemaRegistry {
    // 基础组件
    'form': AMISFormSchema;
    'alert': AMISAlertSchema;
    'app': AMISAppSchema;
    'audio': AMISAudioSchema;
    'avatar': AMISAvatarSchema;
    'button-group': AMISButtonGroupSchema;
    'breadcrumb': AMISBreadcrumbSchema;
    'card': AMISCardSchema;
    'card2': AMISCardSchema;
    'cards': AMISCardsSchema;
    'carousel': AMISCarouselSchema;
    'chart': AMISChartSchema;
    'calendar': AMISCalendarSchema;
    'collapse': AMISCollapseSchema;
    'collapse-group': AMISCollapseGroupSchema;
    'color': AMISColorSchema;
    'crud': AMISCRUDSchema;
    'crud2': AMISCRUD2Schema;
    'custom': AMISCustomSchema;
    'date': AMISDateSchema;
    'static-date': AMISDateSchema;
    'datetime': AMISDateTimeControlSchema;
    'static-datetime': AMISDateTimeControlSchema;
    'time': AMISTimeControlSchema;
    'static-time': AMISTimeControlSchema;
    'month': AMISMonthControlSchema;
    'static-month': AMISMonthControlSchema;
    'date-range': AMISDateRangeSchema;
    'dialog': AMISDialogSchema;
    'spinner': AMISSpinnerSchema;
    'divider': AMISDividerSchema;
    'dropdown-button': AMISDropdownButtonSchema;
    'each': AMISEachSchema;
    'flex': AMISFlexSchema;
    'flex-item': AMISFlexSchema;
    'grid-2d': AMISGrid2DSchema;
    'icon': AMISIconSchema;
    'iframe': AMISIFrameSchema;
    'image': AMISImageSchema;
    'static-image': AMISImageSchema;
    'images': AMISImagesSchema;
    'static-images': AMISImagesSchema;
    'json-schema': JSONSchemaEditorControlSchema;
    'json-schema-editor': JSONSchemaEditorControlSchema;
    'json': AMISJsonSchema;
    'static-json': AMISJsonSchema;
    'link': AMISLinkSchema;
    'list': AMISListSchema;
    'log': AMISLogSchema;
    'static-list': AMISListSchema;
    'map': AMISLocationControlSchema;
    'mapping': AMISMappingSchema;
    'markdown': AMISMarkdownSchema;
    'nav': AMISNavSchema;
    'number': AMISNumberSchema;
    'page': AMISPageSchema;
    'pagination': AMISPaginationSchema;
    'pagination-wrapper': AMISPaginationWrapperSchema;
    'property': AMISPropertySchema;
    'operation': AMISOperationSchema;
    'plain': AMISPlainSchema;
    'text': AMISTextControlSchema;
    'progress': AMISProgressSchema;
    'qrcode': AMISQRCodeSchema;
    'qr-code': AMISQRCodeSchema;
    'barcode': AMISBarCodeSchema;
    'remark': RemarkSchema;
    'search-box': AMISSearchBoxSchema;
    'sparkline': AMISSparkLineSchema;
    'status': AMISStatusSchema;
    'table': AMISTableSchema;
    'static-table': AMISInputTableSchema;
    'table2': AMISTableSchema2;
    'html': AMISTplSchema;
    'tpl': AMISTplSchema;
    'tasks': AMISTasksSchema;
    'vbox': AMISVBoxSchema;
    'video': AMISVideoSchema;
    'wizard': AMISWizardSchema;
    'wrapper': AMISWrapperSchema;
    'web-component': AMISWebComponentSchema;
    'anchor-nav': AMISAnchorNavSchema;
    'steps': AMISStepsSchema;
    'timeline': AMISTimelineSchema;
    'control': AMISFormControlSchema;
    'input-array': AMISArrayControlSchema;
    'action': AMISLegacyActionSchema;
    'button': AMISButtonSchema;
    'submit': AMISButtonSchema;
    'reset': AMISButtonSchema;
    'button-group-select': ButtonGroupControlSchema;
    'button-toolbar': AMISButtonToolbarSchema;
    'chained-select': AMISChainedSelectControlSchema;
    'chart-radios': AMISRadiosControlSchema;
    'checkbox': AMISCheckboxControlSchema;
    'checkboxes': AMISCheckboxesControlSchema;
    'input-city': AMISInputCityControlSchema;
    'input-color': AMISInputColorControlSchema;
    'combo': AMISComboControlSchema;
    'condition-builder': AMISConditionBuilderControlSchema;
    'container': AMISContainerSchema;
    'switch-container': AMISSwitchContainerSchema;
    'input-date': AMISDateControlSchema;
    'input-datetime': AMISDateTimeControlSchema;
    'input-time': AMISTimeControlSchema;
    'input-quarter': AMISQuarterControlSchema;
    'input-year': AMISYearControlSchema;
    'input-year-range': AMISDateRangeControlSchema;
    'input-month': AMISMonthControlSchema;
    'input-date-range': AMISDateRangeControlSchema;
    'input-time-range': AMISDateRangeControlSchema;
    'input-datetime-range': AMISDateRangeControlSchema;
    'input-excel': AMISFileControlSchema;
    'input-formula': AMISFormulaControlSchema;
    'diff-editor': AMISDiffControlSchema;
    'office-viewer': AMISOfficeViewerSchema;
    'pdf-viewer': AMISPdfViewerSchema;
    'input-signature': AMISInputSignatureSchema;
    'input-verification-code': AMISTextControlSchema;
    'shape': AMISIShapeSchema;

    // Editor 系列
    'editor': AMISEditorControlSchema;
    'bat-editor': AMISEditorControlSchema;
    'c-editor': AMISEditorControlSchema;
    'coffeescript-editor': AMISEditorControlSchema;
    'cpp-editor': AMISEditorControlSchema;
    'csharp-editor': AMISEditorControlSchema;
    'css-editor': AMISEditorControlSchema;
    'dockerfile-editor': AMISEditorControlSchema;
    'fsharp-editor': AMISEditorControlSchema;
    'go-editor': AMISEditorControlSchema;
    'handlebars-editor': AMISEditorControlSchema;
    'html-editor': AMISEditorControlSchema;
    'ini-editor': AMISEditorControlSchema;
    'java-editor': AMISEditorControlSchema;
    'javascript-editor': AMISEditorControlSchema;
    'json-editor': AMISEditorControlSchema;
    'less-editor': AMISEditorControlSchema;
    'lua-editor': AMISEditorControlSchema;
    'markdown-editor': AMISEditorControlSchema;
    'msdax-editor': AMISEditorControlSchema;
    'objective-c-editor': AMISEditorControlSchema;
    'php-editor': AMISEditorControlSchema;
    'plaintext-editor': AMISEditorControlSchema;
    'postiats-editor': AMISEditorControlSchema;
    'powershell-editor': AMISEditorControlSchema;
    'pug-editor': AMISEditorControlSchema;
    'python-editor': AMISEditorControlSchema;
    'r-editor': AMISEditorControlSchema;
    'razor-editor': AMISEditorControlSchema;
    'ruby-editor': AMISEditorControlSchema;
    'sb-editor': AMISEditorControlSchema;
    'scss-editor': AMISEditorControlSchema;
    'sol-editor': AMISEditorControlSchema;
    'sql-editor': AMISEditorControlSchema;
    'swift-editor': AMISEditorControlSchema;
    'typescript-editor': AMISEditorControlSchema;
    'vb-editor': AMISEditorControlSchema;
    'xml-editor': AMISEditorControlSchema;
    'yaml-editor': AMISEditorControlSchema;

    // 表单项
    'fieldset': AMISFieldSetControlSchema;
    'fieldSet': AMISFieldSetControlSchema;
    'input-file': AMISFileControlSchema;
    'formula': AMISFormulaControlSchema;
    'grid': AMISGridSchema;
    'group': AMISGroupControlSchema;
    'hbox': AMISHBoxSchema;
    'hidden': AMISHiddenControlSchema;
    'icon-picker': AMISIconPickerControlSchema;
    'icon-select': AMISIconPickerControlSchema;
    'input-image': AMISImageControlSchema;
    'input-group': AMISInputGroupControlSchema;
    'list-select': AMISListControlSchema;
    'location-picker': AMISLocationControlSchema;
    'matrix-checkboxes': AMISMatrixControlSchema;
    'input-month-range': AMISMonthRangeControlSchema;
    'input-quarter-range': AMISQuarterRangeControlSchema;
    'nested-select': AMISNestedSelectControlSchema;
    'input-number': AMISNumberControlSchema;
    'panel': AMISPanelSchema;
    'picker': AMISPickerSchema;
    'radio': AMISRadioControlSchema;
    'radios': AMISRadiosControlSchema;
    'input-range': AMISInputRangeSchema;
    'input-rating': AMISInputRatingSchema;
    'input-repeat': AMISInputRepeatSchema;
    'input-rich-text': AMISInputRichTextSchema;
    'select': AMISSelectSchema;
    'service': AMISServiceSchema;
    'static': AMISStaticSchema;
    'input-sub-form': AMISInputSubFormSchema;
    'switch': AMISSwitchSchema;
    'input-table': AMISInputTableSchema;
    'tabs': AMISTabsSchema;
    'tabs-transfer': AMISTabsTransferSchema;
    'input-tag': AMISInputTagSchema;
    'input-text': AMISTextControlSchema;
    'input-password': AMISPasswordSchema;
    'input-email': AMISTextControlSchema;
    'input-url': AMISTextControlSchema;
    'uuid': AMISUuidSchema;
    'multi-select': AMISSelectSchema;
    'textarea': AMISTextareaSchema;
    'transfer': AMISTransferSchema;
    'transfer-picker': AMISTransferPickerSchema;
    'tabs-transfer-picker': AMISTabsTransferPickerSchema;
    'input-tree': AMISInputTreeSchema;
    'tree-select': AMISTreeSelectSchema;
    'table-view': AMISTableViewSchema;
    'portlet': AMISPortletSchema;
    'grid-nav': AMISGridSchema;
    'users-select': AMISUsersSelectSchema;
    'tag': AMISTagSchema;
    'tags': AMISTagSchema;
    'words': AMISWordsSchema;
    'password': AMISPasswordSchema;
    'multiline-text': AMISMultilineTextSchema;
    'amis': AIMSAMISSchema;

    // 原生 input 类型
    'native-date': AMISDateControlSchema;
    'native-time': AMISTimeControlSchema;
    'native-number': AMISNumberControlSchema;
    'code': AMISCodeSchema;
    'tooltip-wrapper': AMISTooltipWrapperSchema;
    'slider': AMISSliderSchema;
  }
}

export type RootRenderer = AMISPageSchema;
