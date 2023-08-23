/**
 * 组件名称：transfer-picker
 *
 */

import {fireEvent, render, waitFor} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';

test('Renderer:transfer-picker', async () => {
  const onSubmit = jest.fn();
  const {container, findByText} = render(
    amisRender(
      {
        "type": "page",
        "body": {
          "type": "form",
          "api": "/api/mock2/form/saveForm",
          "body": [
            {
              "label": "组合穿梭器",
              "type": "transfer-picker",
              "name": "a",
              "sortable": true,
              "selectMode": "tree",
              "searchable": true,
              "options": [
                {
                  "label": "法师",
                  "children": [
                    {
                      "label": "诸葛亮",
                      "value": "zhugeliang"
                    }
                  ]
                },
                {
                  "label": "战士",
                  "children": [
                    {
                      "label": "曹操",
                      "value": "caocao"
                    },
                    {
                      "label": "钟无艳",
                      "value": "zhongwuyan"
                    }
                  ]
                },
                {
                  "label": "打野",
                  "children": [
                    {
                      "label": "李白",
                      "value": "libai"
                    },
                    {
                      "label": "韩信",
                      "value": "hanxin"
                    },
                    {
                      "label": "云中君",
                      "value": "yunzhongjun"
                    }
                  ]
                }
              ]
            }
          ]
        }
      },
      {onSubmit},
      makeEnv({})
    )
  );

  const dom = container.querySelector('.cxd-ResultBox')!;
  expect(dom).not.toBeNull();

  fireEvent.click(dom);

  await wait(3000);

  const zhugeliang = await findByText('诸葛亮');
  expect(zhugeliang).not.toBeNull();
  fireEvent.click(zhugeliang);
  const yunzhongjun = await findByText('云中君');
  fireEvent.click(yunzhongjun);

  await wait(500);
  expect(container).toMatchSnapshot();

  const ok = await findByText('确认');
  fireEvent.click(ok);

  await wait(2000);

  const summit = await findByText('提交');
  fireEvent.click(summit);

  await wait(500);
  expect(onSubmit).toBeCalled();
  expect(onSubmit.mock.calls[0][0]).toEqual({
    a: 'zhugeliang,yunzhongjun'
  });

}, 10000);
 
 