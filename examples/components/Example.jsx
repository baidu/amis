import React from 'react';
import {match} from 'path-to-regexp';
import makeSchemaRenderer from './SchemaRender';

import IndexPageSchema from './Index';
import ErrorPageSchema from './Page/Error';
import FormPageSchema from './Page/Form';
import ModeFormSchema from './Form/Mode';
import FieldSetFormSchema from './Form/FieldSet';
import TabsFormSchema from './Form/Tabs';
import RemoteFormSchema from './Form/Remote';
import ReactionFormSchema from './Form/Reaction';
import ValidationFormSchema from './Form/Validation';
import FullFormSchema from './Form/Full';
import StaticFormSchema from './Form/Static';
import SwitchFormDisplay from './Form/SwitchDisplay';
import HintFormSchema from './Form/Hint';
import FieldSetInTabsFormSchema from './Form/FieldSetInTabs';
import ComboFormSchema from './Form/Combo';
import ConditionBuilderSchema from './Form/ConditionBuilder';
import StyleBuilderSchema from './Form/StyleBuilder';
import SubFormSchema from './Form/SubForm';
import RichTextSchema from './Form/RichText';
import EditorSchema from './Form/Editor';
import TestFormSchema from './Form/Test';
import TransferFormSchema from './Form/Transfer';
import TableFormSchema from './Form/Table';
import PickerFormSchema from './Form/Picker';
import FormulaFormSchema from './Form/Formula';
import CustomFormSchema from './Form/Custom';
import FormLayoutTestSchema from './Form/layoutTest';
import Definitions from './Form/Definitions';
import AnchorNav from './Form/AnchorNav';
import InputKVSSchema from './Form/InputKVS';
import Tree from './Form/Tree';

import TableCrudSchema from './CRUD/Table';
import TableAutoFillSchema from './CRUD/TableAutoFill';
import ItemActionsSchema from './CRUD/ItemActions';
import GridCrudSchema from './CRUD/Grid';
import ListCrudSchema from './CRUD/List';
import LoadMoreSchema from './CRUD/LoadMore';
import TestCrudSchema from './CRUD/test';
import FixedCrudSchema from './CRUD/Fix';
import AsideCrudSchema from './CRUD/Aside';
import Aside2CrudSchema from './CRUD/Aside2';
import FieldsCrudSchema from './CRUD/Fields';
import JumpNextCrudSchema from './CRUD/JumpNext';
import PopOverCrudSchema from './CRUD/PopOver';
import KeyboardsCrudSchema from './CRUD/Keyboards';
import FootableCrudSchema from './CRUD/Footable';
import NestedCrudSchema from './CRUD/Nested';
import MergeCellSchema from './CRUD/MergeCell';
import HeaderGroupSchema from './CRUD/HeaderGroup';
import HeaderHideSchema from './CRUD/HeaderHide';
import LoadOnceTableCrudSchema from './CRUD/LoadOnce';
import ExportCSVExcelSchema from './CRUD/ExportCSVExcel';
import CRUDDynamicSchema from './CRUD/Dynamic';
import CRUDSimplePagerSchema from './CRUD/SimplePager';
import CRUDParsePrimitiveQuerySchema from './CRUD/ParsePrimitiveQuery';
import ItemActionchema from './CRUD/ItemAction';
import SdkTest from './Sdk/Test';
import JSONSchemaForm from './Form/Schem';
import SimpleDialogSchema from './Dialog/Simple';
import DrwaerSchema from './Dialog/Drawer';

