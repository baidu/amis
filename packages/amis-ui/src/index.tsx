export * from './components';
export * from './hooks';

import './locale/zh-CN';
import './locale/en-US';
import './locale/de-DE';
import './themes/cxd';
import './themes/ang';
import './themes/antd';
import './themes/dark';
import './themes/default';
import type {SchemaEditorItemPlaceholder} from './components/schema-editor/Common';
import {schemaEditorItemPlaceholder} from './components/schema-editor/Common';
import withStore from './withStore';
import withRemoteConfig from './withRemoteConfig';

export {
  schemaEditorItemPlaceholder,
  SchemaEditorItemPlaceholder,
  withStore,
  withRemoteConfig
};
