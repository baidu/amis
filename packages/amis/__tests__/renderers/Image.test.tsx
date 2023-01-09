/**
 * 组件名称：Image 图片
 * 单测内容：
 * 1. 基础使用
 * 2. name 上下文获取
 * 3. title & imageCaption
 * 4. thumbMode
 * 5. thumbRatio
 * 6. enlargeAble & originalSrc & enlargeTitle & showToolbar
 * 7. width & height
 * 8. imageMode
 * 9. href
 * 10. 作为表单项
 * 11. clickAction
 *
 *  * 组件名称：Images 图片集
 * 内容说明：images 与 image 使用组件相同，相同属性不重复测试了
 * 单测内容：
 * 1. 基础使用
 * 2. enlargeAble & originalSrc & source & title & description
 */

import {fireEvent, render} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv, wait} from '../helper';

describe('Renderer:image', () => {
  test('image:basic', async () => {
    const {container} = render(
      amisRender(
        {
          type: 'image',
          defaultImage: 'https://www.baidu.com/img/bd_logo1.png',
          title: '图片',
          description: '图片描述',
          imageClassName: 'b',
          className: 'show'
        },
        {},
        makeEnv({})
      )
    );

    expect(container).toMatchSnapshot();
  });

  test('image:name', async () => {
    const imageUrl =
      'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80';

    const {container} = render(
      amisRender({
        type: 'page',
        data: {
          imageUrl: imageUrl
        },
        body: {
          type: 'image',
          name: 'imageUrl'
        }
      })
    );

    expect(container.querySelector('.cxd-Image-image')!).toBeInTheDocument();
    expect(container.querySelector('.cxd-Image-image')!).toHaveAttribute(
      'src',
      imageUrl
    );
  });

  test('image:title & imageCaption', async () => {
    const {container} = render(
      amisRender({
        type: 'image',
        src: 'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80',
        title: '这是标题',
        imageCaption: '这是一段说明'
      })
    );

    expect(container).toMatchSnapshot();
    expect(container.querySelector('.cxd-Image-title')!).toHaveTextContent(
      '这是标题'
    );
    expect(container.querySelector('.cxd-Image-caption')!).toHaveTextContent(
      '这是一段说明'
    );
  });

  test('image:thumbMode', async () => {
    const baseSchema = {
      type: 'image',
      src: 'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80'
    };

    const {container, rerender} = render(
      amisRender({
        ...baseSchema,
        thumbMode: 'w-full'
      })
    );

    expect(
      container.querySelector('.cxd-Image-thumbWrap .cxd-Image-thumb')!
    ).toHaveClass('cxd-Image-thumb--w-full');

    rerender(
      amisRender({
        ...baseSchema,
        thumbMode: 'h-full'
      })
    );
    expect(
      container.querySelector('.cxd-Image-thumbWrap .cxd-Image-thumb')!
    ).toHaveClass('cxd-Image-thumb--h-full');

    rerender(
      amisRender({
        ...baseSchema,
        thumbMode: 'contain'
      })
    );
    expect(
      container.querySelector('.cxd-Image-thumbWrap .cxd-Image-thumb')!
    ).toHaveClass('cxd-Image-thumb--contain');

    rerender(
      amisRender({
        ...baseSchema,
        thumbMode: 'cover'
      })
    );
    expect(
      container.querySelector('.cxd-Image-thumbWrap .cxd-Image-thumb')!
    ).toHaveClass('cxd-Image-thumb--cover');
  });

  test('image:thumbRatio', async () => {
    const baseSchema = {
      type: 'image',
      src: 'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80',
      thumbMode: 'cover'
    };

    const {container, rerender} = render(
      amisRender({
        ...baseSchema,
        thumbRatio: '1:1'
      })
    );

    expect(
      container.querySelector('.cxd-Image-thumbWrap .cxd-Image-thumb')!
    ).toHaveClass('cxd-Image-thumb--1-1');

    rerender(
      amisRender({
        ...baseSchema,
        thumbRatio: '4:3'
      })
    );
    expect(
      container.querySelector('.cxd-Image-thumbWrap .cxd-Image-thumb')!
    ).toHaveClass('cxd-Image-thumb--4-3');

    rerender(
      amisRender({
        ...baseSchema,
        thumbRatio: '16:9'
      })
    );
    expect(
      container.querySelector('.cxd-Image-thumbWrap .cxd-Image-thumb')!
    ).toHaveClass('cxd-Image-thumb--16-9');
  });

  test('image:enlargeAble & originalSrc & enlargeTitle & showToolbar', async () => {
    const {container, getByText, baseElement} = render(
      amisRender({
        type: 'image',
        src: 'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80',
        originalSrc:
          'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg',
        enlargeAble: true,
        enlargeTitle: '这是一个标题',
        enlargeCaption: '这是一段描述',
        showToolbar: true
      })
    );

    fireEvent.mouseEnter(container.querySelector('.cxd-Image-thumbWrap')!);
    expect(container).toMatchSnapshot();
    expect(
      container.querySelector('.cxd-Image-overlay a icon-mock')!
    ).toBeInTheDocument();

    fireEvent.click(container.querySelector('.cxd-Image-overlay a icon-mock')!);

    expect(container).toMatchSnapshot('Gallery');
    expect(baseElement.querySelector('.cxd-ImageGallery')!).toBeInTheDocument();
    expect(getByText('这是一个标题')).toBeInTheDocument();
    expect(
      baseElement.querySelector('.cxd-ImageGallery .cxd-ImageGallery-main img')!
    ).toHaveAttribute(
      'src',
      'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg'
    );

    const actions = baseElement.querySelectorAll(
      '.cxd-ImageGallery-toolbar .cxd-ImageGallery-toolbar-action'
    );

    expect(actions!.length).toBe(5);

    const imgIns = baseElement.querySelector('.cxd-ImageGallery-main img')!;

    expect(imgIns).toHaveStyle({
      transform: 'scale(1) rotate(0deg)'
    });

    fireEvent.click(actions[1].firstElementChild!);
    expect(imgIns).toHaveStyle({
      transform: 'scale(1) rotate(90deg)'
    });
  });

  test('image:width & height', async () => {
    const {container, getByText, baseElement} = render(
      amisRender({
        type: 'image',
        width: '200px',
        height: '200px',
        src: 'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_400,l_1,f_jpg,q_80'
      })
    );

    expect(container).toMatchSnapshot();

    expect(
      container.querySelector('.cxd-Image-thumbWrap .cxd-Image-thumb')!
    ).toHaveStyle({
      width: '200px',
      height: '200px'
    });
  });

  test('image:imageMode', async () => {
    const {container} = render(
      amisRender({
        type: 'page',
        data: {
          imageUrl:
            'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg'
        },
        body: {
          type: 'image',
          imageMode: 'original',
          name: 'imageUrl',
          title: '这是标题',
          imageCaption: '这是一段说明'
        }
      })
    );

    expect(
      container.querySelector('.cxd-Image.cxd-Image--original')!
    ).toBeInTheDocument();
  });

  test('image:href', async () => {
    const {container} = render(
      amisRender({
        type: 'page',
        data: {
          imageUrl:
            'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg',
          imageHref: 'https://github.com/baidu/amis'
        },
        body: {
          type: 'image',
          name: 'imageUrl',
          href: '${imageHref}'
        }
      })
    );

    expect(container.querySelector('.cxd-ImageField a')!).toHaveAttribute(
      'href',
      'https://github.com/baidu/amis'
    );
    expect(container).toMatchSnapshot();
  });

  test('image as form item', async () => {
    const {container} = render(
      amisRender({
        type: 'form',
        data: {
          image:
            'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80'
        },
        body: [
          {
            type: 'static-image',
            name: 'image',
            label: '颜色',
            innerClassName: 'no-border'
          }
        ]
      })
    );

    expect(container.querySelector('.cxd-Image-image')!).toHaveAttribute(
      'src',
      'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80'
    );
    expect(container).toMatchSnapshot();
  });

  test('image:clickAction', async () => {
    const {container, getByText} = render(
      amisRender({
        type: 'image',
        src: 'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80',
        class: 'cursor-pointer',
        clickAction: {
          actionType: 'dialog',
          dialog: {
            title: '弹框标题',
            body: '这是一个弹框'
          }
        }
      })
    );
    fireEvent.click(container.querySelector('.cxd-Image-thumbWrap')!);
    expect(getByText('这是一个弹框')!).toBeInTheDocument();
  });
});

