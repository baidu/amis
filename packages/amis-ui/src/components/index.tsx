/**
 * @file Index
 * @description
 * @author fex
 */

import NotFound from './404';
import {
  default as Alert,
  alert,
  confirm,
  prompt,
  setRenderSchemaFn
} from './Alert';
import {
  default as ContextMenu,
  openContextMenus,
  closeContextMenus
} from './ContextMenu';
import AsideNav from './AsideNav';
import Avatar from './Avatar';
import Button from './Button';
import Breadcrumb from './Breadcrumb';
import Checkbox from './Checkbox';
import Collapse from './Collapse';
import CollapseGroup from './CollapseGroup';
import DatePicker from './DatePicker';
import DateRangePicker from './DateRangePicker';
import Drawer from './Drawer';
import Tabs from './Tabs';
import Tab from './Tab';
import Editor from './Editor';
import DiffEditor from './DiffEditor';
import Html from './Html';
export * from './icons';
import * as Icons from './icons';
import Layout from './Layout';
import {LazyComponent} from 'amis-core';
import Modal from './Modal';
import {Overlay} from 'amis-core';
import {PopOver} from 'amis-core';
import Radios from './Radios';
import Range from './Range';
import Rating from './Rating';
// import RichText from './RichText';
import Select, {value2array} from './Select';
import SparkLine from './SparkLine';
import {default as Spinner, type SpinnerExtraProps} from './Spinner';
import Switch from './Switch';
import Textarea from './Textarea';
import TitleBar from './TitleBar';
import {default as ToastComponent, toast} from './Toast';
import Tooltip from './Tooltip';
import TooltipWrapper from './TooltipWrapper';
import Tree from './Tree';
import Alert2 from './Alert2';
import Transfer from './Transfer';
import TabsTransfer from './TabsTransfer';
import ResultBox from './ResultBox';
import InputBox from './InputBox';
import ListGroup from './ListGroup';
import NumberInput from './NumberInput';
import ArrayInput from './ArrayInput';
import SearchBox from './SearchBox';
import AnchorNav from './AnchorNav';
import AnchorNavSection from './AnchorNavSection';
import Selection from './Selection';
import GroupedSelection from './GroupedSelection';
import ChainedSelection from './ChainedSelection';
import TableSelection from './TableSelection';
import TreeSelection from './TreeSelection';
import AssociatedSelection from './AssociatedSelection';
import PullRefresh from './PullRefresh';
import Table from './Table';
import SchemaVariableListPicker from './schema-editor/SchemaVariableListPicker';
import SchemaVariableList from './schema-editor/SchemaVariableList';
import VariableList from './formula/VariableList';
import FormulaPicker from './FormulaPicker';
import {FormulaEditor} from './formula/Editor';
import FormulaCodeEditor from './formula/CodeEditor';
import type {VariableItem, FuncGroup} from './formula/CodeEditor';
import PickerContainer from './PickerContainer';
import InputJSONSchema from './InputJSONSchema';
import Badge from './Badge';
import withBadge from './withBadge';
import type {BadgeObject} from './Badge';
import {getIcon, getIconNames, registerIcon} from './icons';
import Icon from './Icon';
import {withRemoteConfig} from './WithRemoteConfig';
import type {RemoteOptionsProps} from './WithRemoteConfig';
import ConditionBuilder from './ConditionBuilder';
import type {
  ConditionBuilderFields,
  ConditionBuilderFuncs
} from './condition-builder/types';
import type {ConditionBuilderConfig} from './condition-builder/config';
import CityArea from './CityArea';
import type {PresetColor} from './ColorPicker';
import ListMenu from './ListMenu';
import Input from './Input';
import JSONSchemaEditor from './JSONSchemaEditor';
import LocationPicker from './LocationPicker';
import PopUp from './PopUp';
import Cascader from './Cascader';
import TransferDropDown from './TransferDropDown';
import TabsTransferPicker from './TabsTransferPicker';
import ResultList from './ResultList';
import TransferPicker from './TransferPicker';
import UserSelect from './UserSelect';
import UserTabSelect from './UserTabSelect';
import HeadCellDropDown from './HeadCellDropDown';
import Card from './Card';
import GridNav from './GridNav';
import GridNavItem from './GridNavItem';
import type {GridNavDirection} from './GridNav';
import Link from './Link';
import VirtualList from './VirtualList';
import AutoSizer from './AutoSizer';
import withStore from './WithStore';
import PopOverContainer from './PopOverContainer';
import Pagination from './Pagination';
import Progress from './Progress';
import Steps, {StepStatus} from './Steps';
import Tag from './Tag';
import Timeline from './Timeline';
import ImageGallery from './ImageGallery';
import BaiduMapPicker from './BaiduMapPicker';
import MultilineText from './MultilineText';
import Form from './Form';
import FormField, {Controller} from './FormField';
import Combo from './Combo';
import InputTable from './InputTable';
import type {InputTableColumnProps} from './InputTable';
import ConfirmBox from './ConfirmBox';
import DndContainer from './DndContainer';
import Menu from './Menu';
import InputBoxWithSuggestion from './InputBoxWithSuggestion';
import {CodeMirrorEditor} from './CodeMirror';
import type CodeMirror from 'codemirror';
import OverflowTpl from './OverflowTpl';
import Signature from './Signature';
import VerificationCode from './VerificationCode';
import Slider from './Slider';

