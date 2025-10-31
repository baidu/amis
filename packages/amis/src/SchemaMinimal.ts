import {AMISPageSchema} from './renderers/Page';
import {
  AMISButtonSchema,
  AMISDefinitions,
  AMISFormSchema,
  AMISSchemaType
} from 'amis-core';
import {AMISAlertSchema} from './renderers/Alert';
import {AMISFlexSchema} from './renderers/Flex';
import {AMISTplSchema} from './renderers/Tpl';
import {AMISRemarkSchema, RemarkSchema, SchemaRemark} from './renderers/Remark';
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
import {AMISInputArraySchema} from './renderers/Form/InputArray';
import {AMISButtonGroupSelectSchema} from './renderers/Form/ButtonGroupSelect';
import {AMISChainedSelectSchema} from './renderers/Form/ChainedSelect';
import {AMISCheckboxSchema} from './renderers/Form/Checkbox';
import {AMISCheckboxesSchema} from './renderers/Form/Checkboxes';
import {AMISComboSchema} from './renderers/Form/Combo';
import {AMISConditionBuilderSchema} from './renderers/Form/ConditionBuilder';
import {AMISDiffEditorSchema} from './renderers/Form/DiffEditor';
import {AMISCodeEditorSchema} from './renderers/Form/Editor';
import {AMISFieldSetSchema} from './renderers/Form/FieldSet';
import {AMISFormulaSchema} from './renderers/Form/Formula';
import {AMISGroupSchema} from './renderers/Form/Group';
import {AMISHiddenSchema} from './renderers/Form/Hidden';
import {AMISIconPickerSchema} from './renderers/Form/IconPicker';
import {AMISInputCitySchema} from './renderers/Form/InputCity';
import {AMISInputColorSchema} from './renderers/Form/InputColor';
import {
  AMISInputDateSchema,
  AMISInputDateTimeSchema,
  AMISInputTimeSchema,
  AMISInputMonthSchema,
  AMISInputQuarterSchema,
  AMISInputYearSchema
} from './renderers/Form/InputDate';
import {AMISInputDateRangeSchema} from './renderers/Form/InputDateRange';
import {AMISInputFileSchema} from './renderers/Form/InputFile';
import {AMISInputGroupSchema} from './renderers/Form/InputGroup';
import {AMISInputImageSchema} from './renderers/Form/InputImage';
import {AMISInputMonthRangeSchema} from './renderers/Form/InputMonthRange';
import {AMISInputQuarterRangeSchema} from './renderers/Form/InputQuarterRange';
import {AMISInputNumberSchema} from './renderers/Form/InputNumber';
import {AMISInputRangeSchema} from './renderers/Form/InputRange';
import {AMISInputRatingSchema} from './renderers/Form/InputRating';
import {AMISInputRepeatSchema} from './renderers/Form/InputRepeat';
import {AMISInputRichTextSchema} from './renderers/Form/InputRichText';
import {AMISInputSubFormSchema} from './renderers/Form/InputSubForm';
import {AMISInputTableSchema} from './renderers/Form/InputTable';
import {AMISInputTagSchema} from './renderers/Form/InputTag';
import {AMISInputTextSchema} from './renderers/Form/InputText';
import {AMISInputTreeSchema} from './renderers/Form/InputTree';
import {AMISListSelectSchema} from './renderers/Form/ListSelect';
import {AMISLocationPickerSchema} from './renderers/Form/LocationPicker';
import {AMISMatrixCheckboxesSchema} from './renderers/Form/MatrixCheckboxes';
import {AMISNestedSelectSchema} from './renderers/Form/NestedSelect';
import {AMISPickerSchema} from './renderers/Form/Picker';
import {AMISRadiosSchema} from './renderers/Form/Radios';
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
import {AMISJsonSchemaEditorSchema} from './renderers/Form/JSONSchemaEditor';
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
import {AMISDateRangeSchema} from './renderers/DateRange';
import {AMISPasswordSchema} from './renderers/Password';
import {AMISWordsSchema} from './renderers/Words';
import {AMISRadioSchema} from './renderers/Form/Radio';
import {AMISSliderSchema} from './renderers/Slider';
import {AMISMultilineTextSchema} from './renderers/MultilineText';
import {AMISDialogSchema} from './renderers/Dialog';
import {AMISDrawerSchema} from './renderers/Drawer';

export type RootSchema = AMISPageSchema;

