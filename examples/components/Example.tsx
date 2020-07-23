// import React from 'react';
// import NotFound from '../../src/components/404';
// import Layout from '../../src/components/Layout';
// import AsideNav from '../../src/components/AsideNav';
// import {AlertComponent, ToastComponent} from '../../src/components/index';
// import {mapTree} from '../../src/utils/helper';
// import {Icon} from '../../src/components/icons';
// import '../../src/locale/en';
// import {
//   Router,
//   Route,
//   IndexRoute,
//   browserHistory,
//   hashHistory,
//   Link,
//   Redirect,
//   withRouter
// } from 'react-router';
// import makeSchemaRenderer from './SchemaRender';

// import SimplePageSchema from './Page/Simple';
// import ErrorPageSchema from './Page/Error';
// import FormPageSchema from './Page/Form';
// import ModeFormSchema from './Form/Mode';
// import FieldSetFormSchema from './Form/FieldSet';
// import TabsFormSchema from './Form/Tabs';
// import RemoteFormSchema from './Form/Remote';
// import ReactionFormSchema from './Form/Reaction';
// import ValidationFormSchema from './Form/Validation';
// import FullFormSchema from './Form/Full';
// import StaticFormSchema from './Form/Static';
// import HintFormSchema from './Form/Hint';
// import FieldSetInTabsFormSchema from './Form/FieldSetInTabs';
// import ComboFormSchema from './Form/Combo';
// import SubFormSchema from './Form/SubForm';
// import RichTextSchema from './Form/RichText';
// import EditorSchema from './Form/Editor';
// import TestFormSchema from './Form/Test';
// import TransferFormSchema from './Form/Transfer';
// import TableFormSchema from './Form/Table';
// import PickerFormSchema from './Form/Picker';
// import FormulaFormSchema from './Form/Formula';
// import CustomFormSchema from './Form/Custom';
// import FormLayoutTestSchema from './Form/layoutTest';
// import Definitions from './Form/Definitions';

// import TableCrudSchema from './CRUD/Table';
// import ItemActionsSchema from './CRUD/ItemActions';
// import GridCrudSchema from './CRUD/Grid';
// import ListCrudSchema from './CRUD/List';
// import LoadMoreSchema from './CRUD/LoadMore';
// import TestCrudSchema from './CRUD/test';
// import FixedCrudSchema from './CRUD/Fix';
// import AsideCrudSchema from './CRUD/Aside';
// import FieldsCrudSchema from './CRUD/Fields';
// import JumpNextCrudSchema from './CRUD/JumpNext';
// import KeyboardsCrudSchema from './CRUD/Keyboards';
// import FootableCrudSchema from './CRUD/Footable';
// import NestedCrudSchema from './CRUD/Nested';
// import MergeCellSchema from './CRUD/MergeCell';
// import HeaderGroupSchema from './CRUD/HeaderGroup';
// import HeaderHideSchema from './CRUD/HeaderHide';
// import LoadOnceTableCrudSchema from './CRUD/LoadOnce';
// import SdkTest from './Sdk/Test';
// import JSONSchemaForm from './Form/Schem';
// import SimpleDialogSchema from './Dialog/Simple';
// import DrwaerSchema from './Dialog/Drawer';

// import PageLinkPageSchema from './Linkage/Page';
// import FormLinkPageSchema from './Linkage/Form';
// import Form2LinkPageSchema from './Linkage/Form2';
// import CRUDLinkPageSchema from './Linkage/CRUD';
// import OptionsPageSchema from './Linkage/Options';
// import OptionsLocalPageSchema from './Linkage/OptionsLocal';
// import WizardSchema from './Wizard';
// import ChartSchema from './Chart';
// import HorizontalSchema from './Horizontal';
// import VideoSchema from './Video';
// import AudioSchema from './Audio';
// import CarouselSchema from './Carousel';
// import TasksSchema from './Tasks';
// import ServicesDataSchema from './Services/Data';
// import ServicesSchemaSchema from './Services/Schema';
// import ServicesFormSchema from './Services/Form';
// import IFrameSchema from './IFrame';

// import NormalTabSchema from './Tabs/Normal';
// import FormTabSchema from './Tabs/Form';
// import Tab1Schema from './Tabs/Tab1';
// import Tab2Schema from './Tabs/Tab2';
// import Tab3Schema from './Tabs/Tab3';
// import TestComponent from './Test';
// import Select from '../../src/components/Select';
// import Button from '../../src/components/Button';
// import DocSearch from './DocSearch';

