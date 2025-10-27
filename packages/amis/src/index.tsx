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
import type {AMISFormSchema} from 'amis-core';

import type {
  BaseSchema,
  SchemaApi,
  SchemaExpression,
  SchemaObject,
  SchemaCollection
} from './Schema';
import type {AMISTableViewSchema, TrObject} from './renderers/TableView';
import type {ActionSchema, ButtonSchema} from './renderers/Action';
import type {AMISCRUDSchema, AMISCRUDCommonSchema} from './renderers/CRUD';
import type {AMISCRUD2Schema} from './renderers/CRUD2';
import type {AMISTabsSchema} from './renderers/Tabs';
import {availableLanguages as EditorAvailableLanguages} from './renderers/Form/Editor';
import type {Action} from './types';
import type {SchemaType} from './Schema';
import {overrideSupportStatic} from './renderers/Form/StaticHoc';
import './renderers/icons/mk';
export * from './renderers/Form/IconPickerIcons';
export * from './renderers/Form/IconSelectStore';

import type {AMISDialogSchema} from './renderers/Dialog';
import type {AMISDrawerSchema} from './renderers/Drawer';
export * from './SchemaFull';

export {
  BaseSchema,
  AMISFormSchema as FormSchema,
  SchemaApi,
  SchemaObject,
  AMISTableViewSchema as TableViewSchema,
  AMISTableViewSchema,
  TrObject,
  ActionSchema,
  AMISCRUDCommonSchema,
  AMISCRUDSchema,
  ButtonSchema,
  AMISCRUD2Schema,
  AMISCRUD2Schema as CRUD2Schema,
  AMISTabsSchema as TabsSchema,
  AMISTabsSchema,
  SchemaExpression,
  Action,
  SchemaType,
  EditorAvailableLanguages,
  AMISDialogSchema as DialogSchema,
  AMISDrawerSchema as DrawerSchema,
  AMISDialogSchema,
  AMISDrawerSchema,
  registerFilter,
  registerFormula,
  overrideSupportStatic,
  SchemaCollection
};
