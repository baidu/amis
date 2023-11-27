import {render, cleanup, waitFor} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv} from '../../helper';
import {clearStoresCache} from '../../../src';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

describe('Renderer:Switch', () => {
  test('Switch basic props', async () => {
    const {container} = render(
      amisRender(
        {
          type: 'form',
          body: [
            {
              name: 'switch',
              className: 'block',
              label: '开关',
              type: 'switch',
              value: true,
              trueValue: true,
              falseValue: false,
              disabled: false,
              option: 'switch',
              optionAtLeft: false,
              onText: "已开启飞行模式",
              offText: "已关闭飞行模式"
            }
          ],
          submitText: null,
          actions: []
        },
        {},
        makeEnv()
      )
    );

    expect(
      (container.querySelector('.cxd-SwitchControl .cxd-Switch .text') as Element).innerHTML
    ).toBe('已开启飞行模式');

    expect(container).toMatchSnapshot();
  });

  test('Switch size', async () => {
    const {container} = render(
      amisRender(
        {
          type: 'form',
          body: [
            {
              name: 'switch',
              label: '开关',
              type: 'switch',
              size: 'sm'
            }
          ]
        },
        {},
        makeEnv()
      )
    );

    const SwitchDom = container.querySelector('.cxd-Switch--sm');

    expect(SwitchDom).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
});

/**
 * 默认状态为开启时
 * 默认状态为关闭时
 * 默认状态为禁用时
 */
test('Renderer:Switch with loading status', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        body: [
          {
            "type": "switch",
            "name": "switch1",
            "label": "",
            "loading": true,
            "value": true
          },
          {
            "type": "switch",
            "name": "switch2",
            "label": "",
            "disabled": true,
            "loading": true,
            "value": false
          }
        ],
        actions: []
      },
      {},
      makeEnv()
    )
  );

  const loadingDom = container.querySelectorAll('.cxd-Switch-spinner');

  expect(loadingDom?.length).toEqual(2);
});

test('Renderer:Switch onText & offText schema', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        body: [
          {
            "name": "switch",
            "type": "switch",
            "onText": [
              {
                "type": "icon",
                "icon": "fa fa-plane",
                "vendor": "",
                "className": "mr-1"
              },
              {
                "type": "tpl",
                "tpl": "飞行模式"
              }
            ],
            "offText": [
              {
                "type": "icon",
                "icon": "fa fa-plane",
                "vendor": "",
                "className": "mr-1"
              },
              {
                "type": "tpl",
                "tpl": "飞行模式"
              }
            ]
          }
        ],
        actions: []
      },
      {},
      makeEnv()
    )
  );

  const text = container.querySelector('.cxd-Switch > span.text')!;

  /** offText的Schema包含了2个元素 */
  expect(text?.childNodes?.length).toEqual(2);
});