// export const examples = [
//   {
//     prefix: ({classnames: cx}) => <li className={cx('AsideNav-divider')} />,
//     label: '示例',
//     children: [
//       {
//         label: '页面',
//         icon: 'glyphicon glyphicon-th',
//         badge: 3,
//         badgeClassName: 'bg-info',
//         children: [
//           {
//             label: '简单页面',
//             path: 'pages/simple',
//             component: makeSchemaRenderer(SimplePageSchema)
//           },
//           {
//             label: '初始化出错',
//             path: 'pages/error',
//             component: makeSchemaRenderer(ErrorPageSchema)
//           },
//           {
//             label: '表单页面',
//             path: 'pages/form',
//             component: makeSchemaRenderer(FormPageSchema)
//           }
//         ]
//       },

//       {
//         label: '表单',
//         icon: 'fa fa-list-alt',
//         children: [
//           {
//             label: '表单展示模式',
//             path: 'form/mode',
//             component: makeSchemaRenderer(ModeFormSchema)
//           },

//           {
//             label: '所有类型汇总',
//             path: 'form/full',
//             component: makeSchemaRenderer(FullFormSchema)
//           },

//           {
//             label: '静态展示',
//             path: 'form/static',
//             component: makeSchemaRenderer(StaticFormSchema)
//           },

//           {
//             label: '输入提示',
//             path: 'form/hint',
//             component: makeSchemaRenderer(HintFormSchema)
//           },

//           {
//             label: 'FieldSet',
//             path: 'form/fieldset',
//             component: makeSchemaRenderer(FieldSetFormSchema)
//           },

//           {
//             label: 'Tabs',
//             path: 'form/tabs',
//             component: makeSchemaRenderer(TabsFormSchema)
//           },

//           {
//             label: 'FieldSet Tabs 组合',
//             path: 'form/fields-tabs',
//             component: makeSchemaRenderer(FieldSetInTabsFormSchema)
//           },

//           {
//             label: '动态数据',
//             path: 'form/remote',
//             component: makeSchemaRenderer(RemoteFormSchema)
//           },

//           {
//             label: '显隐状态联动',
//             path: 'form/reaction',
//             component: makeSchemaRenderer(ReactionFormSchema)
//           },

//           {
//             label: '表单验证',
//             path: 'form/validation',
//             component: makeSchemaRenderer(ValidationFormSchema)
//           },

//           {
//             label: '组合类型',
//             path: 'form/combo',
//             component: makeSchemaRenderer(ComboFormSchema)
//           },

//           {
//             label: '穿梭器',
//             path: 'form/transfer',
//             component: makeSchemaRenderer(TransferFormSchema)
//           },

//           {
//             label: '多功能选择器',
//             path: 'form/picker',
//             component: makeSchemaRenderer(PickerFormSchema)
//           },

//           {
//             label: '子表单',
//             path: 'form/sub-form',
//             component: makeSchemaRenderer(SubFormSchema)
//           },

//           {
//             label: 'JSon Schema表单',
//             path: 'form/json-schema',
//             component: JSONSchemaForm
//           },

//           {
//             label: '富文本',
//             path: 'form/rich-text',
//             component: makeSchemaRenderer(RichTextSchema)
//           },

//           {
//             label: '代码编辑器',
//             path: 'form/ide',
//             component: makeSchemaRenderer(EditorSchema)
//           },

//           {
//             label: '自定义组件',
//             path: 'form/custom',
//             component: makeSchemaRenderer(CustomFormSchema)
//           },

//           {
//             label: '表格编辑',
//             path: 'form/table',
//             component: makeSchemaRenderer(TableFormSchema)
//           },

//           {
//             label: '公式示例',
//             path: 'form/formula',
//             component: makeSchemaRenderer(FormulaFormSchema)
//           },

//           {
//             label: '引用',
//             path: 'form/definitions',
//             component: makeSchemaRenderer(Definitions)
//           }

//           // {
//           //     label: '布局测试',
//           //     path: 'form/layout-test',
//           //     component: makeSchemaRenderer(FormLayoutTestSchema)
//           // },

//           // {
//           //     label: '测试',
//           //     path: 'form/test',
//           //     component: makeSchemaRenderer(TestFormSchema)
//           // },
//         ]
//       },

