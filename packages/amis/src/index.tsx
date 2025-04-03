/** @license amis v@version
 *
 * Copyright Baidu
 *
 * This source code is licensed under the Apache license found in the
 * LICENSE file in the root directory of this source tree.
 */
export * from 'amis-core';
export * from 'amis-ui';
import './minimal';
import {registerFilter, registerFormula} from 'amis-formula';

import type {
  BaseSchema,
  FormSchema,
  SchemaApi,
  SchemaCollection,
  SchemaExpression,
  SchemaObject
} from './Schema';
import type {TableViewSchema, TrObject} from './renderers/TableView';
import type {ActionSchema, ButtonSchema} from './renderers/Action';
import type {CRUDCommonSchema} from './renderers/CRUD';
import type {CRUD2Schema} from './renderers/CRUD2';
import type {TabsSchema} from './renderers/Tabs';
import {availableLanguages as EditorAvailableLanguages} from './renderers/Form/Editor';
import type {Action} from './types';
import type {SchemaType} from './Schema';
import {overrideSupportStatic} from './renderers/Form/StaticHoc';
import './renderers/icons/mk';
export * from './renderers/Form/IconPickerIcons';
export * from './renderers/Form/IconSelectStore';

export {
  BaseSchema,
  SchemaCollection,
  FormSchema,
  SchemaApi,
  SchemaObject,
  TableViewSchema,
  TrObject,
  ActionSchema,
  CRUDCommonSchema,
  ButtonSchema,
  CRUD2Schema,
  TabsSchema,
  SchemaExpression,
  Action,
  SchemaType,
  EditorAvailableLanguages,
  registerFilter,
  registerFormula,
  overrideSupportStatic
};
