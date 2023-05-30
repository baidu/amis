/**
 * 组件名称：Carousel 轮播图
 * 单测内容：
 * 1. 基础使用
 * 2. auto & interval & duration
 * 3. name & option config
 * 4. controls & controlsTheme & thumbMode
 * 5. itemSchema & width & height
 */

import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv, wait} from '../helper';

test('Renderer:Carousel', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'carousel',
        controlsTheme: 'light',
        width: '500',
        height: '300',
        options: [
          {
            image:
              'https://internal-amis-res.cdn.bcebos.com/images/2019-12/1577157239810/da6376bf988c.png',
            title: '标题',
            titleClassName: 'block',
            description: '描述',
            descriptionClassName: 'block'
          },
          {
            html: '<div style="width: 100%; height: 300px; background: #e3e3e3; text-align: center; line-height: 300px;">carousel data</div>'
          },
          {
            image:
              'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg'
          }
        ],
        className: 'show'
      },
      {},
      makeEnv({})
    )
  );

  const image = container.querySelector('div.cxd-Carousel-item');
  fireEvent.mouseEnter(image as HTMLDivElement);
  const leftArrow = container.querySelector('div.cxd-Carousel-leftArrow');
  fireEvent.click(leftArrow as HTMLDivElement);
  const rightArrow = container.querySelector('div.cxd-Carousel-rightArrow');
  fireEvent.click(rightArrow as HTMLDivElement);

  // 等到第二个点变成激活状态
  await waitFor(() => {
    expect(
      container.querySelector('span:nth-child(2).is-active')
    ).toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();
});

test('Renderer:Carousel with auto & interval & duration', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'carousel',
        controlsTheme: 'light',
        width: '500',
        height: '300',
        auto: true,
        interval: 2000,
        duration: 500,
        options: [
          {
            image:
              'https://internal-amis-res.cdn.bcebos.com/images/2019-12/1577157239810/da6376bf988c.png',
            title: '标题',
            titleClassName: 'block',
            description: '描述',
            descriptionClassName: 'block'
          },
          {
            html: '<div style="width: 100%; height: 300px; background: #e3e3e3; text-align: center; line-height: 300px;">carousel data</div>'
          },
          {
            image:
              'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg'
          }
        ],
        className: 'show'
      },
      {},
      makeEnv({})
    )
  );

  await wait(2500);

  expect(container.querySelector('.cxd-Carousel-dot:nth-child(2)')).toHaveClass(
    'is-active'
  );
});

test('Renderer:Carousel with name & option config', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        data: {
          imageList: [
            {
              image:
                'https://internal-amis-res.cdn.bcebos.com/images/2019-12/1577157239810/da6376bf988c.png',
              imageClassName: 'thisisimageClassName',
              title: '这是标题',
              titleClassName: 'thiisistitleClassName',
              description: '描述', // description 属性没用
              href: 'https://www.baidu.com'
            },
            {
              html: '<div style="width: 100%; height: 300px; background: #e3e3e3; text-align: center; line-height: 300px;">carousel data</div>'
            }
          ]
        },
        body: [
          {
            type: 'carousel',
            auto: false,
            name: 'imageList'
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  const item = container.querySelector('.cxd-Carousel-item')!;

  expect(item.firstElementChild).toHaveAttribute(
    'href',
    'https://www.baidu.com'
  );
  expect(item).toHaveTextContent('这是标题');

  fireEvent.click(container.querySelector('.cxd-Carousel-dot:nth-child(2)')!);

  await waitFor(() => {
    expect(container.querySelector('.cxd-Carousel-item')!).toHaveTextContent(
      'carousel data'
    );
  });
});

test('Renderer:Carousel with controls & controlsTheme & thumbMode', async () => {
  const {container, rerender} = render(
    amisRender(
      {
        type: 'carousel',
        controlsTheme: 'light',
        thumbMode: 'contain',
        controls: ['dots', 'arrows'],
        options: [
          {
            image:
              'https://internal-amis-res.cdn.bcebos.com/images/2019-12/1577157239810/da6376bf988c.png'
          },
          {
            html: '<div style="width: 100%; height: 300px; background: #e3e3e3; text-align: center; line-height: 300px;">carousel data</div>'
          },
          {
            image:
              'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg'
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  expect(container.querySelector('.cxd-Carousel')).toHaveClass(
    'cxd-Carousel--light'
  );
  expect(
    container.querySelector('.cxd-Image-origin.cxd-Image-origin--contain')
  ).toBeInTheDocument();
  expect(
    container.querySelector('.cxd-Carousel-dotsControl')
  ).toBeInTheDocument();
  expect(
    container.querySelector('.cxd-Carousel-leftArrow')
  ).toBeInTheDocument();

  rerender(
    amisRender(
      {
        type: 'carousel',
        controlsTheme: 'dark',
        thumbMode: 'cover',
        controls: [],
        options: [
          {
            image:
              'https://internal-amis-res.cdn.bcebos.com/images/2019-12/1577157239810/da6376bf988c.png'
          },
          {
            html: '<div style="width: 100%; height: 300px; background: #e3e3e3; text-align: center; line-height: 300px;">carousel data</div>'
          },
          {
            image:
              'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg'
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();

  expect(container.querySelector('.cxd-Carousel')).toHaveClass(
    'cxd-Carousel--dark'
  );
  expect(
    container.querySelector('.cxd-Image-origin.cxd-Image-origin--cover')
  ).toBeInTheDocument();
  expect(
    container.querySelector('.cxd-Carousel-dotsControl')
  ).not.toBeInTheDocument();
  expect(
    container.querySelector('.cxd-Carousel-leftArrow')
  ).not.toBeInTheDocument();
});

test('Renderer:Carousel with itemSchema & width & height', async () => {
  const {container, rerender} = render(
    amisRender(
      {
        type: 'carousel',
        options: [
          {
            image:
              'https://internal-amis-res.cdn.bcebos.com/images/2019-12/1577157239810/da6376bf988c.png'
          }
        ],
        itemSchema: {
          type: 'tpl',
          tpl: '<div class="itemSchemaClassName" style="background-image: url(\'<%= data.image %>\');"></div>'
        },
        width: 101,
        height: 99
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
  expect(container.querySelector('.cxd-Carousel')).toHaveStyle({
    width: '101px',
    height: '99px'
  });
  expect(container.querySelector('.itemSchemaClassName')).toBeInTheDocument();
});