//       {
//         label: '增删改查',
//         icon: 'fa fa-table',
//         children: [
//           {
//             label: '表格模式',
//             path: 'crud/table',
//             component: makeSchemaRenderer(TableCrudSchema)
//           },
//           {
//             label: '卡片模式',
//             path: 'crud/grid',
//             component: makeSchemaRenderer(GridCrudSchema)
//           },
//           {
//             label: '列表模式',
//             path: 'crud/list',
//             component: makeSchemaRenderer(ListCrudSchema)
//           },
//           {
//             label: '加载更多模式',
//             path: 'crud/load-more',
//             component: makeSchemaRenderer(LoadMoreSchema)
//           },
//           {
//             label: '操作交互显示',
//             path: 'crud/item-actions',
//             component: makeSchemaRenderer(ItemActionsSchema)
//           },
//           {
//             label: '列类型汇总',
//             path: 'crud/columns',
//             component: makeSchemaRenderer(FieldsCrudSchema)
//           },
//           {
//             label: '可折叠',
//             path: 'crud/footable',
//             component: makeSchemaRenderer(FootableCrudSchema)
//           },
//           {
//             label: '嵌套',
//             path: 'crud/nested',
//             component: makeSchemaRenderer(NestedCrudSchema)
//           },
//           {
//             label: '合并单元格',
//             path: 'crud/merge-cell',
//             component: makeSchemaRenderer(MergeCellSchema)
//           },
//           {
//             label: '表头分组',
//             path: 'crud/header-group',
//             component: makeSchemaRenderer(HeaderGroupSchema)
//           },
//           {
//             label: '表头隐藏',
//             path: 'crud/header-hide',
//             component: makeSchemaRenderer(HeaderHideSchema)
//           },
//           {
//             label: '带边栏',
//             path: 'crud/aside',
//             component: makeSchemaRenderer(AsideCrudSchema)
//           },
//           {
//             label: '固定表头/列',
//             path: 'crud/fixed',
//             component: makeSchemaRenderer(FixedCrudSchema)
//           },
//           {
//             label: '键盘操作编辑',
//             path: 'crud/keyboards',
//             component: makeSchemaRenderer(KeyboardsCrudSchema)
//           },
//           {
//             label: '操作并下一个',
//             path: 'crud/jump-next',
//             component: makeSchemaRenderer(JumpNextCrudSchema)
//           },
//           {
//             label: '一次性加载',
//             path: 'crud/load-once',
//             component: makeSchemaRenderer(LoadOnceTableCrudSchema)
//           }
//           // {
//           //     label: '测试',
//           //     path: 'crud/test',
//           //     component: makeSchemaRenderer(TestCrudSchema)
//           // }
//         ]
//       },

//       {
//         label: '弹框',
//         icon: 'fa fa-bomb',
//         children: [
//           {
//             label: '对话框',
//             path: 'dialog/simple',
//             component: makeSchemaRenderer(SimpleDialogSchema)
//           },
//           {
//             label: '侧边弹出',
//             path: 'dialog/drawer',
//             component: makeSchemaRenderer(DrwaerSchema)
//           }
//         ]
//       },

//       {
//         label: '选项卡',
//         icon: 'fa fa-clone',
//         children: [
//           {
//             label: '常规选项卡',
//             path: 'tabs/normal',
//             component: makeSchemaRenderer(NormalTabSchema)
//           },

//           {
//             label: '表单中选项卡分组',
//             path: 'tabs/form',
//             component: makeSchemaRenderer(FormTabSchema)
//           },
//           {
//             label: '选项卡页面1',
//             path: 'tabs/tab1',
//             component: makeSchemaRenderer(Tab1Schema)
//           },
//           {
//             label: '选项卡页面2',
//             path: 'tabs/tab2',
//             component: makeSchemaRenderer(Tab2Schema)
//           },
//           {
//             label: '选项卡页面3',
//             path: 'tabs/tab3',
//             component: makeSchemaRenderer(Tab3Schema)
//           }
//         ]
//       },

//       {
//         label: '联动',
//         icon: 'fa fa-bolt',
//         children: [
//           {
//             label: '地址栏变化自动更新',
//             path: 'linkpage/page',
//             component: makeSchemaRenderer(PageLinkPageSchema)
//           },
//           {
//             label: '选项联动',
//             path: 'linkpage/options-local',
//             component: makeSchemaRenderer(OptionsLocalPageSchema)
//           },
//           {
//             label: '选项远程联动',
//             path: 'linkpage/options',
//             component: makeSchemaRenderer(OptionsPageSchema)
//           },
//           {
//             label: '表单和表单联动',
//             path: 'linkpage/form',
//             component: makeSchemaRenderer(FormLinkPageSchema)
//           },
//           {
//             label: '表单自动更新',
//             path: 'linkpage/form2',
//             component: makeSchemaRenderer(Form2LinkPageSchema)
//           },
//           {
//             label: '表单和列表联动',
//             path: 'linkpage/crud',
//             component: makeSchemaRenderer(CRUDLinkPageSchema)
//           }
//         ]
//       },

