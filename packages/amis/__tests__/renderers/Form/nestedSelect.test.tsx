/**
 * 组件名称：NestedSelect 级联选择器
 * 单测内容：
 * 01. maxTagLength
 * 02. onlyLeaf
 */

import {render, cleanup, waitFor, fireEvent} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';
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
  // test('with maxTagLength 3', async () => {
  //   const {container, cmpt, queryByText} = await setupNestedSelect({
  //     multiple: true,
  //     maxTagCount: 3,
  //     overflowTagPopover: {
  //       title: '已选项'
  //     },
  //     value:
  //       'Apple,Banana,Blackberry,Blueberry,Cherry,Carambola,Coconut,Kiwifruit,Lemon,Pineapple,Vegetables,Wheat,Rice',
  //     options: [
  //       {
  //         label: '水果',
  //         value: 'Fruits',
  //         children: [
  //           {label: '苹果', value: 'Apple'},
  //           {label: '香蕉', value: 'Banana'},
  //           {label: '黑莓', value: 'Blackberry'},
  //           {label: '蓝莓', value: 'Blueberry'},
  //           {label: '樱桃', value: 'Cherry'},
  //           {label: '杨桃', value: 'Carambola'},
  //           {label: '椰子', value: 'Coconut'},
  //           {label: '猕猴桃', value: 'Kiwifruit'},
  //           {label: '柠檬', value: 'Lemon'},
  //           {label: '菠萝', value: 'Pineapple'}
  //         ]
  //       },
  //       {
  //         label: '蔬菜',
  //         value: 'Vegetables',
  //         children: [
  //           {label: '西兰花', value: 'Broccoli'},
  //           {label: '菠菜', value: 'Spinach'},
  //           {label: '南瓜', value: 'Pumpkin'}
  //         ]
  //       },
  //       {
  //         label: '谷物',
  //         value: 'Grain',
  //         children: [
  //           {label: '小麦', value: 'Wheat'},
  //           {label: '水稻', value: 'Rice'},
  //           {label: '燕麦', value: 'Oats'}
  //         ]
  //       }
  //     ]
  //   });
  //   const list = container.querySelectorAll('.cxd-ResultBox-value-wrap')[0];
  //   /** Tag 数量正确 */
  //   expect(list.childNodes.length).toBe(4);
  //   const overflowText = '+ 10 ...';
  //   /** 收纳 Tag 可见 */
  //   expect(queryByText(overflowText)).toBeVisible();
  //   expect(container).toMatchSnapshot();
  // });
});

describe('Renderer:NestedSelect with onlyLeaf', () => {
  test('single selection', async () => {
    const optionWithNoChild = 'OptionWithNoChild';
    const optionWithChild = 'OptionWithChild';
    const {container, queryByText} = await setupNestedSelect({
      onlyLeaf: true,
      options: [
        {label: '选项A', value: 'A'},
        {label: optionWithNoChild, value: 'B', children: []},
        {
          label: optionWithChild,
          value: 'C',
          children: [
            {label: '选项c1', value: 'c1'},
            {label: '选项c2', value: 'c2'}
          ]
        }
      ]
    });

    const trigger = container.querySelector('.cxd-ResultBox');
    expect(trigger).toBeInTheDocument();

    fireEvent.click(trigger!);
    await wait(200);

    const parentNum =
      container.querySelectorAll('.cxd-NestedSelect-optionArrowRight')
        ?.length ?? 0;
    expect(parentNum).toEqual(1);

    let options = container.querySelectorAll('.cxd-NestedSelect-optionLabel');
    expect(options.length).toEqual(3);

    /** onlyLeaf开启后，children为空数组的选项也可以选择 */
    fireEvent.click(options[1]);
    await wait(300);
    expect(queryByText(optionWithNoChild)!).toBeInTheDocument();

    fireEvent.click(trigger!);
    await wait(200);
    options = container.querySelectorAll('.cxd-NestedSelect-optionLabel');
    fireEvent.click(options[2]);
    await wait(300);
    fireEvent.click(trigger!);
    await wait(200);
    expect(queryByText(optionWithNoChild)!).toBeInTheDocument();
    /** onlyLeaf开启后，children非空的选项无法选择 */
    expect(queryByText(optionWithChild)).toBeNull();
  });

  test('single selection', async () => {
    const optionWithNoChild = 'OptionWithNoChild';
    const optionWithChild = 'OptionWithChild';
    const {container, queryByText} = await setupNestedSelect({
      onlyLeaf: true,
      multiple: true,
      options: [
        {label: '选项A', value: 'A'},
        {label: optionWithNoChild, value: 'B', children: []},
        {
          label: optionWithChild,
          value: 'C',
          children: [
            {label: '选项c1', value: 'c1'},
            {label: '选项c2', value: 'c2'}
          ]
        }
      ]
    });

    const trigger = container.querySelector('.cxd-ResultBox');
    expect(trigger).toBeInTheDocument();

    fireEvent.click(trigger!);
    await wait(200);

    const parentNum =
      container.querySelectorAll('.cxd-NestedSelect-optionArrowRight')
        ?.length ?? 0;
    expect(parentNum).toEqual(1);

    let options = container.querySelectorAll('.cxd-NestedSelect-optionLabel');
    expect(options.length).toEqual(3);

    /** onlyLeaf开启后，children为空数组的选项也可以选择 */
    fireEvent.click(options[1]);
    await wait(300);
    fireEvent.click(trigger!);
    await wait(200);
    expect(queryByText(optionWithNoChild)!).toBeInTheDocument();

    fireEvent.click(trigger!);
    await wait(200);
    options = container.querySelectorAll('.cxd-NestedSelect-optionLabel');
    fireEvent.click(options[2]);
    await wait(300);
    fireEvent.click(trigger!);
    await wait(200);
    expect(queryByText(optionWithNoChild)!).toBeInTheDocument();
    /** onlyLeaf开启后，children非空的选项无法选择 */
    expect(queryByText(optionWithChild)).toBeNull();
  });
});

test('test onlyChildren&onlyleaf', async () => {
  const {container} = await setupNestedSelect({
    onlyLeaf: true,
    multiple: true,
    options: [
      {label: '选项A', value: 'A'},
      {
        label: '选项B',
        value: 'B',
        children: [
          {label: '选项b1', value: 'b1'},
          {label: '选项b2', value: 'b2'}
        ]
      },
      {label: '选项C-children为null', value: 'C', children: []},
      {
        label: '选项d',
        value: 'd',
        children: [{label: '选项D1-CHILDREN为null', value: 'D1', children: []}]
      }
    ]
  });

  const trigger = container.querySelector('.cxd-ResultBox');
  expect(trigger).toBeInTheDocument();

  fireEvent.click(trigger!);
  await wait(200);

  const hasActive = container.querySelector('.is-active');
  expect(hasActive).toBeNull();
});