declare module 'amis-core' {
  interface AMISSchemaRegistry {
    // ==================== 基础组件 ====================
    /** 表单容器组件，用于收集和提交用户输入数据 */
    'form': AMISFormSchema;
    /** 警告提示组件，用于显示重要信息或警告 */
    'alert': AMISAlertSchema;
    /** 应用容器组件，提供全局配置和布局 */
    // 'app': AMISAppSchema;
    /** 音频播放器组件，支持多种音频格式 */
    'audio': AMISAudioSchema;
    /** 头像组件，用于显示用户头像或图标 */
    'avatar': AMISAvatarSchema;
    /** 按钮组组件，将多个按钮组合在一起 */
    'button-group': AMISButtonGroupSchema;
    /** 面包屑导航组件，显示当前页面在网站中的位置 */
    // 'breadcrumb': AMISBreadcrumbSchema;
    /** 卡片组件，用于展示信息块 */
    'card': AMISCardSchema;
    /** 卡片组件（别名），用于展示信息块 */
    // 'card2': AMISCardSchema;
    /** 卡片列表组件，以卡片形式展示数据列表 */
    'cards': AMISCardsSchema;
    /** 轮播图组件，支持图片或内容的轮播展示 */
    'carousel': AMISCarouselSchema;
    /** 图表组件，支持多种图表类型 */
    'chart': AMISChartSchema;
    /** 日历组件，用于日期选择和事件展示 */
    // 'calendar': AMISCalendarSchema;
    /** 折叠面板组件，可展开/收起内容区域 */
    'collapse': AMISCollapseSchema;
    /** 折叠面板组组件，管理多个折叠面板 */
    'collapse-group': AMISCollapseGroupSchema;
    /** 颜色选择器组件，用于颜色选择 */
    'color': AMISColorSchema;
    /** CRUD 增删改查组件，提供完整的数据操作界面 */
    'crud': AMISCRUDSchema;
    /** CRUD2 增删改查组件（新版），提供完整的数据操作界面 */
    // 'crud2': AMISCRUD2Schema;
    /** 自定义组件，允许开发者自定义渲染逻辑 */
    // 'custom': AMISCustomSchema;
    /** 日期显示组件，用于格式化显示日期 */
    'date': AMISDateSchema;
    /** 静态日期显示组件，用于格式化显示日期 */
    // 'static-date': AMISDateSchema;
    /** 日期时间输入组件，支持日期和时间选择 */
    'datetime': AMISInputDateTimeSchema;
    /** 静态日期时间显示组件，用于格式化显示日期时间 */
    // 'static-datetime': AMISInputDateTimeSchema;
    /** 时间输入组件，用于时间选择 */
    'time': AMISInputTimeSchema;
    /** 静态时间显示组件，用于格式化显示时间 */
    // 'static-time': AMISInputTimeSchema;
    /** 月份输入组件，用于月份选择 */
    'month': AMISInputMonthSchema;
    /** 静态月份显示组件，用于格式化显示月份 */
    // 'static-month': AMISInputMonthSchema;
    /** 日期范围组件，用于选择日期范围 */
    'date-range': AMISDateRangeSchema;
    /** 对话框组件，用于弹窗展示内容 */
    'dialog': AMISDialogSchema;
    /** 加载动画组件，用于显示加载状态 */
    // 'spinner': AMISSpinnerSchema;
    /** 分割线组件，用于分隔内容区域 */
    'divider': AMISDividerSchema;
    /** 下拉按钮组件，将按钮和下拉菜单结合 */
    'dropdown-button': AMISDropdownButtonSchema;
    'drawer': AMISDrawerSchema;
    /** 循环渲染组件，用于遍历数据并渲染 */
    // 'each': AMISEachSchema;
    /** 弹性布局组件，支持 flex 布局 */
    'flex': AMISFlexSchema;
    /** 弹性布局子项组件，flex 布局的子元素 */
    // 'flex-item': AMISFlexSchema;
    /** 二维网格组件，支持二维网格布局 */
    // 'grid-2d': AMISGrid2DSchema;
    /** 图标组件，用于显示各种图标 */
    'icon': AMISIconSchema;
    /** 内嵌框架组件，用于嵌入其他页面 */
    'iframe': AMISIFrameSchema;
    /** 图片组件，用于显示图片 */
    'image': AMISImageSchema;
    /** 静态图片组件，用于显示图片 */
    // 'static-image': AMISImageSchema;
    /** 图片列表组件，以列表形式展示多张图片 */
    'images': AMISImagesSchema;
    /** 静态图片列表组件，以列表形式展示多张图片 */
    // 'static-images': AMISImagesSchema;
    /** JSON Schema 编辑器组件，用于编辑 JSON Schema */
    // 'json-schema': AMISJsonSchemaEditorSchema;
    /** JSON Schema 编辑器组件（别名），用于编辑 JSON Schema */
    // 'json-schema-editor': AMISJsonSchemaEditorSchema;
    /** JSON 数据展示组件，用于格式化显示 JSON 数据 */
    'json': AMISJsonSchema;
    /** 静态 JSON 数据展示组件，用于格式化显示 JSON 数据 */
    // 'static-json': AMISJsonSchema;
    /** 链接组件，用于创建可点击的链接 */
    'link': AMISLinkSchema;
    /** 列表组件，用于展示数据列表 */
    'list': AMISListSchema;
    /** 日志组件，用于显示日志信息 */
    // 'log': AMISLogSchema;
    /** 静态列表组件，用于展示数据列表 */
    // 'static-list': AMISListSchema;
    /** 地图组件，用于显示地图和位置信息 */
    // 'map': AMISLocationPickerSchema;
    /** 数据映射组件，用于数据转换和映射 */
    'mapping': AMISMappingSchema;
    /** Markdown 渲染组件，用于渲染 Markdown 内容 */
    'markdown': AMISMarkdownSchema;
    /** 导航组件，用于页面导航 */
    'nav': AMISNavSchema;
    /** 数字显示组件，用于格式化显示数字 */
    'number': AMISNumberSchema;
    /** 页面组件，作为页面的根容器 */
    'page': AMISPageSchema;
    /** 分页组件，用于数据分页 */
    // 'pagination': AMISPaginationSchema;
    /** 分页包装器组件，为其他组件提供分页功能 */
    // 'pagination-wrapper': AMISPaginationWrapperSchema;
    /** 属性列表组件，用于展示键值对数据 */
    'property': AMISPropertySchema;
    /** 操作列组件，用于表格中的操作按钮 */
    'operation': AMISOperationSchema;
    /** 纯文本组件，用于显示纯文本内容 */
    'plain': AMISPlainSchema;
    /** 文本输入组件，用于文本输入 */
    // 'text': AMISInputTextSchema;
    /** 进度条组件，用于显示进度 */
    'progress': AMISProgressSchema;
    /** 二维码组件，用于生成和显示二维码 */
    'qrcode': AMISQRCodeSchema;
    /** 二维码组件（别名），用于生成和显示二维码 */
    // 'qr-code': AMISQRCodeSchema;
    /** 条形码组件，用于生成和显示条形码 */
    // 'barcode': AMISBarCodeSchema;
    /** 备注组件，用于显示提示信息 */
    'remark': AMISRemarkSchema;
    /** 搜索框组件，用于搜索功能 */
    'search-box': AMISSearchBoxSchema;
    /** 迷你图表组件，用于显示小型图表 */
    // 'sparkline': AMISSparkLineSchema;
    /** 状态组件，用于显示状态信息 */
    'status': AMISStatusSchema;
    /** 表格组件，用于展示表格数据 */
    'table': AMISTableSchema;
    /** 静态表格组件，用于展示表格数据 */
    // 'static-table': AMISInputTableSchema;
    /** 表格组件（新版），用于展示表格数据 */
    // 'table2': AMISTableSchema2;
    /** HTML 模板组件，用于渲染 HTML 内容 */
    // 'html': AMISTplSchema;
    /** 模板组件，用于渲染模板内容 */
    'tpl': AMISTplSchema;
    /** 任务组件，用于展示任务列表 */
    // 'tasks': AMISTasksSchema;
    /** 垂直布局组件，用于垂直排列子元素 */
    'vbox': AMISVBoxSchema;
    /** 视频播放器组件，支持多种视频格式 */
    'video': AMISVideoSchema;
    /** 向导组件，用于多步骤流程 */
    'wizard': AMISWizardSchema;
    /** 包装器组件，用于包装其他组件 */
    'wrapper': AMISWrapperSchema;
    /** Web 组件，用于集成自定义 Web 组件 */
    // 'web-component': AMISWebComponentSchema;
    /** 锚点导航组件，用于页面内导航 */
    'anchor-nav': AMISAnchorNavSchema;
    /** 步骤条组件，用于显示步骤进度 */
    // 'steps': AMISStepsSchema;
    /** 时间轴组件，用于展示时间线 */
    'timeline': AMISTimelineSchema;
    /** 表单控件组件，通用表单控件基类 */
    // 'control': AMISFormControlSchema;
    /** 数组输入组件，用于输入数组数据 */
    // 'input-array': AMISInputArraySchema;
    /** 动作按钮组件，用于执行各种动作 */
    // 'action': AMISButtonSchema;
    /** 按钮组件，用于触发动作 */
    'button': AMISButtonSchema;
    /** 提交按钮组件，用于提交表单 */
    'submit': AMISButtonSchema;
    /** 重置按钮组件，用于重置表单 */
    'reset': AMISButtonSchema;
    /** 按钮组选择组件，将按钮组作为选择器使用 */
    'button-group-select': AMISButtonGroupSelectSchema;
    /** 按钮工具栏组件，用于工具栏中的按钮组 */
    'button-toolbar': AMISButtonToolbarSchema;
    /** 级联选择组件，支持级联选择 */
    'chained-select': AMISChainedSelectSchema;
    /** 图表单选组件，以图表形式展示单选选项 */
    // 'chart-radios': AMISRadiosSchema;
    /** 复选框组件，用于多选 */
    'checkbox': AMISCheckboxSchema;
    /** 复选框组组件，用于多选 */
    'checkboxes': AMISCheckboxesSchema;
    /** 城市选择组件，用于选择城市 */
    'input-city': AMISInputCitySchema;
    /** 颜色输入组件，用于颜色选择 */
    'input-color': AMISInputColorSchema;
    /** 组合输入组件，用于复杂输入场景 */
    'combo': AMISComboSchema;
    /** 条件构建器组件，用于构建复杂条件 */
    // 'condition-builder': AMISConditionBuilderSchema;
    /** 容器组件，用于布局和包装 */
    'container': AMISContainerSchema;
    /** 开关容器组件，根据条件显示不同内容 */
    'switch-container': AMISSwitchContainerSchema;
    /** 日期输入组件，用于日期选择 */
    'input-date': AMISInputDateSchema;
    /** 日期时间输入组件，用于日期时间选择 */
    'input-datetime': AMISInputDateTimeSchema;
    /** 时间输入组件，用于时间选择 */
    'input-time': AMISInputTimeSchema;
    /** 季度输入组件，用于季度选择 */
    'input-quarter': AMISInputQuarterSchema;
    /** 年份输入组件，用于年份选择 */
    'input-year': AMISInputYearSchema;
    /** 年份范围输入组件，用于年份范围选择 */
    'input-year-range': AMISInputDateRangeSchema;
    /** 月份输入组件，用于月份选择 */
    'input-month': AMISInputMonthSchema;
    /** 日期范围输入组件，用于日期范围选择 */
    'input-date-range': AMISInputDateRangeSchema;
    /** 时间范围输入组件，用于时间范围选择 */
    'input-time-range': AMISInputDateRangeSchema;
    /** 日期时间范围输入组件，用于日期时间范围选择 */
    'input-datetime-range': AMISInputDateRangeSchema;
    /** Excel 文件输入组件，用于上传 Excel 文件 */
    'input-excel': AMISInputFileSchema;
    /** 公式输入组件，用于输入和计算公式 */
    // 'input-formula': AMISFormulaSchema;
    /** 差异编辑器组件，用于比较和编辑差异 */
    // 'diff-editor': AMISDiffEditorSchema;
    /** Office 文档查看器组件，用于查看 Office 文档 */
    // 'office-viewer': AMISOfficeViewerSchema;
    /** PDF 查看器组件，用于查看 PDF 文档 */
    // 'pdf-viewer': AMISPdfViewerSchema;
    /** 签名输入组件，用于电子签名 */
    'input-signature': AMISInputSignatureSchema;
    /** 验证码输入组件，用于输入验证码 */
    'input-verification-code': AMISInputTextSchema;
    /** 形状组件，用于绘制各种形状 */
    'shape': AMISIShapeSchema;