describe('Renderer:images', () => {
  test('images:basic', async () => {
    const {container} = render(
      amisRender(
        {
          type: 'page',
          data: {
            imageList: [
              'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80',
              'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692942/d8e4992057f9.jpeg@s_0,w_216,l_1,f_jpg,q_80',
              'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693148/1314a2a3d3f6.jpeg@s_0,w_216,l_1,f_jpg,q_80',
              'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80',
              'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693566/552b175ef11d.jpeg@s_0,w_216,l_1,f_jpg,q_80'
            ]
          },
          body: [
            {
              type: 'images',
              source: '${imageList}'
            },
            {
              type: 'divider'
            },
            {
              type: 'images',
              name: 'imageList'
            }
          ]
        },
        {},
        makeEnv({})
      )
    );

    expect(container).toMatchSnapshot();
  });

  test('images:enlargeAble & originalSrc & source & title & description', async () => {
    const {container, baseElement} = render(
      amisRender({
        type: 'page',
        data: {
          images: [
            {
              image:
                'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80',
              src: 'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg',
              title: '图片1',
              description: '图片1的描述'
            },
            {
              image:
                'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692942/d8e4992057f9.jpeg@s_0,w_216,l_1,f_jpg,q_80',
              src: 'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692942/d8e4992057f9.jpeg',
              title: '图片2',
              description: '图片2的描述'
            },
            {
              image:
                'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693148/1314a2a3d3f6.jpeg@s_0,w_216,l_1,f_jpg,q_80',
              src: 'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693148/1314a2a3d3f6.jpeg',
              title: '图片3',
              description: '图片3的描述'
            }
          ]
        },
        body: {
          type: 'images',
          source: '${images}',
          originalSrc: '${source}',
          enlargeAble: true
        }
      })
    );

    expect(container).toMatchSnapshot();
    expect(
      container.querySelectorAll('.cxd-Images .cxd-Images-item')!.length
    ).toBe(3);

    fireEvent.mouseEnter(
      container.querySelector(
        '.cxd-Images .cxd-Images-item .cxd-Image-thumbWrap'
      )!
    );

    fireEvent.click(container.querySelector('.cxd-Image-overlay a icon-mock')!);

    expect(
      baseElement.querySelectorAll(
        '.cxd-ImageGallery-footer .cxd-ImageGallery-itemsWrap .cxd-ImageGallery-item'
      )!.length
    ).toBe(3);
  });
});