import PageLinkPageSchema from './Linkage/Page';
import FormLinkPageSchema from './Linkage/Form';
import Form2LinkPageSchema from './Linkage/Form2';
import CRUDLinkPageSchema from './Linkage/CRUD';
import OptionsPageSchema from './Linkage/Options';
import OptionsLocalPageSchema from './Linkage/OptionsLocal';
import FormSubmitSchema from './Linkage/FormSubmit';
import InputEventSchema from './EventAction/cmpt-event-action/InputEvent';
import DateEventSchema from './EventAction/cmpt-event-action/DateEvent';
import TagEvent from './EventAction/cmpt-event-action/TagEvent';
import SwitchEventSchema from './EventAction/cmpt-event-action/SwitchEvent';
import TabsEventSchema from './EventAction/cmpt-event-action/TabsEvent';
import UploadEventSchema from './EventAction/cmpt-event-action/UploadEvent';
import SelectEventActionSchema from './EventAction/cmpt-event-action/SelectEvent';
import ButtonEventActionSchema from './EventAction/cmpt-event-action/ButtonEvent';
import InputRatingEventSchema from './EventAction/cmpt-event-action/InputRatingEvent';
import ExcelEventSchema from './EventAction/cmpt-event-action/ExcelEvent';
import WizardEventSchema from './EventAction/cmpt-event-action/WizardEvent';
import InputTreeEventSchema from './EventAction/cmpt-event-action/InputTreeEvent';
import treeSelectEventSchema from './EventAction/cmpt-event-action/treeSelectEvent';
import FormEventActionSchema from './EventAction/cmpt-event-action/FormEvent';
import TransferEventSchema from './EventAction/cmpt-event-action/TransferEvent';
import ServiceEventSchema from './EventAction/cmpt-event-action/ServiceEvent';
import CarouselEventSchema from './EventAction/cmpt-event-action/CarouselEvent';
import TableEventSchema from './EventAction/cmpt-event-action/TableEvent';
import ListEventSchema from './EventAction/cmpt-event-action/ListEvent';
import ChartEventSchema from './EventAction/cmpt-event-action/ChartEvent';
import SearchBoxEventSchema from './EventAction/cmpt-event-action/SearchBoxEvent';
import ReloadFormActionSchema from './EventAction/reload-action/ReloadForm';
import ReloadSelectActionSchema from './EventAction/reload-action/ReloadSelect';
import ReloadChartActionSchema from './EventAction/reload-action/ReloadChart';
import UpdateFormActionSchema from './EventAction/update-data/UpdateForm';
import UpdateDialogActionSchema from './EventAction/update-data/UpdateDialog';
import UpdateWizardActionSchema from './EventAction/update-data/UpdateWizard';
import UpdateChartActionSchema from './EventAction/update-data/UpdateChart';
import UpdateInputActionSchema from './EventAction/update-data/UpdateInput';
import UpdateSelectActionSchema from './EventAction/update-data/UpdateSelect';
import UpdateButtonGroupSelectActionSchema from './EventAction/update-data/UpdateButtonGroupSelect';
import UpdateComboActionSchema from './EventAction/update-data/UpdateCombo';
import SyncUpdateActionSchema from './EventAction/update-data/SyncUpdate';
import DataAutoFillActionSchema from './EventAction/update-data/DataAutoFill';
import SetVariable from './EventAction/update-data/SetVariable';
import PreventFormActionSchema from './EventAction/prevent-defalut/PreventForm';
import WizardSchema from './Wizard';
import ChartSchema from './Chart';
import EChartsEditorSchema from './ECharts';
import HorizontalSchema from './Horizontal';
import VideoSchema from './Video';
import AudioSchema from './Audio';
import CarouselSchema from './Carousel';
import TasksSchema from './Tasks';
import ServicesDataSchema from './Services/Data';
import ServicesSchemaSchema from './Services/Schema';
import ServicesFormSchema from './Services/Form';
import IFrameSchema from './IFrame';
import ThemeSchema from './Theme';
import NormalTabSchema from './Tabs/Normal';
import FormTabSchema from './Tabs/Form';
import DynamicTabSchema from './Tabs/Dynamic';
import Tab1Schema from './Tabs/Tab1';
import Tab2Schema from './Tabs/Tab2';
import Tab3Schema from './Tabs/Tab3';
import Loading from './Loading';
import CodeSchema from './Code';
import OfficeViewer from './OfficeViewer';
import InputTableEvent from './EventAction/cmpt-event-action/InputTableEvent';
import WizardPage from './WizardPage';

import {Switch} from 'react-router-dom';
import {navigations2route} from './App';

