import React = require('react');
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';

const testSchema = {
  type: 'page',
  body: {
    type: 'form',
    body: [
      {
        type: 'condition-builder',
        label: '条件组件',
        name: 'conditions',
        description:
          '适合让用户自己拼查询条件，然后后端根据数据生成 query where',
        fields: [
          {
            label: '文本',
            type: 'text',
            name: 'text'
          },
          {
            label: '数字',
            type: 'number',
            name: 'number'
          },
          {
            label: '布尔',
            type: 'boolean',
            name: 'boolean'
          },
          {
            label: '选项',
            type: 'select',
            name: 'select',
            options: [
              {
                label: 'A',
                value: 'a'
              },
              {
                label: 'B',
                value: 'b'
              },
              {
                label: 'C',
                value: 'c'
              },
              {
                label: 'D',
                value: 'd'
              },
              {
                label: 'E',
                value: 'e'
              }
            ]
          },
          {
            label: '动态选项',
            type: 'select',
            name: 'select2',
            source: '/api/mock2/form/getOptions?waitSeconds=1'
          },
          {
            label: '日期',
            children: [
              {
                label: '日期',
                type: 'date',
                name: 'date'
              },
              {
                label: '时间',
                type: 'time',
                name: 'time'
              },
              {
                label: '日期时间',
                type: 'datetime',
                name: 'datetime'
              }
            ]
          }
        ]
      }
    ]
  }
};

test('Renderer:condition-builder', () => {
  const {container} = render(amisRender(testSchema, {}, makeEnv({})));

  expect(container).toMatchSnapshot();
});

test('Renderer:condition-builder add', async () => {
  const onChange = jest.fn();
  const {container, findByText, findByPlaceholderText} = render(
    amisRender(testSchema, {onChange}, makeEnv({}))
  );

  const andCondition = await findByText('并且');

  fireEvent.mouseOver(andCondition);

  const addCondition = await findByText('添加条件');

  fireEvent.click(addCondition);

  const inputText = await findByText('请选择字段');

  fireEvent.click(inputText);

  const textType = await findByText('文本');

  fireEvent.click(textType);

  const textOpType = await findByText('请选择操作');

  fireEvent.click(textOpType);

  const qualOpType = await findByText('等于');

  fireEvent.click(qualOpType);

  const textRightInput = await findByPlaceholderText('请输入文本');

  fireEvent.change(textRightInput, {target: {value: 'amis'}});

  await wait(500);

  /** Form的debug区域升级成json组件了，无法直接通过innerHtml获取form data */
  const formData = onChange.mock.calls[0][0];
  expect(onChange).toHaveBeenCalled();
  expect(formData).toMatchObject({
    conditions: {
      conjunction: 'and',
      children: [
        {
          left: {
            type: 'field',
            field: 'text'
          },
          op: 'equal',
          right: 'amis'
        }
      ]
    }
  });
});

test('Renderer:condition-builder drag order', async () => {
  const {container, findByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          body: [
            {
              type: 'condition-builder',
              label: '条件组件',
              name: 'conditions',
              description:
                '适合让用户自己拼查询条件，然后后端根据数据生成 query where',
              fields: [
                {
                  label: 'AText',
                  type: 'text',
                  name: 'a'
                },
                {
                  label: 'BText',
                  type: 'text',
                  name: 'b'
                }
              ],
              value: {
                id: 'ab8c8eaea7e4',
                conjunction: 'and',
                children: [
                  {
                    id: '87cbc666c5ce',
                    left: {
                      type: 'field',
                      field: 'a'
                    }
                  },
                  {
                    id: '395df0331a46',
                    left: {
                      type: 'field',
                      field: 'b'
                    }
                  }
                ]
              }
            }
          ]
        }
      },
      {},
      makeEnv({})
    )
  );

  await findByText('BText');

  const dragbar = container.querySelectorAll('.cxd-CBGroupOrItem-dragbar');

  // TODO: jsdom 目前还不支持 drag，用不了
  // fireEvent.dragStart(dragbar[1]);
  // fireEvent.dragEnter(dragbar[0]);
  // fireEvent.drop(dragbar[0]);
  // fireEvent.dragLeave(dragbar[0]);
  // fireEvent.dragEnd(dragbar[1]);
});
