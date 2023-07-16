import 'amis';
import './locale/index';
export * from 'amis-editor-core';
export * from './builder';
import './tpl/index';

// 布局容器
import './plugin/Flex'; // flex布局
import './plugin/Grid'; // 分栏
import './plugin/Container'; // 容器
import './plugin/Layout/Layout_free_container'; // 自由容器
import './plugin/Layout/Layout_sorption_container'; // 吸附容器
import './plugin/Layout/Layout_fixed'; // 悬浮容器
// import './plugin/Layout/Layout1_2_v4';
import './plugin/CollapseGroup'; // 折叠面板
import './plugin/Panel'; // 面板
import './plugin/Tabs'; // 选项卡

// 数据容器
import './plugin/CRUD'; // 增删改查
import './plugin/CRUD2/CRUDTable'; // 增删改查v2.0
import './plugin/Form/Form'; // 表单
import './plugin/Service'; // 服务service

// 表单项
import './plugin/Form/InputText'; // 文本框
import './plugin/Form/Textarea'; // 多行文本框
import './plugin/Form/InputNumber'; // 数字框
import './plugin/Form/Select'; // 下拉框
import './plugin/Form/NestedSelect'; // 级联选择器
import './plugin/Form/ChainedSelect'; // 链式下拉框
import './plugin/DropDownButton'; // 下拉按钮
import './plugin/Form/Checkboxes'; // 复选框
import './plugin/Form/Radios'; // 单选框
import './plugin/Form/Checkbox'; // 勾选框
import './plugin/Form/InputDate'; // 日期
import './plugin/Form/InputDateRange'; // 日期范围
import './plugin/Form/InputFile'; // 文件上传
import './plugin/Form/InputImage'; // 图片上传
import './plugin/Form/InputExcel'; // 上传 Excel
import './plugin/Form/InputTree'; // 树选择器
import './plugin/Form/InputTag'; // 标签选择器
import './plugin/Form/ListSelect'; // 列表选择
import './plugin/Form/ButtonGroupSelect'; // 按钮点选
import './plugin/Form/ButtonToolbar'; // 按钮工具栏
import './plugin/Form/Picker'; // 列表选取
import './plugin/Form/Switch'; // 开关
import './plugin/Form/InputRange'; // 滑块
import './plugin/Form/InputRating'; // 评分
import './plugin/Form/InputCity'; // 城市选择
import './plugin/Form/Transfer'; // 穿梭器
import './plugin/Form/TabsTransfer'; // 组合穿梭器
import './plugin/Form/InputColor'; // 颜色框
import './plugin/Form/ConditionBuilder'; // 条件组合
import './plugin/Form/FieldSet'; // 字段集
import './plugin/Form/Combo'; // 组合输入
import './plugin/Form/InputGroup'; // 输入组合
import './plugin/Form/InputTable'; // 表格编辑器
import './plugin/Form/MatrixCheckboxes'; // 矩阵开关
import './plugin/Form/InputRichText'; // 富文本编辑器
import './plugin/Form/DiffEditor'; // diff编辑器
import './plugin/Form/CodeEditor'; // 代码编辑器
import './plugin/SearchBox'; // 搜索框
import './plugin/Form/InputKV'; // KV键值对
import './plugin/Form/InputRepeat'; // 重复周期
import './plugin/Form/UUID'; // UUID
import './plugin/Form/LocationPicker'; // 地理位置
import './plugin/Form/InputSubForm'; // 子表单项
import './plugin/Form/Hidden'; // 隐藏域

// 功能
import './plugin/Button'; // 按钮
import './plugin/ButtonGroup'; // 按钮组
import './plugin/Nav'; // 导航
import './plugin/AnchorNav'; // 锚点导航
import './plugin/TooltipWrapper'; // 文字提示
import './plugin/Alert'; // 提示
import './plugin/Wizard'; // 向导
import './plugin/TableView'; // 表格视图
import './plugin/WebComponent';
import './plugin/Audio'; // 音频
import './plugin/Video'; // 视频
import './plugin/Custom'; // 自定义代码
import './plugin/Tasks'; // 异步任务
import './plugin/Each'; // 循环
import './plugin/Property'; // 属性表
import './plugin/IFrame';
import './plugin/QRCode'; // 二维码