export const examples = [
  {
    // prefix: ({classnames: cx}) => <li className={cx('AsideNav-divider')} />,
    label: '示例',
    children: [
      {
        label: '页面',
        icon: 'fa fa-th',
        badge: 3,
        badgeClassName: 'bg-info',
        children: [
          {
            label: '简单页面',
            path: '/examples/index',
            component: makeSchemaRenderer(IndexPageSchema)
          },
          {
            label: '初始化出错',
            path: '/examples/pages/error',
            component: makeSchemaRenderer(ErrorPageSchema)
          },
          {
            label: '表单页面',
            path: '/examples/pages/form',
            component: makeSchemaRenderer(FormPageSchema)
          }
        ]
      },

      {
        label: '表单',
        icon: 'fa fa-list-alt',
        children: [
          {
            label: '表单展示模式',
            path: '/examples/form/mode',
            component: makeSchemaRenderer(ModeFormSchema)
          },

          {
            label: '所有类型汇总',
            path: '/examples/form/full',
            component: makeSchemaRenderer(FullFormSchema)
          },

          {
            label: '静态展示',
            path: '/examples/form/static',
            component: makeSchemaRenderer(StaticFormSchema)
          },

          {
            label: '输入态、展示态切换',
            path: '/examples/form/switchDisplay',
            component: makeSchemaRenderer(SwitchFormDisplay)
          },

          {
            label: '输入提示',
            path: '/examples/form/hint',
            component: makeSchemaRenderer(HintFormSchema)
          },

          {
            label: 'FieldSet',
            path: '/examples/form/fieldset',
            component: makeSchemaRenderer(FieldSetFormSchema)
          },

          {
            label: 'Tabs',
            path: '/examples/form/tabs',
            component: makeSchemaRenderer(TabsFormSchema)
          },

          {
            label: 'FieldSet Tabs 组合',
            path: '/examples/form/fields-tabs',
            component: makeSchemaRenderer(FieldSetInTabsFormSchema)
          },

          {
            label: '动态数据',
            path: '/examples/form/remote',
            component: makeSchemaRenderer(RemoteFormSchema)
          },

          {
            label: '显隐状态联动',
            path: '/examples/form/reaction',
            component: makeSchemaRenderer(ReactionFormSchema)
          },

          {
            label: '表单验证',
            path: '/examples/form/validation',
            component: makeSchemaRenderer(ValidationFormSchema)
          },

          {
            label: '组合类型',
            path: '/examples/form/combo',
            component: makeSchemaRenderer(ComboFormSchema)
          },

          {
            label: '穿梭器',
            path: '/examples/form/transfer',
            component: makeSchemaRenderer(TransferFormSchema)
          },

          {
            label: '多功能选择器',
            path: '/examples/form/picker',
            component: makeSchemaRenderer(PickerFormSchema)
          },

          {
            label: '子表单',
            path: '/examples/form/sub-form',
            component: makeSchemaRenderer(SubFormSchema)
          },

          // {
          //   label: 'JSon Schema表单',
          //   path: '/examples/form/json-schema',
          //   component: JSONSchemaForm
          // },

          {
            label: '富文本',
            path: '/examples/form/rich-text',
            component: makeSchemaRenderer(RichTextSchema)
          },

          {
            label: '代码编辑器',
            path: '/examples/form/ide',
            component: makeSchemaRenderer(EditorSchema)
          },

          {
            label: '自定义组件',
            path: '/examples/form/custom',
            component: makeSchemaRenderer(CustomFormSchema)
          },

          {
            label: '表格编辑',
            path: '/examples/form/table',
            component: makeSchemaRenderer(TableFormSchema)
          },

          {
            label: '公式示例',
            path: '/examples/form/formula',
            component: makeSchemaRenderer(FormulaFormSchema)
          },
          {
            label: '条件组合',
            path: '/examples/form/condition-builder',
            component: makeSchemaRenderer(ConditionBuilderSchema)
          },

          {
            label: '引用',
            path: '/examples/form/definitions',
            component: makeSchemaRenderer(Definitions)
          },

          {
            label: '样式编辑',
            path: '/examples/form/style-builder',
            component: makeSchemaRenderer(StyleBuilderSchema)
          },

          {
            label: '锚点导航',
            path: '/examples/form/anchor-nav',
            component: makeSchemaRenderer(AnchorNav)
          },

          {
            label: '复杂嵌套数据',
            path: '/examples/form/input-kvs',
            component: makeSchemaRenderer(InputKVSSchema)
          },

          {
            label: '树形结构',
            path: '/examples/form/tree',
            component: makeSchemaRenderer(Tree)
          }

          // {
          //     label: '布局测试',
          //     path: '/examples/form/layout-test',
          //     component: makeSchemaRenderer(FormLayoutTestSchema)
          // },

          // {
          //     label: '测试',
          //     path: '/examples/form/test',
          //     component: makeSchemaRenderer(TestFormSchema)
          // },
        ]
      },

      {
        label: '增删改查',
        icon: 'fa fa-table',
        children: [
          {
            label: '表格模式',
            path: '/examples/crud/table',
            component: makeSchemaRenderer(TableCrudSchema)
          },
          {
            label: '表格高度自适应',
            path: '/examples/crud/auto-fill',
            component: makeSchemaRenderer(TableAutoFillSchema)
          },
          {
            label: '卡片模式',
            path: '/examples/crud/grid',
            component: makeSchemaRenderer(GridCrudSchema)
          },
          {
            label: '列表模式',
            path: '/examples/crud/list',
            component: makeSchemaRenderer(ListCrudSchema)
          },
          {
            label: '加载更多模式',
            path: '/examples/crud/load-more',
            component: makeSchemaRenderer(LoadMoreSchema)
          },
          {
            label: '操作交互显示',
            path: '/examples/crud/item-actions',
            component: makeSchemaRenderer(ItemActionsSchema)
          },
          {
            label: '列类型汇总',
            path: '/examples/crud/columns',
            component: makeSchemaRenderer(FieldsCrudSchema)
          },
          {
            label: '可折叠',
            path: '/examples/crud/footable',
            component: makeSchemaRenderer(FootableCrudSchema)
          },
          {
            label: '嵌套',
            path: '/examples/crud/nested',
            component: makeSchemaRenderer(NestedCrudSchema)
          },
          {
            label: '合并单元格',
            path: '/examples/crud/merge-cell',
            component: makeSchemaRenderer(MergeCellSchema)
          },
          {
            label: '表头分组',
            path: '/examples/crud/header-group',
            component: makeSchemaRenderer(HeaderGroupSchema)
          },
          {
            label: '表头隐藏',
            path: '/examples/crud/header-hide',
            component: makeSchemaRenderer(HeaderHideSchema)
          },
          {
            label: '带边栏（用 tree）',
            path: '/examples/crud/aside',
            component: makeSchemaRenderer(AsideCrudSchema)
          },
          {
            label: '带边栏（用 Nav）',
            path: '/examples/crud/aside2',
            component: makeSchemaRenderer(Aside2CrudSchema)
          },
          {
            label: '固定表头/列',
            path: '/examples/crud/fixed',
            component: makeSchemaRenderer(FixedCrudSchema)
          },
          {
            label: '键盘操作编辑',
            path: '/examples/crud/keyboards',
            component: makeSchemaRenderer(KeyboardsCrudSchema)
          },
          {
            label: '操作并下一个',
            path: '/examples/crud/jump-next',
            component: makeSchemaRenderer(JumpNextCrudSchema)
          },
          {
            label: '列展示详情',
            path: '/examples/crud/popover',
            component: makeSchemaRenderer(PopOverCrudSchema)
          },
          {
            label: '一次性加载',
            path: '/examples/crud/load-once',
            component: makeSchemaRenderer(LoadOnceTableCrudSchema)
          },
          {
            label: '点击联动',
            path: '/examples/crud/item-action',
            component: makeSchemaRenderer(ItemActionchema)
          },
          {
            label: '导出 Excel/CSV',
            path: '/examples/crud/export-excel-csv',
            component: makeSchemaRenderer(ExportCSVExcelSchema)
          },
          {
            label: '动态列',
            path: '/examples/crud/dynamic',
            component: makeSchemaRenderer(CRUDDynamicSchema)
          },
          {
            label: '简单分页',
            path: '/examples/crud/simple-pager',
            component: makeSchemaRenderer(CRUDSimplePagerSchema)
          },
          {
            label: '解析Query参数',
            path: '/examples/crud/parse-primitive-query',
            component: makeSchemaRenderer(CRUDParsePrimitiveQuerySchema)
          }
          // {
          //     label: '测试',
          //     path: '/examples/crud/test',
          //     component: makeSchemaRenderer(TestCrudSchema)
          // }
        ]
      },

      {
        label: '弹框',
        icon: 'fa fa-bomb',
        children: [
          {
            label: '对话框',
            path: '/examples/dialog/simple',
            component: makeSchemaRenderer(SimpleDialogSchema)
          },
          {
            label: '侧边弹出',
            path: '/examples/dialog/drawer',
            component: makeSchemaRenderer(DrwaerSchema)
          }
        ]
      },

      {
        label: '选项卡',
        icon: 'fa fa-clone',
        children: [
          {
            label: '常规选项卡',
            path: '/examples/tabs/normal',
            component: makeSchemaRenderer(NormalTabSchema)
          },

          {
            label: '表单中选项卡分组',
            path: '/examples/tabs/form',
            component: makeSchemaRenderer(FormTabSchema)
          },

          {
            label: '动态选项卡',
            path: '/examples/tabs/dynamic',
            component: makeSchemaRenderer(DynamicTabSchema)
          },
          {
            label: '选项卡页面1',
            path: '/examples/tabs/tab1',
            component: makeSchemaRenderer(Tab1Schema)
          },
          {
            label: '选项卡页面2',
            path: '/examples/tabs/tab2',
            component: makeSchemaRenderer(Tab2Schema)
          },
          {
            label: '选项卡页面3',
            path: '/examples/tabs/tab3',
            component: makeSchemaRenderer(Tab3Schema)
          }
        ]
      },

      {
        label: '联动',
        icon: 'fa fa-bolt',
        children: [
          {
            label: '地址栏变化自动更新',
            path: '/examples/linkpage/page',
            component: makeSchemaRenderer(PageLinkPageSchema)
          },
          {
            label: '选项联动',
            path: '/examples/linkpage/options-local',
            component: makeSchemaRenderer(OptionsLocalPageSchema)
          },
          {
            label: '选项远程联动',
            path: '/examples/linkpage/options',
            component: makeSchemaRenderer(OptionsPageSchema)
          },
          {
            label: '表单和表单联动',
            path: '/examples/linkpage/form',
            component: makeSchemaRenderer(FormLinkPageSchema)
          },
          {
            label: '表单提交后显示结果',
            path: '/examples/linkpage/form-submit',
            component: makeSchemaRenderer(FormSubmitSchema)
          },
          {
            label: '表单自动更新',
            path: '/examples/linkpage/form2',
            component: makeSchemaRenderer(Form2LinkPageSchema)
          },
          {
            label: '表单和列表联动',
            path: '/examples/linkpage/crud',
            component: makeSchemaRenderer(CRUDLinkPageSchema)
          }
        ]
      },

      {
        label: '事件动作机制',
        icon: 'fa fa-bullhorn',
        children: [
          {
            label: '刷新',
            children: [
              {
                label: '刷新表单',
                path: '/examples/action/reload/form',
                component: makeSchemaRenderer(ReloadFormActionSchema)
              },
              {
                label: '刷新图表',
                path: '/examples/action/reload/chart',
                component: makeSchemaRenderer(ReloadChartActionSchema)
              },
              {
                label: '刷新下拉框',
                path: '/examples/action/reload/select',
                component: makeSchemaRenderer(ReloadSelectActionSchema)
              }
            ]
          },
          {
            label: '更新数据',
            children: [
              {
                label: '更新表单数据',
                path: '/examples/action/setdata/form',
                component: makeSchemaRenderer(UpdateFormActionSchema)
              },
              {
                label: '更新弹窗数据',
                path: '/examples/action/setdata/dialog',
                component: makeSchemaRenderer(UpdateDialogActionSchema)
              },
              {
                label: '更新向导数据',
                path: '/examples/action/setdata/wizard',
                component: makeSchemaRenderer(UpdateWizardActionSchema)
              },
              {
                label: '更新图表数据',
                path: '/examples/action/setdata/chart',
                component: makeSchemaRenderer(UpdateChartActionSchema)
              },
              {
                label: '更新输入框的值',
                path: '/examples/action/setdata/input',
                component: makeSchemaRenderer(UpdateInputActionSchema)
              },
              {
                label: '更新下拉框的值',
                path: '/examples/action/setdata/select',
                component: makeSchemaRenderer(UpdateSelectActionSchema)
              },
              {
                label: '更新点选按钮的值',
                path: '/examples/action/setdata/button-group-select',
                component: makeSchemaRenderer(
                  UpdateButtonGroupSelectActionSchema
                )
              },
              {
                label: '更新输入组合的值',
                path: '/examples/action/setdata/combo',
                component: makeSchemaRenderer(UpdateComboActionSchema)
              },
              {
                label: '联动更新',
                path: '/examples/action/setdata/sync',
                component: makeSchemaRenderer(SyncUpdateActionSchema)
              },
              {
                label: '数据回填',
                path: '/examples/action/setdata/autofill',
                component: makeSchemaRenderer(DataAutoFillActionSchema)
              },
              {
                label: '更新全局变量数据',
                path: '/examples/action/setdata/variable',
                component: makeSchemaRenderer(
                  SetVariable.schema,
                  SetVariable.props ?? {},
                  true,
                  SetVariable.env
                )
              }
            ]
          },
          {
            label: '执行其他组件动作',
            children: [
              {
                label: '按钮类组件',
                path: '/examples/event/button',
                component: makeSchemaRenderer(ButtonEventActionSchema)
              },
              {
                label: '输入类组件',
                path: '/examples/event/input',
                component: makeSchemaRenderer(InputEventSchema)
              },
              {
                label: '上传类组件',
                path: '/examples/event/upload',
                component: makeSchemaRenderer(UploadEventSchema)
              },
              {
                label: '下拉选择类',
                path: '/examples/event/select',
                component: makeSchemaRenderer(SelectEventActionSchema)
              },
              {
                label: '时间类组件',
                path: 'examples/event/date',
                component: makeSchemaRenderer(DateEventSchema)
              },
              {
                label: '可关闭的tag group',
                path: 'examples/event/each-tag',
                component: makeSchemaRenderer(TagEvent)
              },
              {
                label: '开关组件',
                path: 'examples/event/switch',
                component: makeSchemaRenderer(SwitchEventSchema)
              },
              {
                label: '选项卡组件',
                path: 'examples/event/tabs',
                component: makeSchemaRenderer(TabsEventSchema)
              },
              {
                label: '评分组件',
                path: 'examples/event/input-rating',
                component: makeSchemaRenderer(InputRatingEventSchema)
              },
              {
                label: 'excel',
                path: 'examples/event/excel',
                component: makeSchemaRenderer(ExcelEventSchema)
              },
              {
                label: '向导组件',
                path: 'examples/event/wizard',
                component: makeSchemaRenderer(WizardEventSchema)
              },
              {
                label: '树形选择框',
                path: 'examples/event/input-tree',
                component: makeSchemaRenderer(InputTreeEventSchema)
              },
              {
                label: '树形选择器',
                path: 'examples/event/tree-select',
                component: makeSchemaRenderer(treeSelectEventSchema)
              },
              {
                label: 'form表单',
                path: 'examples/event/form',
                component: makeSchemaRenderer(FormEventActionSchema)
              },
              {
                label: '穿梭框类组件',
                path: 'examples/event/transfer',
                component: makeSchemaRenderer(TransferEventSchema)
              },
              {
                label: '轮播图组件',
                path: 'examples/event/carousel',
                component: makeSchemaRenderer(CarouselEventSchema)
              },
              {
                label: 'Service组件',
                path: 'examples/event/service',
                component: makeSchemaRenderer(ServiceEventSchema)
              },
              {
                label: '表格组件',
                path: 'examples/event/table',
                component: makeSchemaRenderer(TableEventSchema)
              },
              {
                label: '列表展示类组件',
                path: 'examples/event/list',
                component: makeSchemaRenderer(ListEventSchema)
              },
              {
                label: 'chart组件',
                path: 'examples/event/chart',
                component: makeSchemaRenderer(ChartEventSchema)
              },
              {
                label: 'SearchBox组件',
                path: 'examples/event/searchbox',
                component: makeSchemaRenderer(SearchBoxEventSchema)
              },
              {
                label: 'input-table组件',
                path: 'examples/event/input-table',
                component: makeSchemaRenderer(InputTableEvent)
              }
            ]
          },
          {
            label: '阻止组件默认行为',
            children: [
              {
                label: '阻止表单默认行为',
                path: '/examples/action/prevent/form',
                component: makeSchemaRenderer(PreventFormActionSchema)
              }
            ]
          }
        ]
      },

      {
        label: '动态加载',
        icon: 'fa fa-magic',
        children: [
          {
            label: '动态加载数据',
            path: '/examples/services/data',
            component: makeSchemaRenderer(ServicesDataSchema)
          },
          {
            label: '动态加载页面',
            path: '/examples/services/schema',
            component: makeSchemaRenderer(ServicesSchemaSchema)
          },
          {
            label: '动态加载部分表单',
            path: '/examples/services/form',
            component: makeSchemaRenderer(ServicesFormSchema)
          }
        ]
      },

      {
        label: '主题编辑器',
        icon: 'fa fa-glasses',
        path: '/examples/theme',
        component: makeSchemaRenderer(ThemeSchema)
      },

      {
        label: '代码高亮',
        icon: 'fa fa-code',
        path: '/examples/code',
        component: makeSchemaRenderer(CodeSchema)
      },

      {
        label: '向导',
        icon: 'fa fa-desktop',
        path: '/examples/wizard',
        component: makeSchemaRenderer(WizardSchema)
      },

      {
        label: '排版',
        icon: 'fa fa-columns',
        path: '/examples/horizontal',
        component: makeSchemaRenderer(HorizontalSchema)
      },

      {
        label: '图表',
        icon: 'fa fa-bar-chart',
        path: '/examples/chart',
        component: makeSchemaRenderer(ChartSchema)
      },

      {
        label: 'ECharts 编辑器',
        icon: 'fa fa-bar-chart',
        path: '/examples/echarts',
        component: makeSchemaRenderer(EChartsEditorSchema)
      },
      {
        label: '轮播图',
        icon: 'fa fa-pause',
        path: '/examples/carousel',
        component: makeSchemaRenderer(CarouselSchema)
      },
      {
        label: '音频',
        icon: 'fa fa-volume-up',
        path: '/examples/audio',
        component: makeSchemaRenderer(AudioSchema)
      },
      {
        label: '视频',
        icon: 'fa fa-video-camera',
        path: '/examples/video',
        component: makeSchemaRenderer(VideoSchema)
      },
      {
        label: '异步任务',
        icon: 'fa fa-tasks',
        path: '/examples/task',
        component: makeSchemaRenderer(TasksSchema)
      },
      {
        label: 'IFrame',
        icon: 'fa fa-cloud',
        path: '/examples/iframe',
        component: makeSchemaRenderer(IFrameSchema)
      },

      {
        label: 'SDK',
        icon: 'fa fa-rocket',
        path: '/examples/sdk',
        component: SdkTest
      },

      {
        label: 'Office 文档预览',
        icon: 'fa fa-file-word',
        path: '/examples/office-viwewer',
        component: makeSchemaRenderer(OfficeViewer)
      },

      {
        label: '多 loading',
        icon: 'fa fa-spinner',
        path: '/examples/loading',
        component: makeSchemaRenderer(Loading)
      },

      {
        label: 'APP 多页应用',
        icon: 'fa fa-cubes',
        path: '/examples/app/',
        component: () => {
          // 如果在 gh-pages 里面
          if (/^\/amis/.test(window.location.pathname)) {
            window.open(`/amis/app/`, '_blank');
          } else {
            window.open(`/examples/app/`, '_blank');
          }

          return null;
        }
      },

      {
        label: 'wizard页面',
        icon: 'fa fa-desktop',
        path: '/examples/wizard-page',
        component: makeSchemaRenderer(WizardPage)
      }

      // {
      //   label: 'Test',
      //   icon: 'fa fa-code',
      //   path: '/examples/test',
      //   component: TestComponent
      // }
    ]
  }
];

export default class Example extends React.PureComponent {
  componentDidMount() {
    this.props.setNavigations(examples);
  }

  componentDidUpdate() {
    this.props.setNavigations(examples);
  }

  render() {
    return (
      <Switch>
        {/* {React.cloneElement(this.props.children, {
          ...this.props.children.props,
          theme: this.props.theme,
          classPrefix: this.props.classPrefix,
          locale: this.props.locale,
          viewMode: this.props.viewMode,
          offScreen: this.props.offScreen
        })} */}
        {navigations2route(examples, {
          theme: this.props.theme,
          classPrefix: this.props.classPrefix,
          locale: this.props.locale,
          viewMode: this.props.viewMode,
          offScreen: this.props.offScreen
        })}
      </Switch>
    );
  }
}
