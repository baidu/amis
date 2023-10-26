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
import {BasicEditor, RendererEditor} from './compat';
import MiniEditor from './component/MiniEditor';
import CodeEditor from './component/Panel/AMisCodeEditor';
import IFramePreview from './component/IFramePreview';
import SearchPanel from './component/base/SearchPanel';
import {VRenderer} from './component/VRenderer';
import {RegionWrapper} from './component/RegionWrapper';
import {mapReactElement} from './component/factory';
import type {EditorNodeType, EditorNodeSnapshot} from './store/node';
import {ContainerWrapper} from './component/ContainerWrapper';
import type {EditorStoreType} from './store/editor';
import {AvailableRenderersPlugin} from './plugin/AvailableRenderers';
import ShortcutKey from './component/base/ShortcutKey';
import WidthDraggableContainer from './component/base/WidthDraggableContainer';

export const version = '__buildVersion';

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
  IFramePreview as IFrameEditor,
  SearchPanel,
  EditorNodeType,
  EditorNodeSnapshot,
  EditorStoreType,
  ContainerWrapper,
  AvailableRenderersPlugin,
  ShortcutKey,
  WidthDraggableContainer
};
