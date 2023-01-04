/**
 * @file 变量更新示例
 */
import update from 'lodash/update';
import isEqual from 'lodash/isEqual';
import {cloneObject, setVariable} from 'amis-core';

const namespace = 'appVariables';
const initData = JSON.parse(sessionStorage.getItem(namespace)) || {
  ProductName: 'BCC',
  Banlance: 1234.888,
  ProductNum: 10,
  isOnline: false,
  ProductList: ['BCC', 'BOS', 'VPC'],
  PROFILE: {
    FirstName: 'Amis',
    Age: 18,
    Address: {
      street: 'ShangDi',
      postcode: 100001
    }
  }
};

export default {
  /** schema配置 */
  schema: {
    type: 'page',
    title: '更新变量数据',
    body: [
      {
        type: 'tpl',
        tpl: '变量的命名空间通过环境变量设置为了<code>appVariables</code>, 可以通过\\${appVariables.xxx}来取值'
      },
      {
        type: 'container',
        style: {
          padding: '8px',
          marginBottom: '8px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px'
        },
        body: [
          {
            type: 'tpl',
            tpl: '<h2>数据域appVariables</h2>'
          },
          {
            type: 'json',
            id: 'u:44521540e64c',
            source: '${appVariables}',
            levelExpand: 10
          },
          {
            type: 'tpl',
            tpl: '<h3>接口中的<code>ProductName (\\${ProductName})</code>: <strong>${ProductName|default:-}</strong></h3>',
            inline: false,
            id: 'u:98ed5c5534ef'
          },
          {
            type: 'tpl',
            tpl: '<h3>变量中的<code>ProductName (\\${appVariables.ProductName})</code>: <strong>${appVariables.ProductName|default:-}</strong></h3>',
            inline: false,
            id: 'u:98ed5c5534ef'
          }
        ]
      },
      {
        type: 'form',
        title: '表单',
        debug: true,
        body: [
          {
            label: '产品名称',
            type: 'input-text',
            name: 'product',
            placeholder: '请输入内容, 观察引用变量组件的变化',
            id: 'u:d9802fd83145',
            onEvent: {
              change: {
                weight: 0,
                actions: [
                  {
                    args: {
                      path: 'appVariables.ProductName',
                      value: '${event.data.value}'
                    },
                    actionType: 'setValue'
                  }
                ]
              }
            }
          },
          {
            type: 'static',
            label: '产品名称描述',
            id: 'u:7bd4e2a4f95e',
            value: '${appVariables.ProductName}',
            name: 'staticName'
          }
        ],
        id: 'u:dc2580fa447a'
      }
    ],
    initApi: '/api/mock2/page/initData2',
    onEvent: {
      inited: {
        weight: 0,
        actions: [
          {
            args: {
              path: 'appVariables.ProductName',
              value: '${event.data.ProductName}'
            },
            actionType: 'setValue'
          }
        ]
      }
    }
  },
  props: {
    data: {[namespace]: JSON.parse(sessionStorage.getItem(namespace))}
  },
  /** 环境变量 */
  env: {
    beforeSetData: (renderer, action, event) => {
      const value = event?.data?.value ?? action?.args?.value;
      const path = action?.args?.path;
      const {session = 'global'} = renderer.props?.env ?? {};
      const comptList = event?.context?.scoped?.getComponentsByRefPath(
        session,
        path
      );

      for (let component of comptList) {
        const {$path: targetPath, $schema: targetSchema} = component?.props;
        const {$path: triggerPath, $schema: triggerSchema} = renderer?.props;

        if (
          !component.setData &&
          (targetPath === triggerPath || isEqual(targetSchema, triggerSchema))
        ) {
          continue;
        }

        if (component?.props?.onChange) {
          const submitOnChange = !!component.props?.$schema?.submitOnChange;

          component.props.onChange(value, submitOnChange, true);
        } else if (component?.setData) {
          const currentData = JSON.parse(
            sessionStorage.getItem(namespace) || JSON.stringify(initData)
          );
          const varPath = path.replace(/^appVariables\./, '');

          update(currentData, varPath, origin => {
            return typeof value === typeof origin ? value : origin;
          });

          sessionStorage.setItem(namespace, JSON.stringify(currentData));
          const newCtx = cloneObject(component?.props?.data ?? {});
          setVariable(newCtx, path, value, true);

          component.setData(newCtx, false);
        }
      }
    }
  }
};