    // ==================== 代码编辑器系列 ====================
    /** 代码编辑器 */
    'editor': AMISCodeEditorSchema;
    /** Batch 脚本编辑器 */
    // 'bat-editor': AMISCodeEditorSchema;
    /** C 语言编辑器 */
    // 'c-editor': AMISCodeEditorSchema;
    /** CoffeeScript 编辑器 */
    // 'coffeescript-editor': AMISCodeEditorSchema;
    /** C++ 编辑器 */
    // 'cpp-editor': AMISCodeEditorSchema;
    /** C# 编辑器 */
    // 'csharp-editor': AMISCodeEditorSchema;
    /** CSS 编辑器 */
    // 'css-editor': AMISCodeEditorSchema;
    /** Dockerfile 编辑器 */
    // 'dockerfile-editor': AMISCodeEditorSchema;
    /** F# 编辑器 */
    // 'fsharp-editor': AMISCodeEditorSchema;
    /** Go 语言编辑器 */
    // 'go-editor': AMISCodeEditorSchema;
    /** Handlebars 模板编辑器 */
    // 'handlebars-editor': AMISCodeEditorSchema;
    /** HTML 编辑器 */
    // 'html-editor': AMISCodeEditorSchema;
    /** INI 配置文件编辑器 */
    // 'ini-editor': AMISCodeEditorSchema;
    /** Java 编辑器 */
    // 'java-editor': AMISCodeEditorSchema;
    /** JavaScript 编辑器 */
    // 'javascript-editor': AMISCodeEditorSchema;
    /** JSON 编辑器 */
    // 'json-editor': AMISCodeEditorSchema;
    /** Less 样式编辑器 */
    // 'less-editor': AMISCodeEditorSchema;
    /** Lua 编辑器 */
    // 'lua-editor': AMISCodeEditorSchema;
    /** Markdown 编辑器 */
    // 'markdown-editor': AMISCodeEditorSchema;
    /** MSDAX 编辑器 */
    // 'msdax-editor': AMISCodeEditorSchema;
    /** Objective-C 编辑器 */
    // 'objective-c-editor': AMISCodeEditorSchema;
    /** PHP 编辑器 */
    // 'php-editor': AMISCodeEditorSchema;
    /** 纯文本编辑器 */
    // 'plaintext-editor': AMISCodeEditorSchema;
    /** Postiats 编辑器 */
    // 'postiats-editor': AMISCodeEditorSchema;
    /** PowerShell 编辑器 */
    // 'powershell-editor': AMISCodeEditorSchema;
    /** Pug 模板编辑器 */
    // 'pug-editor': AMISCodeEditorSchema;
    /** Python 编辑器 */
    //  'python-editor': AMISCodeEditorSchema;
    /** R 语言编辑器 */
    // 'r-editor': AMISCodeEditorSchema;
    /** Razor 模板编辑器 */
    // 'razor-editor': AMISCodeEditorSchema;
    /** Ruby 编辑器 */
    // 'ruby-editor': AMISCodeEditorSchema;
    /** Small Basic 编辑器 */
    // 'sb-editor': AMISCodeEditorSchema;
    /** SCSS 样式编辑器 */
    // 'scss-editor': AMISCodeEditorSchema;
    /** Solidity 编辑器 */
    // 'sol-editor': AMISCodeEditorSchema;
    /** SQL 编辑器 */
    // 'sql-editor': AMISCodeEditorSchema;
    /** Swift 编辑器 */
    // 'swift-editor': AMISCodeEditorSchema;
    /** TypeScript 编辑器 */
    // 'typescript-editor': AMISCodeEditorSchema;
    /** VB.NET 编辑器 */
    // 'vb-editor': AMISCodeEditorSchema;
    /** XML 编辑器 */
    // 'xml-editor': AMISCodeEditorSchema;
    /** YAML 编辑器 */
    // 'yaml-editor': AMISCodeEditorSchema;

