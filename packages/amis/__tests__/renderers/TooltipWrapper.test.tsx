/**
 * 组件名称：TooltipWrapper 文字提示容器
 *
 * 单测内容：
 * 1. trigger & title
 * 2. placement
 * 3. offset
 * 4. showArrow
 * 5. tooltipTheme
 * 6. mouseEnterDelay & mouseLeaveDelay
 * 7. 上下文获取
 * 8. inline
 * 9. style & tooltipStyle
 * 10. wrapperComponent
 */

import {
  render,
  cleanup,
  fireEvent,
  waitFor,
  screen
} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv, wait, formatStyleObject} from '../helper';
import {clearStoresCache} from '../../src';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

test('Renderer:TooltipWrapper with trigger & title', async () => {
  const {container, getByText} = render(
    amisRender({
      type: 'page',
      body: [
        {
          type: 'tooltip-wrapper',
          content: 'hover提示文字',
          body: 'hover激活文字提示',
          className: 'mb-1'
        },
        {
          type: 'tooltip-wrapper',
          title: 'click标题',
          content: 'click提示文字',
          trigger: 'click',
          body: 'click激活文字提示',
          className: 'mb-1'
        }
      ]
    })
  );

  expect(container).toMatchSnapshot();

  fireEvent.mouseEnter(getByText('hover激活文字提示'));
  await wait(500);
  expect(getByText('hover提示文字')!).toBeInTheDocument();

  fireEvent.click(getByText('click激活文字提示'));
  await wait(500);
  expect(getByText('click标题')!).toBeInTheDocument();
  expect(getByText('click提示文字')!).toBeInTheDocument();
});

// test('Renderer:TooltipWrapper with placement', async () => {
//   const schema = {
//     type: 'tooltip-wrapper',
//     content: '提示文字',
//     body: '激活文字提示'
//   };

//   const {container, getByText, rerender, baseElement} = render(
//     amisRender({
//       ...schema,
//       placement: 'top'
//     })
//   );

//   fireEvent.mouseEnter(getByText('激活文字提示'));
//   await wait(500);
//   // expect(baseElement.querySelector('.cxd-Tooltip')!).toHaveClass(
//   //   'cxd-Tooltip--top'
//   // );

//   rerender(
//     amisRender({
//       ...schema,
//       placement: 'right'
//     })
//   );
//   await wait(500);
//   // expect(baseElement.querySelector('.cxd-Tooltip')!).toHaveClass(
//   //   'cxd-Tooltip--right'
//   // );

//   rerender(
//     amisRender({
//       ...schema,
//       placement: 'left'
//     })
//   );
//   await wait(500);
//   // expect(baseElement.querySelector('.cxd-Tooltip')!).toHaveClass(
//   //   'cxd-Tooltip--left'
//   // );

//   rerender(
//     amisRender({
//       ...schema,
//       placement: 'bottom'
//     })
//   );
//   await wait(500);
//   // )expect(baseElement.querySelector('.cxd-Tooltip')!).toHaveClass(
//   // )  'cxd-Tooltip--bottom'
//   // ));

//   expect(baseElement).toMatchSnapshot();
// });

test('Renderer:TooltipWrapper with offset', async () => {
  const {container, baseElement, rerender, getByText} = render(
    amisRender({
      type: 'page',
      body: [
        {
          type: 'tooltip-wrapper',
          content: '提示文字',
          body: '激活文字提示',
          className: 'mb-1',
          offset: [19, -22]
        }
      ]
    })
  );

  fireEvent.mouseEnter(getByText('激活文字提示'));
  await wait(500);

  expect(baseElement.querySelector('.cxd-Tooltip')!).toHaveAttribute(
    'offset',
    '19,-22'
  );
  // 无法计算偏移量offset
  expect(baseElement).toMatchSnapshot();
});

test('Renderer:TooltipWrapper with showArrow', async () => {
  const {container, baseElement, rerender, getByText} = render(
    amisRender({
      type: 'tooltip-wrapper',
      title: '标题',
      content: '提示内容',
      // showArrow: false,
      body: '有箭头'
    })
  );

  fireEvent.mouseEnter(getByText('有箭头'));
  await wait(500);

  expect(
    baseElement.querySelector('.cxd-Tooltip .cxd-Tooltip-arrow')!
  ).toBeInTheDocument();

  rerender(
    amisRender({
      type: 'tooltip-wrapper',
      title: '标题',
      content: '提示内容',
      showArrow: false,
      body: '没有箭头'
    })
  );
  await wait(500);

  expect(baseElement).toMatchSnapshot();
  expect(
    baseElement.querySelector('.cxd-Tooltip .cxd-Tooltip-arrow')!
  ).toBeNull();
});

