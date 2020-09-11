/**
 * @file 兼容配置，对于一些老的 api 设计的得不合理的地方做一些适配。
 * @author fex
 */
import {SchemaNode, Schema} from './types';
import {RendererProps, RendererConfig, addSchemaFilter} from './factory';
import {CheckboxControlRenderer} from './renderers/Form/Checkbox';
import {FormRenderer} from './renderers/Form/index';
import {FieldSetRenderer} from './renderers/Form/FieldSet';
import {TabsRenderer} from './renderers/Form/Tabs';
import {CardRenderer} from './renderers/Card';
import {ListItemRenderer} from './renderers/List';
import {ButtonGroupControlRenderer} from './renderers/Form/ButtonGroup';
import {getLevelFromClassName} from './utils/helper';
import {ServiceRenderer} from './renderers/Form/Service';

// 兼容老的用法，老用法 label 用在 checkbox 的右侧内容，新用法用 option 来代替。
addSchemaFilter(function CheckboxPropsFilter(schema: Schema, renderer) {
  if (renderer.component !== CheckboxControlRenderer) {
    return schema;
  }

  if (schema.label && typeof schema.option === 'undefined') {
    schema = {
      ...schema
    };
    schema.option = schema.label;
    delete schema.label;
  }

  return schema;
});

function convertFieldSetTabs2Controls(schema: any) {
  const toUpdate: any = {};
  let flag = false;

  toUpdate.controls = Array.isArray(schema.controls)
    ? schema.controls.concat()
    : [];
  toUpdate.controls = toUpdate.controls.map((control: any) => {
    if (Array.isArray(control)) {
      let converted = convertFieldSetTabs2Controls({
        type: 'group',
        controls: control
      });

      if (converted !== control) {
        flag = true;
      }

      return converted;
    }
    return control;
  });

  schema.fieldSet &&
    (Array.isArray(schema.fieldSet)
      ? schema.fieldSet
      : [schema.fieldSet]
    ).forEach((fieldSet: any) => {
      flag = true;
      toUpdate.controls.push({
        ...convertFieldSetTabs2Controls(fieldSet),
        type: 'fieldSet',
        collapsable: schema.collapsable
      });
    });

  schema.tabs &&
    (flag = true) &&
    toUpdate.controls.push({
      type: 'tabs',
      tabs: schema.tabs.map((tab: any) => convertFieldSetTabs2Controls(tab))
    });

  if (flag) {
    schema = {
      ...schema,
      ...toUpdate
    };
    delete schema.fieldSet;
    delete schema.tabs;
  }
  return schema;
}

// Form 中，把 fieldSet 和 tabs 转成 {type: 'fieldSet', controls: []}
// 同时把数组用法转成 {type: 'group', controls: []}
addSchemaFilter(function FormPropsFilter(schema: Schema, renderer) {
  if (renderer.component !== FormRenderer) {
    return schema;
  }

  if (schema.fieldSet || schema.tabs) {
    // console.warn('Form 下面直接用 fieldSet 或者 tabs 将不支持，请改成在 controls 数组中添加。');
    schema = convertFieldSetTabs2Controls(schema);
  } else if (Array.isArray(schema.controls)) {
    let flag = false;
    let converted = schema.controls.map((control: any) => {
      if (Array.isArray(control)) {
        let converted = convertFieldSetTabs2Controls({
          type: 'group',
          controls: control
        });

        if (converted !== control) {
          flag = true;
        }
        return converted;
      }
      return control;
    });

    if (flag) {
      schema = {
        ...schema,
        controls: converted
      };
    }
  }

  return schema;
});

// FieldSet 中把 controls 里面的数组用法转成 {type: 'group', controls: []}
addSchemaFilter(function FormPropsFilter(schema: Schema, renderer) {
  if (renderer.component !== FieldSetRenderer) {
    return schema;
  }

  if (Array.isArray(schema.controls)) {
    let flag = false;
    let converted = schema.controls.map((control: any) => {
      if (Array.isArray(control)) {
        let converted = convertFieldSetTabs2Controls({
          type: 'group',
          controls: control
        });

        if (converted !== control) {
          flag = true;
        }
        return converted;
      }
      return control;
    });

    if (flag) {
      schema = {
        ...schema,
        controls: converted
      };
    }
  }

  return schema;
});

