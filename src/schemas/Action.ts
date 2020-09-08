import {
  SchemaClassName,
  SchemaExpression,
  SchemaApi,
  SchemaReload,
  SchemaTpl
} from './Schema';

export type ButtonSchema = {
  block?: boolean;
  className?: SchemaClassName;

  disabled?: boolean;
  disabledOn?: SchemaExpression;

  hidden?: boolean;
  hiddenOn?: SchemaExpression;

  icon?: string;
  iconClassName?: SchemaClassName;

  label?: string;

  level?: 'info' | 'success' | 'warning' | 'danger' | 'link' | 'primary';

  primary?: boolean;

  size?: 'xs' | 'sm' | 'md' | 'lg';

  tooltip?: string;
  tooltipPlacement?: 'top' | 'right' | 'bottom' | 'left';

  type: 'button' | 'submit' | 'reset';

  visible?: boolean;
  visibleOn?: SchemaExpression;

  confirmText?: string;
};

export interface AjaxActionSchema extends ButtonSchema {
  actionType: 'ajax';
  api: SchemaApi;

  // todo
  feedback?: any;

  reload?: SchemaReload;
}

export interface UrlActionSchema extends ButtonSchema {
  actionType: 'url';
  blank?: boolean;

  url: string;
}

export interface DialogActionSchema extends ButtonSchema {
  actionType: 'dialog';
  // todo
  dialog: any;

  nextCondition?: SchemaExpression;
  reload?: SchemaReload;
}

export interface DrawerActionSchema extends ButtonSchema {
  actionType: 'drawer';
  // todo
  drawer: any;

  nextCondition?: SchemaExpression;
  reload?: SchemaReload;
}

export interface CopyActionSchema extends ButtonSchema {
  actionType: 'copy';
  copy: SchemaTpl;
}

export interface LinkActionSchema extends ButtonSchema {
  actionType: 'link';
  link: string;
}

export interface ReloadActionSchema extends ButtonSchema {
  actionType: 'reload';
  target: SchemaReload;
}

export interface OtherActionSchema extends ButtonSchema {
  actionType: 'prev' | 'next' | 'cancel' | 'close' | 'submit' | 'confirm';
  [propName: string]: any;
}

export type ActionSchema =
  | AjaxActionSchema
  | UrlActionSchema
  | LinkActionSchema
  | DialogActionSchema
  | DrawerActionSchema
  | CopyActionSchema
  | ReloadActionSchema
  | OtherActionSchema;