// 展示
import './plugin/Tpl'; // 文字
import './plugin/Icon'; // 图标
import './plugin/Link'; // 链接
import './plugin/List'; // 列表
import './plugin/Mapping'; // 映射
import './plugin/Avatar'; // 头像
import './plugin/Card'; // 卡片
import './plugin/Card2';
import './plugin/Cards'; // 卡片列表
import './plugin/Table'; // 表格
import './plugin/Table2';
import './plugin/TableCell2'; // 列配置
import './plugin/Chart'; // 图表
import './plugin/Sparkline'; // 走势图
import './plugin/Carousel'; // 轮播图
import './plugin/Image'; // 图片展示
import './plugin/Images'; // 图片集
import './plugin/Time'; // 时间展示
import './plugin/Date'; // 日期展示
import './plugin/Datetime'; // 日期时间展示
import './plugin/Tag'; // 标签
import './plugin/Json'; // JSON展示
import './plugin/Progress'; // 进度展示
import './plugin/Status'; // 状态展示
import './plugin/Steps'; // 步骤条
import './plugin/Timeline'; // 时间轴
import './plugin/Divider'; // 分隔线
import './plugin/CodeView'; // 代码高亮
import './plugin/Markdown';
import './plugin/Collapse'; // 折叠器
import './plugin/OfficeViewer'; // 文档预览
import './plugin/Log'; // 日志

// 其他
import './plugin/Others/Action';
import './plugin/Others/TableCell';
import './plugin/Form/InputArray';
import './plugin/Form/ConditionBuilder';
import './plugin/Form/Control';
import './plugin/Form/InputDateTime';
import './plugin/Form/InputDateTimeRange';
import './plugin/Form/InputEmail';
import './plugin/Form/Formula';
import './plugin/Form/Group';
import './plugin/Form/Item';
import './plugin/Form/InputMonth';
import './plugin/Form/InputMonthRange';
import './plugin/Form/InputPassword';
import './plugin/Form/InputQuarter';
import './plugin/Form/InputQuarterRange';
import './plugin/Form/Static';
import './plugin/Form/InputTime';
import './plugin/Form/InputTimeRange';
import './plugin/Form/TreeSelect';
import './plugin/Form/InputURL';
import './plugin/Form/InputYear';
import './plugin/Form/InputYearRange';
import './plugin/Breadcrumb';
import './plugin/CustomRegion';
import './plugin/Dialog';
import './plugin/Drawer';
import './plugin/HBox';
import './plugin/ListItem';
import './plugin/Operation';
import './plugin/Page';
import './plugin/Pagination';
import './plugin/Plain';
import './plugin/Reset';
import './plugin/Submit';
import './plugin/Wrapper';
import './plugin/ColumnToggler';

import {GridPlugin} from './plugin/Grid';

import './renderer/OptionControl';
import './renderer/NavSourceControl';
import './renderer/NavBadgeControl';
import './renderer/NavDefaultActive';
import './renderer/MapSourceControl';
import './renderer/TimelineItemControl';
import './renderer/APIControl';
import './renderer/APIAdaptorControl';
import './renderer/ValidationControl';
import './renderer/ValidationItem';
import './renderer/SwitchMoreControl';
import './renderer/StatusControl';
import './renderer/FormulaControl';
import './renderer/ExpressionFormulaControl';
import './renderer/textarea-formula/TextareaFormulaControl';
import './renderer/TplFormulaControl';
import './renderer/DateShortCutControl';
import './renderer/BadgeControl';
import './renderer/style-control/BoxModel';
import './renderer/style-control/Font';
import './renderer/style-control/Border';
import './renderer/style-control/BoxShadow';
import './renderer/style-control/Background';
import './renderer/style-control/Display';
import './renderer/style-control/InsetBoxModel';
import './renderer/RangePartsControl';
import './renderer/DataBindingControl';
import './renderer/DataMappingControl';
import './renderer/DataPickerControl';
import './renderer/FeatureControl';
import './renderer/event-control/index';
import './renderer/TreeOptionControl';
import './renderer/TransferTableControl';
import './renderer/style-control/ThemeCssCode';
import './renderer/ButtonGroupControl';
import './renderer/FlexSettingControl';
import './renderer/FieldSetting';
import './renderer/TableColumnWidthControl';
import './renderer/crud2-control/CRUDColumnControl';
import './renderer/crud2-control/CRUDToolbarControl';
import './renderer/crud2-control/CRUDFiltersControl';
import 'amis-theme-editor/lib/locale/zh-CN';
import 'amis-theme-editor/lib/locale/en-US';
import 'amis-theme-editor/lib/renderers/Border';
import 'amis-theme-editor/lib/renderers/ColorPicker';
import 'amis-theme-editor/lib/renderers/Font';
import 'amis-theme-editor/lib/renderers/PaddingAndMargin';
import 'amis-theme-editor/lib/renderers/Radius';
import 'amis-theme-editor/lib/renderers/Shadow';
import 'amis-theme-editor/lib/renderers/Size';
import 'amis-theme-editor/lib/renderers.css';

export * from './component/BaseControl';
export * from './icons/index';

export {GridPlugin};