test('Renderer:TooltipWrapper with tooltipTheme', async () => {
  const {container, baseElement, rerender, getByText} = render(
    amisRender({
      type: 'tooltip-wrapper',
      title: '标题',
      content: '文案提示',
      inline: true,
      tooltipTheme: 'dark',
      body: 'dark主题提示'
    })
  );

  fireEvent.mouseEnter(getByText('dark主题提示'));
  await wait(500);

  expect(baseElement.querySelector('.cxd-Tooltip')!).toHaveClass(
    'cxd-Tooltip--dark'
  );
});

test('Renderer:TooltipWrapper with mouseEnterDelay & mouseLeaveDelay', async () => {
  const {container, baseElement, rerender, getByText} = render(
    amisRender({
      type: 'tooltip-wrapper',
      title: '标题',
      content: '提示内容',
      mouseEnterDelay: 300,
      mouseLeaveDelay: 600,
      inline: true,
      body: '延迟'
    })
  );

  fireEvent.mouseEnter(getByText('延迟'));
  await wait(100);
  expect(baseElement.querySelector('.cxd-Tooltip')!).toBeNull();
  await wait(250);
  expect(baseElement.querySelector('.cxd-Tooltip')!).not.toBeNull();

  fireEvent.mouseLeave(getByText('延迟'));
  await wait(400);
  expect(baseElement.querySelector('.cxd-Tooltip')!).not.toBeNull();
  await wait(250);
  expect(baseElement.querySelector('.cxd-Tooltip')!).toBeNull();
});

test('Renderer:TooltipWrapper with context data', async () => {
  const {container, baseElement, rerender, getByText} = render(
    amisRender({
      type: 'page',
      data: {
        text: 'this-is-text',
        text2: 'second-text'
      },
      body: {
        type: 'tooltip-wrapper',
        content: 'info:${text}',
        body: 'body:${text}',
        title: 'title:${text2}'
      }
    })
  );

  expect(getByText('body:this-is-text')).toBeInTheDocument();
  fireEvent.mouseEnter(getByText('body:this-is-text'));

  await wait(500);
  expect(baseElement.querySelector('.cxd-Tooltip-title')!).toHaveTextContent(
    'title:second-text'
  );
  expect(baseElement.querySelector('.cxd-Tooltip-body')!).toHaveTextContent(
    'info:this-is-text'
  );
  expect(baseElement).toMatchSnapshot();
});

test('Renderer:TooltipWrapper with inline', async () => {
  const {container} = render(
    amisRender({
      type: 'tooltip-wrapper',
      content: '文字提示',
      inline: true,
      body: '内联容器'
    })
  );

  expect(container.querySelector('.cxd-TooltipWrapper')).toHaveClass(
    'cxd-TooltipWrapper--inline'
  );
});

test('Renderer:TooltipWrapper with style & tooltipStyle', async () => {
  const {container, baseElement, getByText} = render(
    amisRender({
      type: 'tooltip-wrapper',
      content: '文字提示(加粗)',
      inline: true,
      style: {
        fontStyle: 'italic'
      },
      tooltipStyle: {
        fontWeight: 'bold'
      },
      body: '一段文案'
    })
  );

  expect(container.querySelector('.cxd-TooltipWrapper')).toHaveStyle({
    'font-style': 'italic'
  });

  fireEvent.mouseEnter(getByText('一段文案'));

  await wait(500);
  expect(baseElement.querySelector('.cxd-Tooltip')).toHaveStyle({
    'font-weight': 'bold'
  });
  expect(baseElement).toMatchSnapshot();
});

test('Renderer:TooltipWrapper with wrapperComponent', async () => {
  const {container, baseElement, getByText} = render(
    amisRender({
      type: 'tooltip-wrapper',
      content: '文字提示',
      wrapperComponent: 'pre',
      body: "function HelloWorld() {\n    console.log('Hello World');\n}"
    })
  );
  expect(container.querySelector('pre.cxd-TooltipWrapper')).toBeInTheDocument();
  expect(container).toHaveTextContent(
    `function HelloWorld() { console.log('Hello World'); }`
  );
  expect(baseElement).toMatchSnapshot();
});
