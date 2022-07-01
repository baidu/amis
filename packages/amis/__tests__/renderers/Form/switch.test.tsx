import {render, cleanup} from '@testing-library/react';
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
              optionAtLeft: false
            }
          ],
          submitText: null,
          actions: []
        },
        {},
        makeEnv()
      )
    );
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
