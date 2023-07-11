/**
 * 组件名称：NestedSelect 级联选择器
 * 单测内容：
 * 01. maxTagLength
 */

import {render, cleanup, waitFor} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv} from '../../helper';
import {clearStoresCache} from '../../../src';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

const setupNestedSelect = async (
  schema: any = {},
  props: any = {},
  env: any = {}
) => {
  const renderResult = render(
    amisRender(
      {
        type: 'form',
        wrapWithPanel: false,
        body: [
          {
            type: 'nested-select',
            name: 'nestedSelect',
            label: 'NestedSelect',
            ...schema
          }
        ]
      },
      {...props},
      makeEnv({...env})
    )
  );

  await waitFor(() => {
    expect(
      renderResult.container.querySelector('.cxd-NestedSelectControl')
    ).toBeInTheDocument();
  });

  const cmpt = renderResult.container.querySelector(
    '.cxd-ResultBox .cxd-NestedSelect'
  ) as HTMLDivElement;

  return {
    ...renderResult,
    cmpt
  };
};

describe('Renderer:NestedSelect', () => {
  test('with maxTagLength 3', async () => {
    const {container, cmpt, queryByText} = await setupNestedSelect({
      multiple: true,
      maxTagCount: 3,
      overflowTagPopover: {
        title: '已选项'
      },
      value:
        'Apple,Banana,Blackberry,Blueberry,Cherry,Carambola,Coconut,Kiwifruit,Lemon,Pineapple,Vegetables,Wheat,Rice',
      options: [
        {
          label: '水果',
          value: 'Fruits',
          children: [
            {label: '苹果', value: 'Apple'},
            {label: '香蕉', value: 'Banana'},
            {label: '黑莓', value: 'Blackberry'},
            {label: '蓝莓', value: 'Blueberry'},
            {label: '樱桃', value: 'Cherry'},
            {label: '杨桃', value: 'Carambola'},
            {label: '椰子', value: 'Coconut'},
            {label: '猕猴桃', value: 'Kiwifruit'},
            {label: '柠檬', value: 'Lemon'},
            {label: '菠萝', value: 'Pineapple'}
          ]
        },
        {
          label: '蔬菜',
          value: 'Vegetables',
          children: [
            {label: '西兰花', value: 'Broccoli'},
            {label: '菠菜', value: 'Spinach'},
            {label: '南瓜', value: 'Pumpkin'}
          ]
        },
        {
          label: '谷物',
          value: 'Grain',
          children: [
            {label: '小麦', value: 'Wheat'},
            {label: '水稻', value: 'Rice'},
            {label: '燕麦', value: 'Oats'}
          ]
        }
      ]
    });

    const list = container.querySelectorAll('.cxd-ResultBox-value-wrap')[0];
    /** Tag 数量正确 */
    expect(list.childNodes.length).toBe(4);

    const overflowText = '+ 10 ...';
    /** 收纳 Tag 可见 */
    expect(queryByText(overflowText)).toBeVisible();
    expect(container).toMatchSnapshot();
  });
});
