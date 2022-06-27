/**
 * @file 兼容配置，对于一些老的 api 设计的得不合理的地方做一些适配。
 * @author fex
 */
import {SchemaNode, Schema} from 'amis-core/lib/types';
import {RendererProps, addSchemaFilter} from 'amis-core';
import {CheckboxControlRenderer} from './renderers/Form/Checkbox';
import {FormRenderer, guid} from 'amis-core';
import {FieldSetRenderer} from './renderers/Form/FieldSet';
import {CardRenderer} from './renderers/Card';
import {ListItemRenderer} from './renderers/List';
import {ButtonGroupControlRenderer} from './renderers/Form/ButtonGroupSelect';
import {getLevelFromClassName, qsparse, RendererConfig} from 'amis-core';
import {FileControlRenderer} from './renderers/Form/InputFile';
import {ImageControlRenderer} from './renderers/Form/InputImage';
import {RichTextControlRenderer} from './renderers/Form/InputRichText';
import isPlainObject from 'lodash/isPlainObject';
import {GridRenderer} from './renderers/Grid';
import {HBoxRenderer} from './renderers/HBox';
import {
  ActionRenderer,
  ButtonRenderer,
  SubmitRenderer,
  ResetRenderer
} from './renderers/Action';

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

// 事件动作
// 只处理button和action，不做功能按钮的转换
// ajax/download：Action的ajax（附加一些连贯动作）与事件动作中的ajax设计不同，且组件处理不同，细节需要梳理，暂不做转换
// submit/reset/reset-and-submit/clear-and-submit：组件处理不同，细节需要梳理，暂不做转换
// onClick：参数不同，暂不做转换
// saveAs：没有可视化，不做转换
// prev/next/confirm/cancel 暂暂不做转换
addSchemaFilter(function (
  schema: Schema,
  renderer: RendererConfig,
  props: any,
  context: any
) {
  if (
    (renderer.component !== ButtonRenderer &&
      renderer.component !== ActionRenderer) ||
    !schema.actionType
  ) {
    return schema;
  }

  if (
    [
      'dialog',
      'drawer',
      'link',
      'url',
      'email',
      'copy',
      'reload'
      // 'submit',
      // 'reset',
      // 'reset-and-submit',
      // 'clear-and-submit'
    ].includes(schema.actionType)
  ) {
    const actions = schema.onEvent?.click?.actions ?? [];
    let addActions: any = null;

    if (schema.actionType === 'reload') {
      addActions = resolveReloadAction(schema.target);

      delete schema.target;
    }
    // else if (
    //   ['submit', 'reset', 'reset-and-submit', 'clear-and-submit'].includes(
    //     schema.actionType
    //   )
    // ) {
    //   const name = schema.actionType.match(
    //     /^(submit|reset|reset-and-submit|clear-and-submit)$/
    //   )?.[1];
    //   const targetComp = schema.target
    //     ? context?.getComponentByName(schema.target)
    //     : null; // 这里用ByName是为了和老的保持一致
    //   addActions = [
    //     {
    //       actionType: name,
    //       componentId: targetComp
    //         ? targetComp.props.$schema.id || targetComp.props.$schema.name
    //         : schema.target ?? ''
    //     }
    //   ];

    //   delete schema.target;
    // }
    else if (['dialog', 'drawer'].includes(schema.actionType)) {
      const name = schema.actionType.match(/^(dialog|drawer)$/)?.[1];
      let dialogConfig = schema[name];

      // 弹窗附加的reload动作，暂时不转
      // 预期1:是提交请求成功返回后reload，而目前dialog是确认点击后，另外，接口是绑定在内部第一层form上的
      // 预期2:内部form没绑api，提交即刷新
      if (schema.reload) {
        const dialogBody = schema[name].body;
        // 给form绑定提交成功后的reload动作
        const reloadAction = {
          onEvent: {
            submitSucc: {
              actions: resolveReloadAction(schema.reload)
            }
          }
        };
        let addedReload = false;
        let body = {...dialogBody};
        if (Array.isArray(dialogBody)) {
          body = dialogBody?.map((child: any) => {
            if (child.type === 'form' && child.api) {
              addedReload = true;
              return {
                ...child,
                ...reloadAction
              };
            }
            return child;
          });
        } else {
          if (dialogBody.type === 'form' && dialogBody.api) {
            addedReload = true;
            body = {
              ...dialogBody,
              ...reloadAction
            };
          }
        }

        dialogConfig = {
          ...schema[name],
          id: schema[name].id || `ui:${guid()}`,
          body
        };

        // 给dialog的确认提交补个reload
        if (!addedReload) {
          dialogConfig = {
            ...dialogConfig,
            onEvent: {
              confirm: {
                actions: resolveReloadAction(schema.reload)
              }
            }
          };
        }
      }

      addActions = [
        {
          actionType: name,
          [name]: dialogConfig
        }
      ];

      delete schema[name];
    } else if (['link', 'url'].includes(schema.actionType)) {
      const name = schema.actionType.match(/^(link|url)$/)?.[1];
      addActions = [
        {
          actionType: name,
          args: {
            [name]: schema[name],
            to: schema.to,
            blank: schema.blank
          }
        }
      ];

      delete schema[name];
      delete schema.to;
      delete schema.blank;
    } else if (schema.actionType === 'email') {
      addActions = [
        {
          actionType: 'email',
          args: {
            to: schema.to,
            cc: schema.cc,
            subject: schema.subject,
            body: schema.body
          }
        }
      ];

      delete schema.to;
      delete schema.cc;
      delete schema.subject;
      delete schema.body;
    } else if (schema.actionType === 'copy') {
      addActions = [
        {
          actionType: 'copy',
          args: {
            content: schema.content,
            copyFormat: schema.copyFormat
          }
        }
      ];

      delete schema.content;
      delete schema.copyFormat;
    }

    // 刷新
    if (schema.reload) {
      // 跳过dialog/drawer
      if (
        !['dialog', 'drawer'].includes(
          addActions[addActions.length - 1].actionType
        )
      ) {
        addActions = [...addActions, ...resolveReloadAction(schema.reload)];

        // delete schema.reload; // 暂时不下，反正actionType下了，这个留着也不会有影响
      }
    }

    delete schema.actionType;
    schema = {
      ...schema,
      onEvent: {
        click: {
          actions: actions?.length ? addActions : [...addActions, ...actions]
        }
      }
    };
  }

  return schema;

  function resolveReloadAction(target: string | string[]) {
    let actions: any = null;
    let targets = typeof target === 'string' ? target.split(/\s*,\s*/) : target;

    targets.forEach((name: string, index: number) => {
      const idx2 = name.indexOf('?');
      let query = null;

      if (~idx2) {
        query = qsparse(
          name
            .substring(idx2 + 1)
            .replace(
              /\$\{(.*?)\}/,
              (_, match) => '${' + encodeURIComponent(match) + '}'
            )
        );
        name = name.substring(0, idx2);
      }

      let reloadAction: any = {};
      if (name === 'window') {
        reloadAction = {
          actionType: 'refresh'
        };
        // 补参数
        if (query) {
          reloadAction = {
            ...reloadAction,
            args: {
              params: query
            }
          };
        }
      } else {
        const targetComp = context?.getComponentByName(name); // 这里用ByName是为了和老的保持一致
        // 处理子路径，用叶子名称作为name
        const idx = name.indexOf('.');
        if (~idx) {
          name = name.substring(1 + idx);
        }
        reloadAction = {
          actionType: 'reload',
          componentId: targetComp
            ? targetComp.props.$schema.id || targetComp.props.$schema.name
            : name
        };
        // 补参数
        if (query) {
          reloadAction = {
            ...reloadAction,
            args: query
          };
        }
      }

      actions = actions ? [...actions, reloadAction] : [reloadAction];
    });

    return actions;
  }
});