//       {
//         label: '动态加载',
//         icon: 'fa fa-magic',
//         children: [
//           {
//             label: '动态加载数据',
//             path: 'services/data',
//             component: makeSchemaRenderer(ServicesDataSchema)
//           },
//           {
//             label: '动态加载页面',
//             path: 'services/schema',
//             component: makeSchemaRenderer(ServicesSchemaSchema)
//           },
//           {
//             label: '动态加载部分表单',
//             path: 'services/form',
//             component: makeSchemaRenderer(ServicesFormSchema)
//           }
//         ]
//       },

//       {
//         label: '向导',
//         icon: 'fa fa-desktop',
//         path: 'wizard',
//         component: makeSchemaRenderer(WizardSchema)
//       },

//       {
//         label: '排版',
//         icon: 'fa fa-columns',
//         path: 'horizontal',
//         component: makeSchemaRenderer(HorizontalSchema)
//       },

//       {
//         label: '图表',
//         icon: 'fa fa-bar-chart',
//         path: 'chart',
//         component: makeSchemaRenderer(ChartSchema)
//       },
//       {
//         label: '轮播图',
//         icon: 'fa fa-pause',
//         path: 'carousel',
//         component: makeSchemaRenderer(CarouselSchema)
//       },
//       {
//         label: '音频',
//         icon: 'fa fa-volume-up',
//         path: 'audio',
//         component: makeSchemaRenderer(AudioSchema)
//       },
//       {
//         label: '视频',
//         icon: 'fa fa-video-camera',
//         path: 'video',
//         component: makeSchemaRenderer(VideoSchema)
//       },
//       {
//         label: '异步任务',
//         icon: 'fa fa-tasks',
//         path: 'task',
//         component: makeSchemaRenderer(TasksSchema)
//       },
//       {
//         label: 'IFrame',
//         icon: 'fa fa-cloud',
//         path: 'iframe',
//         component: makeSchemaRenderer(IFrameSchema)
//       },
//       {
//         label: 'SDK',
//         icon: 'fa fa-rocket',
//         path: 'sdk',
//         component: SdkTest
//       },

//       {
//         label: 'Test',
//         icon: 'fa fa-code',
//         path: 'test',
//         component: TestComponent
//       }
//     ]
//   }
// ];

// @withRouter
// export default class Example extends React.PureComponent {
//   state = {
//     asideFolded: localStorage.getItem('asideFolded') === 'true',
//     offScreen: false,
//     headerVisible: true,
//     themeIndex: 0,
//     themes: themes,
//     theme: themes[localStorage.getItem('themeIndex') || 0],
//     locale: localStorage.getItem('locale') || '',
//     docs: Docs.children
//   };

//   constructor(props) {
//     super(props);

//     this.toggleAside = this.toggleAside.bind(this);
//     this.setAsideFolded = this.setAsideFolded.bind(this);
//     this.setHeaderVisible = this.setHeaderVisible.bind(this);
//   }

//   componentDidMount() {
//     if (this.state.theme.value !== 'default') {
//       document.querySelectorAll('link[title]').forEach(item => {
//         item.disabled = true;
//       });
//       document.querySelector(
//         `link[title=${this.state.theme.value}]`
//       ).disabled = false;
//     }
//   }

//   componentDidUpdate(preProps, preState) {
//     const props = this.props;

//     if (preState.theme.value !== this.state.theme.value) {
//       document.querySelector(
//         `link[title=${preState.theme.value}]`
//       ).disabled = true;
//       document.querySelector(
//         `link[title=${this.state.theme.value}]`
//       ).disabled = false;
//     }

//     if (props.location.pathname !== preProps.location.pathname) {
//       this.setState(
//         {
//           offScreen: false
//         },
//         () => window.scrollTo(0, 0)
//       );

//       const pageURL = props.location.pathname;
//       _hmt && _hmt.push(['_trackPageview', pageURL]);
//     }
//   }

//   toggleAside() {
//     this.setAsideFolded(!this.state.asideFolded);
//   }

//   setAsideFolded(folded = false) {
//     localStorage.setItem('asideFolded', JSON.stringify(folded));
//     this.setState({
//       asideFolded: folded
//     });
//   }

//   setHeaderVisible(visible = false) {
//     this.setState({
//       headerVisible: visible
//     });
//   }

//   renderAside() {
//     return (
//       <AsideNav
//         renderLink={() => {
//           return null;
//         }}
//       />
//     );
//   }

