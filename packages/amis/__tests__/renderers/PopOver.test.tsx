import React from 'react';
import {render, fireEvent, cleanup, waitFor} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {wait, makeEnv} from '../helper';
import {clearStoresCache} from '../../src';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

function formatStyleObject(style: string | null, px2number = true) {
  if (!style) {
    return {};
  }

  // 去除注释 /* xx */
  style = style.replace(/\/\*[^(\*\/)]*\*\//g, '');

  const res: any = {};
  style.split(';').forEach((item: string) => {
    if (!item || !String(item).includes(':')) return;

    const [key, value] = item.split(':');

    res[String(key).trim()] =
      px2number && value.endsWith('px')
        ? Number(String(value).replace(/px$/, ''))
        : String(value).trim();
  });

  return res;
}

test('Renderer:PopOver with offset', async () => {
  const schema = {
    name: 'static',
    type: 'static',
    label: '静态展示',
    value: 'static',
    popOver: {
      body: '我是提示内容'
    }
  };
  const {container, rerender} = render(amisRender(schema));

  expect(container).toMatchSnapshot('default');

  fireEvent.click(container.querySelector('.cxd-Field-popOverBtn')!);
  await wait(200);

  expect(container.querySelector('.cxd-PopOver')).toBeInTheDocument();
  const noOffsetStyle = formatStyleObject(
    container.querySelector('.cxd-PopOver')!.getAttribute('style')
  );

  expect(container).toMatchSnapshot('show popover no offset');

  rerender(
    amisRender({
      ...schema,
      popOver: {
        ...schema.popOver,
        offset: {
          left: 101,
          top: 102
        }
      }
    })
  );
  await wait(300);
  expect(container).toMatchSnapshot('show popover with offset');

  const offsetStyle = formatStyleObject(
    container.querySelector('.cxd-PopOver')!.getAttribute('style')
  );

  expect(offsetStyle.left - noOffsetStyle.left).toEqual(101);
  expect(offsetStyle.top - noOffsetStyle.top).toEqual(102);
});
