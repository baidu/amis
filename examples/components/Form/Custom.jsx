import React from 'react';
import {FormItem, Renderer} from '../../../src/index';

@FormItem({
  type: 'my-custom'
})
class MyFormItem extends React.Component {
  render() {
    const {value, onChange} = this.props;

    return (
      <div>
        <p>这个是个自定义组件。通过注册渲染器的方式实现。</p>

        <p>当前值：{JSON.stringify(value)}</p>

        <a
          className="btn btn-default"
          onClick={() => onChange(Math.round(Math.random() * 10000))}
        >
          随机修改
        </a>
      </div>
    );
  }
}

@Renderer({
  test: /(^|\/)my\-renderer$/,
  autoVar: true
})
class CustomRenderer extends React.Component {
  render() {
    const {tip, source} = this.props;
    return source ? (
      <div>{`非 FormItem 类型的渲染器注册，通过变量获取 x 的值为：${source}`}</div>
    ) : (
      <div>{tip}</div>
    );
  }
}

export default {
  title: '自定义组件示例',
  body: [
    {
      type: 'form',
      mode: 'horizontal',
      api: '/api/mock2/form/saveForm?waitSeconds=2',
      debug: true,
      actions: [
        {
          type: 'submit',
          label: '提交',
          primary: true
        }
      ],
      body: [
        {
          label: '姓名',
          type: 'text',
          name: 'name'
        },

        {
          type: 'divider'
        },

        {
          label: '使用 custom 组件',
          name: 'name',
          type: 'custom',
          onMount: (dom, data, onChange) => {
            const button = document.createElement('button');
            button.innerText = '点击修改姓名';
            button.onclick = event => {
              onChange('new name');
              event.preventDefault();
            };
            dom.appendChild(button);
          },
          onUpdate: (dom, data) => {
            console.log('数据有变化', data);
          }
        },

        {
          type: 'divider'
        },

        {
          name: 'a',
          asFormItem: true,
          children: ({value, onChange}) => (
            <div>
              <p>这是使用 children 的方式，也无需注册。</p>

              <p>当前值：{value}</p>

              <a
                className="btn btn-default"
                onClick={() => onChange(Math.round(Math.random() * 10000))}
              >
                随机修改
              </a>
            </div>
          )
        },

        {
          type: 'divider'
        },

        {
          name: 'b',
          type: 'my-custom',
          label: '自定义FormItem'
        },

        {
          type: 'divider'
        },

        {
          type: 'control',
          body: {
            type: 'my-renderer',
            source: '${x}'
          }
        },

        {
          type: 'divider'
        },
        {
          label: '',
          asFormItem: true,
          children: ({render}) => (
            <div>
              <p>组合现有组件</p>

              {render(
                'formitem',
                [
                  {
                    type: 'input-text',
                    name: 'x',
                    label: 'X',
                    value: '1'
                  },
                  {
                    type: 'input-text',
                    name: 'y',
                    label: 'Y'
                  }
                ],
                {
                  formMode: 'normal'
                }
              )}
            </div>
          )
        },
        {
          name: 'c',
          label: '',
          asFormItem: true,
          component: ({render, value, onChange, name}) => {
            function handleXChange(x) {
              value = {
                ...value,
                x
              };
              onChange(value);

              // 一定要 return false
              return false;
            }

            function handleYChange(y) {
              value = {
                ...value,
                y
              };
              onChange(value);

              // 一定要 return false
              return false;
            }

            return (
              <div>
                <p>组合现有组件并控制数据</p>

                {render(
                  'item1',
                  {
                    type: 'input-text',
                    name: 'x',
                    label: 'X'
                  },
                  {
                    value: value?.x || '',
                    onChange: handleXChange
                  }
                )}

                {render(
                  'item2',
                  {
                    type: 'input-text',
                    name: 'y',
                    label: 'Y'
                  },
                  {
                    value: value?.y || '',
                    onChange: handleYChange
                  }
                )}
              </div>
            );
          }
        }
      ]
    },

    {
      type: 'my-renderer',
      tip: '放表单外的情况'
    }
  ]
};