//   renderHeader() {
//     const location = this.props.location;
//     const theme = this.state.theme;

//     if (location.pathname === '/edit') {
//       return (
//         <div id="headerBar" className="box-shadow bg-dark">
//           <div className={`${theme.ns}Layout-brand`}>AMis 可视化编辑器</div>
//         </div>
//       );
//     }

//     return (
//       <>
//         <div className={`${theme.ns}Layout-brandBar`}>
//           <button
//             onClick={() => this.setState({offScreen: !this.state.offScreen})}
//             className="pull-right visible-xs"
//           >
//             <i className="glyphicon glyphicon-align-justify" />
//           </button>

//           <div className={`${theme.ns}Layout-brand`}>
//             <i className="fa fa-paw" />
//             <span className="hidden-folded m-l-sm">AMIS</span>
//           </div>
//         </div>

//         <div className={`${theme.ns}Layout-headerBar`}>
//           <ul className={`${theme.ns}Layout-headerBar-links pull-left`}>
//             <Link to="/docs">文档</Link>
//             <Link to="/examples">示例</Link>
//           </ul>

//           <div className="hidden-xs p-t pull-right m-l-sm">
//             <Select
//               clearable={false}
//               theme={this.state.theme.value}
//               value={this.state.locale || 'zh-cn'}
//               options={locales}
//               onChange={locale => {
//                 this.setState({locale: locale.value});
//                 localStorage.setItem('locale', locale.value);
//               }}
//             />
//           </div>

//           <div className="hidden-xs p-t pull-right">
//             <Select
//               clearable={false}
//               theme={this.state.theme.value}
//               value={this.state.theme}
//               options={this.state.themes}
//               onChange={theme => {
//                 this.setState({theme});
//                 localStorage.setItem(
//                   'themeIndex',
//                   this.state.themes.indexOf(theme)
//                 );
//               }}
//             />
//           </div>

//           <DocSearch theme={this.state.theme.value} />
//         </div>
//       </>
//     );
//   }

//   toggleOpen(e, item) {
//     e.stopPropagation();
//     e.preventDefault();

//     const docs = mapTree(this.state.docs, i => ({
//       ...i,
//       isOpen: item.id === i.id ? !i.isOpen : i.isOpen
//     }));

//     this.setState({
//       docs
//     });
//   }

//   renderNavigation(children, parent) {
//     return children.map(child => {
//       const path = child.path;
//       const hasChildren =
//         Array.isArray(child.children) && child.children.length;

//       return (
//         <div
//           key={child.id}
//           className={classnames('Doc-navigation-item', {
//             'is-active': path === location.pathname,
//             'is-top': !parent,
//             'is-open': child.isOpen
//           })}
//         >
//           <Link to={path}>
//             {child.label}
//             {hasChildren ? (
//               <i
//                 className={`iconfont icon-down-arrow ${
//                   child.isOpen ? '' : 'is-flipped'
//                 }`}
//                 onClick={e => this.toggleOpen(e, child)}
//               ></i>
//             ) : null}
//           </Link>

//           {hasChildren && child.isOpen
//             ? this.renderNavigation(child.children, {
//                 ...child,
//                 path
//               })
//             : null}
//         </div>
//       );
//     });
//   }

//   render() {
//     // const pathname = this.props.location.pathname;
//     const theme = this.state.theme;
//     const groups = groupBy(this.state.docs, d => d.group);
//     groups['组件'] = groups['undefined'][0].children;

//     return (
//       <Layout
//         theme={theme.value}
//         boxed={true}
//         offScreen={this.state.offScreen}
//         header={this.state.headerVisible ? this.renderHeader() : null}
//         // folded={this.state.asideFolded}
//         // aside={this.renderAside()}
//       >
//         <ToastComponent theme={theme.value} locale={this.state.locale} />
//         <AlertComponent theme={theme.value} locale={this.state.locale} />

//         <div className="Doc">
//           <div className="Doc-nav">
//             <div className="Doc-navigation">
//               {Object.keys(groups).map(groupName => (
//                 <div className="Doc-navigationGroup" key={groupName}>
//                   <div className="Doc-navigationGroup-name">
//                     {groupName || '其他'}
//                   </div>
//                   {this.renderNavigation(groups[groupName])}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {React.cloneElement(this.props.children, {
//             ...this.props.children.props,
//             setAsideFolded: this.setAsideFolded,
//             setHeaderVisible: this.setHeaderVisible,
//             theme: theme.value,
//             classPrefix: theme.ns,
//             locale: this.state.locale
//           })}
//         </div>
//       </Layout>
//     );
//   }
// }