// Form 里面的 Tabs 中把 controls 里面的数组用法转成 {type: 'group', controls: []}
addSchemaFilter(function FormPropsFilter(schema: Schema, renderer) {
  if (renderer.component !== TabsRenderer) {
    return schema;
  }

  if (Array.isArray(schema.tabs)) {
    let flag = false;
    let converted = schema.tabs.map((tab: any) => {
      let flag2 = false;
      let converted = (tab.controls || []).map((control: any) => {
        if (Array.isArray(control)) {
          let converted = convertFieldSetTabs2Controls({
            type: 'group',
            controls: control
          });

          if (converted !== control) {
            flag2 = true;
          }
          return converted;
        }
        return control;
      });

      if (flag2) {
        flag = true;
        tab = {
          ...tab,
          controls: converted
        };
      }

      return tab;
    });

    if (flag) {
      schema = {
        ...schema,
        tabs: converted
      };
    }
  }

  return schema;
});

function convertArray2Hbox(arr: Array<any>): any {
  let flag = false;
  let converted = arr.map((item: any) => {
    if (Array.isArray(item)) {
      flag = true;
      return convertArray2Hbox(item);
    }

    return item;
  });
  if (!flag) {
    converted = arr;
  }

  return {
    type: 'hbox',
    columns: converted
  };
}

// CRUD/List  和 CRUD/Card 的 body 中的数组用法转成 hbox
addSchemaFilter(function (schema: Schema, renderer) {
  if (
    renderer.component !== CardRenderer &&
    renderer.component !== ListItemRenderer
  ) {
    return schema;
  }

  if (Array.isArray(schema.body)) {
    let flag = false;
    let converted = schema.body.map((item: any) => {
      if (Array.isArray(item)) {
        flag = true;
        return convertArray2Hbox(item);
      }
      return item;
    });

    if (flag) {
      schema = {
        ...schema,
        body: converted
      };
    }
  }

  return schema;
});

// button group 的 btnClassName 和 btnActiveClassName 改成 btnLevel 和 btnActiveLevel 了
addSchemaFilter(function (scheam: Schema, renderer) {
  if (renderer.component !== ButtonGroupControlRenderer) {
    return scheam;
  }

  if (scheam.btnClassName || scheam.btnActiveClassName) {
    scheam = {
      ...scheam,
      btnLevel: getLevelFromClassName(scheam.btnClassName),
      btnActiveLevel: getLevelFromClassName(scheam.btnActiveClassName)
    };

    delete scheam.btnClassName;
    delete scheam.btnActiveClassName;
  }

  return scheam;
});

// FieldSet  className 定制样式方式改成 size 来配置
addSchemaFilter(function (scheam: Schema, renderer) {
  if (renderer.component !== FieldSetRenderer) {
    return scheam;
  }

  if (
    scheam.className &&
    !scheam.size &&
    /\bfieldset(?:\-(xs|sm|md|lg))?\b/.test(scheam.className)
  ) {
    scheam = {
      ...scheam,
      size: RegExp.$1 || 'base',
      className: scheam.className.replace(
        /\bfieldset(?:\-(xs|sm|md|lg))?\b/,
        ''
      )
    };

    delete scheam.btnClassName;
    delete scheam.btnActiveClassName;
  }

  return scheam;
});

// FieldSet  className 定制样式方式改成 size 来配置
addSchemaFilter(function (scheam: Schema, renderer) {
  if (renderer.component !== ServiceRenderer) {
    return scheam;
  }

  if (scheam.body && scheam.body.controls) {
    scheam = {
      ...scheam,
      controls: scheam.body.controls
    };
    delete scheam.body;
  }

  return scheam;
});