    // ==================== 表单项组件 ====================
    /** 字段集 */
    'fieldset': AMISFieldSetSchema;
    /** 字段集（别名） */
    // 'fieldSet': AMISFieldSetSchema;
    /** 文件上传 */
    'input-file': AMISInputFileSchema;
    /** 公式 */
    'formula': AMISFormulaSchema;
    /** 网格布局 */
    'grid': AMISGridSchema;
    /** 分组 */
    'group': AMISGroupSchema;
    /** 水平布局 */
    'hbox': AMISHBoxSchema;
    /** 隐藏字段 */
    'hidden': AMISHiddenSchema;
    /** 图标选择器 */
    // 'icon-picker': AMISIconPickerSchema;
    /** 图标选择器（别名） */
    // 'icon-select': AMISIconPickerSchema;
    /** 图片上传 */
    'input-image': AMISInputImageSchema;
    /** 输入组合 */
    'input-group': AMISInputGroupSchema;
    /** 列表选择 */
    'list-select': AMISListSelectSchema;
    /** 位置选择器 */
    // 'location-picker': AMISLocationPickerSchema;
    /** 矩阵复选框 */
    // 'matrix-checkboxes': AMISMatrixCheckboxesSchema;
    /** 月份范围输入 */
    'input-month-range': AMISInputMonthRangeSchema;
    /** 季度范围输入 */
    'input-quarter-range': AMISInputQuarterRangeSchema;
    /** 嵌套选择 */
    'nested-select': AMISNestedSelectSchema;
    /** 数字输入 */
    'input-number': AMISInputNumberSchema;
    /** 面板 */
    'panel': AMISPanelSchema;
    /** 选择器 */
    'picker': AMISPickerSchema;
    /** 单选按钮 */
    'radio': AMISRadioSchema;
    /** 单选按钮组 */
    'radios': AMISRadiosSchema;
    /** 范围输入 */
    'input-range': AMISInputRangeSchema;
    /** 评分输入 */
    'input-rating': AMISInputRatingSchema;
    /** 重复输入 */
    // 'input-repeat': AMISInputRepeatSchema;
    /** 富文本输入 */
    'input-rich-text': AMISInputRichTextSchema;
    /** 下拉选择 */
    'select': AMISSelectSchema;
    /** 服务 */
    'service': AMISServiceSchema;
    /** 静态展示 */
    'static': AMISStaticSchema;
    /** 子表单输入 */
    // 'input-sub-form': AMISInputSubFormSchema;
    /** 开关 */
    'switch': AMISSwitchSchema;
    /** 表格输入 */
    'input-table': AMISInputTableSchema;
    /** 标签页 */
    'tabs': AMISTabsSchema;
    /** 标签页穿梭框 */
    // 'tabs-transfer': AMISTabsTransferSchema;
    /** 标签输入 */
    'input-tag': AMISInputTagSchema;
    /** 文本输入 */
    'input-text': AMISInputTextSchema;
    /** 密码输入 */
    'input-password': AMISPasswordSchema;
    /** 邮箱输入 */
    'input-email': AMISInputTextSchema;
    /** URL 输入 */
    'input-url': AMISInputTextSchema;
    /** UUID 生成 */
    // 'uuid': AMISUuidSchema;
    /** 多选 */
    // 'multi-select': AMISSelectSchema;
    /** 多行文本输入 */
    'textarea': AMISTextareaSchema;
    /** 穿梭框 */
    // 'transfer': AMISTransferSchema;
    /** 穿梭框选择器 */
    // 'transfer-picker': AMISTransferPickerSchema;
    /** 标签页穿梭框选择器 */
    // 'tabs-transfer-picker': AMISTabsTransferPickerSchema;
    /** 树形输入 */
    'input-tree': AMISInputTreeSchema;
    /** 树形选择 */
    'tree-select': AMISTreeSelectSchema;
    /** 表格视图 */
    'table-view': AMISTableViewSchema;
    /** 门户 */
    // 'portlet': AMISPortletSchema;
    /** 网格导航 */
    'grid-nav': AMISGridSchema;
    /** 用户选择 */
    // 'users-select': AMISUsersSelectSchema;
    /** 标签 */
    // 'tag': AMISTagSchema;
    /** 标签（别名） */
    'tag': AMISTagSchema;
    'tags': AMISWordsSchema;
    // 'words': AMISWordsSchema;
    /** 密码（别名） */
    'password': AMISPasswordSchema;
    /** 多行文本 */
    // 'multiline-text': AMISMultilineTextSchema;
    /** AMIS 组件 */
    // 'amis': AIMSAMISSchema;

    // ==================== 原生输入组件 ====================
    /** 原生日期输入 */
    'native-date': AMISInputDateSchema;
    /** 原生时间输入 */
    'native-time': AMISInputTimeSchema;
    /** 原生数字输入 */
    'native-number': AMISInputNumberSchema;
    /** 代码展示 */
    // 'code': AMISCodeSchema;
    /** 工具提示包装器 */
    // 'tooltip-wrapper': AMISTooltipWrapperSchema;
    /** 滑块 */
    // 'slider': AMISSliderSchema;
  }
}

export type RootRenderer = AMISPageSchema;
// export type RootRenderer = AMISPageSchema & {
//   definitions?: AMISDefinitions;
//   type?: AMISSchemaType;
// };
export {AMISSchemaType} from 'amis-core';
