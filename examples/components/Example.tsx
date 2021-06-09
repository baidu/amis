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

import TableCrudSchema from './CRUD/Table';
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

import NormalTabSchema from './Tabs/Normal';
import FormTabSchema from './Tabs/Form';
import DynamicTabSchema from './Tabs/Dynamic';
import Tab1Schema from './Tabs/Tab1';
import Tab2Schema from './Tabs/Tab2';
import Tab3Schema from './Tabs/Tab3';
import TestComponent from './Test';
import APP from './APP/index';
import {normalizeLink} from '../../src/utils/normalizeLink';

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
            label: '导出 Excel/CSV',
            path: '/examples/crud/export-excel-csv',
            component: makeSchemaRenderer(ExportCSVExcelSchema)
          },
          {
            label: '动态列',
            path: '/examples/crud/dynamic',
            component: makeSchemaRenderer(CRUDDynamicSchema)
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
        label: 'APP 多页应用',
        icon: 'fa fa-cubes',
        path: '/examples/app',
        component: makeSchemaRenderer(APP, false, {
          session: 'app',
          jumpTo: (to: string) => {
            location.hash = to;
          },
          updateLocation: (to, replace) => {
            if (to === 'goBack') {
              return window.history.back();
            }

            if (replace && window.history.replaceState) {
              window.history.replaceState(
                '',
                document.title,
                normalizeLink(to)
              );
              return;
            }

            window.history.pushState('', document.title, normalizeLink(to));
          },
          isCurrentUrl: (to: string, ctx: any) => {
            if (!to) {
              return false;
            }
            const pathname = location.hash ? location.hash.substring(1) : '/';
            const link = normalizeLink(to, {
              ...location,
              pathname,
              hash: ''
            });

            if (!~link.indexOf('http') && ~link.indexOf(':')) {
              return match(link, {
                decode: decodeURIComponent,
                strict: ctx?.strict ?? true
              })(pathname);
            }

            return pathname === encodeURI(link);
          }
        })
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
      <>
        {React.cloneElement(this.props.children, {
          ...this.props.children.props,
          theme: this.props.theme,
          classPrefix: this.props.classPrefix,
          locale: this.props.locale,
          viewMode: this.props.viewMode,
          offScreen: this.props.offScreen
        })}
      </>
    );
  }
}
