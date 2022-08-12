/**
 * 组件名称：InputRating 评分
 * 单测内容：
 * 1. 总分数 count 与 是否允许半星 half
 * 2. 自定义颜色 colors 与 默认未选中色 inactiveColor
 * 3. 自定义提示文字 texts 与 提示文字位置 textPosition 、文字css类名 textClassName
 * 4. 自定义字符 char 与 字符css类名 charClassName
 * 5. 是否允许再次点击后清除 allowClear
 * 6. 是否只读 readOnly
 */

import {render, fireEvent, waitFor} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';

const setup = async (options: any = {}, items: any[] = []) => {
  const util = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        title: 'The form',
        body: [
          {
            type: 'input-rating',
            name: 'rating',
            label: '评分',
            count: 5,
            value: 3,
            ...options
          },
          ...items
        ]
      },
      {},
      makeEnv({})
    )
  );

  const rating = util.container.querySelector('.cxd-Rating')!;

  expect(rating).toBeInTheDocument();

  return {
    ...util,
    rating
  };
};

test('Renderer:rating with count & half', async () => {
  const {container, rating} = await setup({
    value: 3.5,
    half: true,
    count: 5
  });

  expect(container.querySelectorAll('.cxd-Rating-star').length).toBe(5);
  expect(container.querySelectorAll('.cxd-Rating-star.is-active').length).toBe(
    3
  );
  expect(container.querySelectorAll('.cxd-Rating-star.is-half').length).toBe(1);

  expect(container).toMatchSnapshot();
});

test('Renderer:rating with colors & inactiveColor', async () => {
  const {container, rating} = await setup(
    {
      name: 'rating',
      inactiveColor: 'yellow',
      value: 0,
      colors: {
        1: 'gray',
        2: '#678f8d',
        3: 'rgb(119, 168, 141)',
        4: 'hsl(147, 22%, 56%)',
        5: 'red'
      }
    },
    [
      {
        type: 'input-number',
        name: 'rating',
        label: '选中数量'
      }
    ]
  );
  const firstStar = rating.querySelector('.cxd-Rating-star')!;
  const input = container.querySelector('.cxd-Number-input-wrap input')!;

  expect(firstStar.getAttribute('style')).toContain('color: yellow');

  fireEvent.change(input, {
    target: {
      value: 1
    }
  });
  await waitFor(() => {
    expect(firstStar.getAttribute('style')).toContain('color: gray');
  });

  fireEvent.change(input, {
    target: {
      value: 2
    }
  });
  await waitFor(() => {
    // react 把 #678f8d 转成 rgb
    expect(firstStar.getAttribute('style')).toContain(
      'color: rgb(103, 143, 141)'
    );
  });

  fireEvent.change(input, {
    target: {
      value: 3
    }
  });
  await waitFor(() => {
    expect(firstStar.getAttribute('style')).toContain(
      'color: rgb(119, 168, 141)'
    );
  });

  expect(container).toMatchSnapshot();
});

test('Renderer:rating with texts & textPosition & textClassName', async () => {
  const {container, rating} = await setup(
    {
      name: 'rating',
      value: 0,
      texts: {
        1: '有点差',
        4: '中规中矩',
        5: '非常优秀'
      },
      textPosition: 'left',
      textClassName: 'test-rating-class'
    },
    [
      {
        type: 'input-number',
        name: 'rating',
        label: '选中数量'
      }
    ]
  );

  // 值为 0 不显示提示文字
  expect(container.querySelector('.cxd-Rating-text')).not.toBeInTheDocument();
  const input = container.querySelector('.cxd-Number-input-wrap input')!;

  fireEvent.change(input, {
    target: {
      value: 1
    }
  });

  await wait(500);

  const textDom = container.querySelector(
    '.cxd-Rating-text.cxd-Rating-text--left.test-rating-class'
  )!;
  // 一星
  expect(textDom).toBeInTheDocument();
  expect(textDom.innerHTML).toBe('有点差');

  fireEvent.change(input, {
    target: {
      value: 2
    }
  });
  // 二星，texts 向后寻找，
  await waitFor(() => {
    expect(textDom.innerHTML).toBe('中规中矩');
  });

  fireEvent.change(input, {
    target: {
      value: 5
    }
  });
  // 五星
  await waitFor(() => {
    expect(textDom.innerHTML).toBe('非常优秀');
  });

  expect(container).toMatchSnapshot();
});

test('Renderer:rating with char & charClassName', async () => {
  const {container} = await setup({
    value: 2,
    char: 'X',
    charClassName: 'test-rating-char'
  });

  expect(
    container.querySelectorAll('.cxd-Rating-star.test-rating-char').length
  ).toBe(5);

  expect(
    (container.querySelector('.cxd-Rating-star.test-rating-char') as Element)
      .innerHTML
  ).toBe('X');

  expect(container).toMatchSnapshot();
});

test('Renderer:rating with allowClear', async () => {
  const {container} = await setup(
    {
      value: 2,
      name: 'rating',
      allowClear: true
    },
    [
      {
        type: 'input-number',
        name: 'rating'
      }
    ]
  );

  const input = (container.querySelector(
    '.cxd-Number-input-wrap input'
  ) as HTMLInputElement)!;
  expect(input.value).toBe('2');

  const secondStar = container.querySelector(
    '.cxd-Rating > ul > li:nth-child(2)'
  )!;
  fireEvent.click(secondStar);

  await waitFor(() => {
    expect(input.value).toBe('0');
  });

  expect(container).toMatchSnapshot();
});

test('Renderer:rating with readOnly', async () => {
  const {container} = await setup(
    {
      value: 5,
      name: 'rating',
      readOnly: true
    },
    [
      {
        type: 'input-number',
        name: 'rating'
      }
    ]
  );

  const input = (container.querySelector(
    '.cxd-Number-input-wrap input'
  ) as HTMLInputElement)!;
  expect(input.value).toBe('5');

  const secondStar = container.querySelector(
    '.cxd-Rating > ul > li:nth-child(2)'
  )!;
  fireEvent.click(secondStar);

  // readOnly 点击不生效
  await waitFor(() => {
    expect(input.value).toBe('5');
  });

  expect(container).toMatchSnapshot();
});
