/**
 * @file 兼容配置，对于一些老的 api 设计的得不合理的地方做一些适配。
 * @author fex
 */
import {SchemaNode, Schema} from './types';
import {RendererProps, RendererConfig, addSchemaFilter} from './factory';
import {CheckboxControlRenderer} from './renderers/Form/Checkbox';
import {FormRenderer} from './renderers/Form/index';
import {FieldSetRenderer} from './renderers/Form/FieldSet';
import {CardRenderer} from './renderers/Card';
import {ListItemRenderer} from './renderers/List';
import {ButtonGroupControlRenderer} from './renderers/Form/ButtonGroupSelect';
import {getLevelFromClassName} from './utils/helper';
import {FileControlRenderer} from './renderers/Form/InputFile';
import {ImageControlRenderer} from './renderers/Form/InputImage';
import {RichTextControlRenderer} from './renderers/Form/InputRichText';
import isPlainObject from 'lodash/isPlainObject';
import {GridRenderer} from './renderers/Grid';
import {HBoxRenderer} from './renderers/HBox';

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

// 原 reciever 错别字改为 receiver
addSchemaFilter(function (scheam: Schema, renderer) {
  if (
    renderer.component !== FileControlRenderer &&
    renderer.component !== ImageControlRenderer &&
    renderer.component !== RichTextControlRenderer
  ) {
    return scheam;
  }

  if (scheam.reciever) {
    scheam = {
      ...scheam,
      receiver: scheam.reciever
    };
    delete scheam.reciever;
  }

  if (scheam.videoReciever) {
    scheam = {
      ...scheam,
      videoReceiver: scheam.reciever
    };
    delete scheam.reciever;
  }

  return scheam;
});

// Grid 一些旧格式的兼容
addSchemaFilter(function (scheam: Schema, renderer) {
  if (renderer.component !== GridRenderer) {
    return scheam;
  }

  if (
    Array.isArray(scheam.columns) &&
    scheam.columns.some(item => Array.isArray(item) || item.type)
  ) {
    scheam = {
      ...scheam,
      columns: scheam.columns.map(item => {
        if (Array.isArray(item)) {
          return {
            body: [
              {
                type: 'grid',
                columns: item
              }
            ]
          };
        } else if (item.type) {
          let {xs, sm, md, lg, columnClassName, ...rest} = item;
          item = {
            xs,
            sm,
            md,
            lg,
            columnClassName,
            body: [rest]
          };
        }

        return item;
      })
    };
  }

  return scheam;
});

// Hbox 一些旧格式的兼容
addSchemaFilter(function (scheam: Schema, renderer) {
  if (renderer.component !== HBoxRenderer) {
    return scheam;
  }

  if (Array.isArray(scheam.columns) && scheam.columns.some(item => item.type)) {
    scheam = {
      ...scheam,
      columns: scheam.columns.map(item => {
        let {
          width,
          height,
          style,
          columnClassName,
          visible,
          visibleOn,
          ...rest
        } = item;
        if (item.type) {
          item = {
            width,
            height,
            style,
            columnClassName,
            visible,
            visibleOn,
            body: [rest]
          };
        }

        return item;
      })
    };
  }

  return scheam;
});

const controlMapping: any = {
  'array': 'input-array',
  'button-group': 'button-group-select',
  'city': 'input-city',
  'color': 'input-color',
  'date': 'input-date',
  'datetime': 'input-datetime',
  'time': 'input-time',
  'quarter': 'input-quarter',
  'month': 'input-month',
  'year': 'input-year',
  'date-range': 'input-date-range',
  'datetime-range': 'input-datetime-range',
  'diff': 'diff-editor',
  'file': 'input-file',
  'image': 'input-image',
  'list': 'list-select',
  'location': 'location-picker',
  'matrix': 'matrix-checkboxes',
  'month-range': 'input-month-range',
  'quarter-range': 'input-quarter-range',
  'number': 'input-number',
  'range': 'input-range',
  'rating': 'input-rating',
  'repeat': 'input-repeat',
  'rich-text': 'input-rich-text',
  'form': 'input-sub-form',
  'table': 'input-table',
  'tag': 'input-tag',
  'text': 'input-text',
  'url': 'input-url',
  'password': 'input-password',
  'email': 'input-email',
  'tree': 'input-tree',
  'progress': 'static-progress',
  'mapping': 'static-mapping'
};

const maybeFormItem = [
  'button',
  'submit',
  'reset',
  'button-group',
  'button-toolbar',
  'container',
  'grid',
  'hbox',
  'panel',
  'anchor-nav',
  'qr-code'
];

