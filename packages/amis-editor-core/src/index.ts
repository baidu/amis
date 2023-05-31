/**
 * @file 总入口
 */
import 'amis';
import './locale/index';
import Editor from './component/Editor';
import './component/ClassNameControl';

import './plugin/AvailableRenderers';
import './plugin/BasicToolbar';
import './plugin/Code';
import './plugin/DataDebug';
import './plugin/ErrorRenderer';
// import './plugin/Name';
import './plugin/Outline';
import './plugin/Unknown';

import * as utils from './util';
export * from './util';
export * from './tpl';
export * from './manager';
export * from './plugin';
export * from './icons/index';
export * from './mocker';
export * from './builder/DSBuilder';
import './builder/ApiBuilder';
import {BasicEditor, RendererEditor} from './compat';
import MiniEditor from './component/MiniEditor';
import CodeEditor from './component/Panel/AMisCodeEditor';
import IFramePreview from './component/IFramePreview';
import {mountInIframe} from './component/IFrameBridge';
import SearchPanel from './component/base/SearchPanel';
import {VRenderer} from './component/VRenderer';
import {RegionWrapper} from './component/RegionWrapper';
import {mapReactElement} from './component/factory';
import type {EditorNodeType} from './store/node';
import {ContainerWrapper} from './component/ContainerWrapper';
import type {EditorStoreType} from './store/editor';
import {AvailableRenderersPlugin} from './plugin/AvailableRenderers';
import ShortcutKey from './component/base/ShortcutKey';
import WidthDraggableContainer from './component/base/WidthDraggableContainer';

export default Editor;

export {
  Editor,
  MiniEditor,
  utils,
  mapReactElement,
  RendererEditor,
  BasicEditor,
  CodeEditor,
  VRenderer,
  RegionWrapper,
  mountInIframe,
  IFramePreview as IFrameEditor,
  SearchPanel,
  EditorNodeType,
  EditorStoreType,
  ContainerWrapper,
  AvailableRenderersPlugin,
  ShortcutKey,
  WidthDraggableContainer
};