import Shape from './Shape';
import type {IShapeType} from './Shape';
import MobileDevTool from './MobileDevTool';
import DropdownContextMenus from './DropdownContextMenus';
import {HorizontalScroll} from './HorizontalScroll';
import type {HorizontalScrollProps} from './HorizontalScroll';
import AutoFoldedList from './AutoFoldedList';

import AlphabetIndexer from './AlphabetIndexer';
import MixedInput from './MixedInput';
export {
  NotFound,
  Alert as AlertComponent,
  alert,
  Avatar,
  confirm,
  prompt,
  setRenderSchemaFn,
  ContextMenu,
  openContextMenus,
  closeContextMenus,
  Alert2,
  AsideNav,
  Button,
  Breadcrumb,
  Checkbox,
  Selection as Checkboxes,
  Collapse,
  CollapseGroup,
  DatePicker,
  DateRangePicker,
  Drawer,
  Tabs,
  Tab,
  Editor,
  DiffEditor,
  Html,
  Icons,
  Layout,
  LazyComponent,
  Modal,
  Overlay,
  PopOver,
  Radios,
  Range,
  Rating,
  // RichText,
  Select,
  value2array,
  SparkLine,
  Spinner,
  SpinnerExtraProps,
  Switch,
  Textarea,
  TitleBar,
  ToastComponent,
  ToastComponent as Toast,
  toast,
  Tooltip,
  TooltipWrapper,
  Tree,
  Transfer,
  TabsTransfer,
  Selection,
  GroupedSelection,
  ChainedSelection,
  TableSelection,
  TreeSelection,
  AssociatedSelection,
  ResultBox,
  InputBox,
  InputBoxWithSuggestion,
  SearchBox,
  ListGroup,
  NumberInput,
  ArrayInput,
  PullRefresh,
  Table,
  SchemaVariableListPicker,
  SchemaVariableList,
  VariableList,
  PickerContainer,
  ConfirmBox,
  FormulaPicker,
  FormulaCodeEditor,
  VariableItem,
  FuncGroup,
  FormulaEditor,
  InputJSONSchema,
  withBadge,
  BadgeObject,
  Icon,
  withRemoteConfig,
  RemoteOptionsProps,
  ConditionBuilder,
  ConditionBuilderFuncs,
  ConditionBuilderFields,
  ConditionBuilderConfig,
  CityArea,
  PresetColor,
  ListMenu,
  Input,
  JSONSchemaEditor,
  LocationPicker,
  PopUp,
  Cascader,
  TransferDropDown,
  TabsTransferPicker,
  ResultList,
  TransferPicker,
  UserSelect,
  UserTabSelect,
  getIcon,
  getIconNames,
  registerIcon,
  Badge,
  HeadCellDropDown,
  AnchorNav,
  AnchorNavSection,
  Card,
  GridNavDirection,
  GridNav,
  GridNavItem,
  Link,
  VirtualList,
  AutoSizer,
  withStore,
  PopOverContainer,
  Pagination,
  Progress,
  Steps,
  StepStatus,
  Tag,
  Timeline,
  ImageGallery,
  BaiduMapPicker,
  MultilineText,
  Form,
  FormField,
  Controller,
  Combo,
  InputTable,
  InputTableColumnProps,
  DndContainer,
  Menu,
  CodeMirror,
  CodeMirrorEditor,
  OverflowTpl,
  Signature,
  VerificationCode,
  Shape,
  IShapeType,
  MobileDevTool,
  DropdownContextMenus,
  AlphabetIndexer,
  Slider,
  HorizontalScroll,
  HorizontalScrollProps,
  AutoFoldedList,
  MixedInput
};