function wrapControl(item: any) {
  if (!item || !item.type) {
    return item;
  }

  let {
    label,
    description,
    name,
    required,
    remark,
    inputOnly,
    labelClassName,
    caption,
    labelRemark,
    descriptionClassName,
    captionClassName,
    hint,
    showErrorMsg,
    mode,
    horizontal,
    className,
    inputClassName,
    columnClassName,
    visibleOn,
    visible,
    ...rest
  } = item;

  rest.name = name;
  rest.className = inputClassName;

  // 如果是按钮
  if (~['button', 'submit', 'reset'].indexOf(rest.type)) {
    rest.label = label;
    label = '';
  }

  return {
    type: 'control',
    label,
    description,
    name,
    required,
    remark,
    inputOnly,
    labelClassName,
    caption,
    labelRemark,
    descriptionClassName,
    captionClassName,
    hint,
    showErrorMsg,
    mode,
    horizontal,
    className,
    columnClassName,
    visibleOn,
    visible,
    body: rest
  };
}

const maybeStatic = [
  'tpl',
  'mapping',
  'progress',
  'status',
  'json',
  'video',
  'qrcode',
  'plain',
  'each',
  'link'
];

function wrapStatic(item: any) {
  if (!item || !item.type) {
    return item;
  }

  return {
    ...item,
    type: `static-${item.type}`
  };
}

addSchemaFilter(function (schema: Schema, renderer: any, props: any) {
  const type =
    typeof schema?.type === 'string' ? schema.type.toLowerCase() : '';

  // controls 转成 body
  if (type === 'combo' && Array.isArray(schema.conditions)) {
    schema = {
      ...schema,
      conditions: schema.conditions.map(condition => {
        if (Array.isArray(condition.controls)) {
          condition = {
            ...condition,
            items: condition.controls.map(controlToNormalRenderer)
          };
          delete condition.controls;
        }

        return condition;
      })
    };
  }

  if (
    schema?.controls &&
    schema.type !== 'audio' &&
    schema.type !== 'carousel'
  ) {
    schema = {
      ...schema,
      [schema.type === 'combo' ? `items` : 'body']: (Array.isArray(
        schema.controls
      )
        ? schema.controls
        : [schema.controls]
      ).map(controlToNormalRenderer)
    };
    delete schema.controls;
  } else if (
    schema?.quickEdit?.controls &&
    (!schema.quickEdit.type ||
      !~['combo', 'group', 'panel', 'fieldSet', 'fieldset'].indexOf(
        schema.quickEdit.type
      ))
  ) {
    schema = {
      ...schema,
      quickEdit: {
        ...schema.quickEdit,
        body: (Array.isArray(schema.quickEdit.controls)
          ? schema.quickEdit.controls
          : [schema.quickEdit.controls]
        ).map(controlToNormalRenderer)
      }
    };
    delete schema.quickEdit.controls;
  } else if (schema?.quickEdit?.type) {
    schema = {
      ...schema,
      quickEdit: controlToNormalRenderer(schema.quickEdit)
    };
  } else if (type === 'tabs' && Array.isArray(schema.tabs)) {
    schema = {
      ...schema,
      tabs: schema.tabs.map(tab => {
        if (Array.isArray(tab.controls) && !Array.isArray(tab.body)) {
          tab = {
            ...tab,
            body: tab.controls.map(controlToNormalRenderer)
          };
          delete tab.controls;
        }

        return tab;
      })
    };
  } else if (type === 'anchor-nav' && Array.isArray(schema.links)) {
    schema = {
      ...schema,
      links: schema.links.map(link => {
        if (Array.isArray(link.controls)) {
          link = {
            ...link,
            body: link?.controls.map(controlToNormalRenderer)
          };

          delete link.controls;
        }

        return link;
      })
    };
  } else if (type === 'input-array' && schema.items) {
    schema = {
      ...schema,
      items: Array.isArray(schema.items)
        ? schema.items.map(controlToNormalRenderer)
        : controlToNormalRenderer(schema.items)
    };
  } else if (
    (type === 'grid' || type === 'hbox') &&
    Array.isArray(schema.columns)
  ) {
    schema = {
      ...schema,
      columns: schema.columns.map(column => {
        if (Array.isArray(column.controls)) {
          column = {
            ...column,

            body: column?.controls.map(controlToNormalRenderer)
          };

          // 有可能直接外面的grid 或者 bhox 列里面用 form 的。
          if (column.type !== 'form') {
            delete column.type;
          }

          delete column.controls;
        }

        return column;
      })
    };
  } else if (type === 'service' && schema?.body?.controls) {
    schema = {
      ...schema,
      body: (Array.isArray(schema.body.controls)
        ? schema.body.controls
        : [schema.body.controls]
      ).map(controlToNormalRenderer)
    };
  }

  return schema;

  function controlToNormalRenderer(item: any) {
    if (item?.$ref && props.resolveDefinitions) {
      item = {
        ...props.resolveDefinitions(item.$ref),
        ...item
      };
      delete item.$ref;
    }

    return item && controlMapping[item.type]
      ? {
          ...item,
          type: controlMapping[item.type]
        }
      : ~maybeFormItem.indexOf(item?.type)
      ? wrapControl(item)
      : ~maybeStatic.indexOf(item?.type)
      ? wrapStatic(item)
      : item;
  }
});
