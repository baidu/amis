import {
  render,
  screen,
  cleanup,
  waitFor,
  fireEvent
} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';
import {clearStoresCache} from '../../../src';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

const setupInputTag = async (inputTagOptions: any = {}) => {
  const renderResult = render(
    amisRender(
      {
        type: 'form',
        wrapWithPanel: false,
        body: [
          {
            type: 'input-tag',
            name: 'tag',
            label: '标签',
            ...inputTagOptions
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  await waitFor(() => {
    expect(
      renderResult.container.querySelector('input[name="tag"]')
    ).toBeInTheDocument();
  });

  const input = renderResult.container.querySelector(
    'input[name="tag"]'
  ) as HTMLInputElement;

  return {
    ...renderResult,
    input
  };
};

describe('Renderer:InputTag', () => {
  test('InputTag with options', async () => {
    const {container, input} = await setupInputTag({
      options: ['Apple', 'Orange', 'Banana']
    });

    fireEvent.focus(input);
    await wait(500);

    const option = screen.getByText('Apple');
    expect(option).toBeVisible();
    expect(container).toMatchSnapshot();
  });

  test('InputTag input with single tag', async () => {
    const {container, input} = await setupInputTag();

    fireEvent.focus(input);
    await wait(500);

    fireEvent.change(input, {target: {value: 'Honey-dew melon'}});
    await wait(500);

    fireEvent.keyDown(input, {key: 'Enter', code: 13});
    await wait(500);

    const option = screen.getByText('Honey-dew melon');
    expect(option).toHaveClass('cxd-ResultBox-valueLabel');
    expect(container).toMatchSnapshot();
  });

  test('InputTag input with batch tag', async () => {
    const {container, input} = await setupInputTag({enableBatchAdd: true});

    fireEvent.focus(input);
    await wait(500);

    fireEvent.change(input, {target: {value: 'Apple-Orange-Banana'}});
    await wait(500);

    fireEvent.keyDown(input, {key: 'Enter', code: 13});
    await wait(500);

    const Apple = screen.getByText('Apple');
    expect(Apple).toHaveClass('cxd-ResultBox-valueLabel');
    const Orange = screen.getByText('Orange');
    expect(Orange).toHaveClass('cxd-ResultBox-valueLabel');
    const Banana = screen.getByText('Banana');
    expect(Banana).toHaveClass('cxd-ResultBox-valueLabel');

    expect(container).toMatchSnapshot();
  });

  test('InputTag input with batch tag and separator "|"', async () => {
    const {container, input} = await setupInputTag({
      enableBatchAdd: true,
      separator: '|'
    });

    fireEvent.focus(input);
    await wait(500);

    fireEvent.change(input, {target: {value: 'Apple|Orange|Banana'}});
    await wait(500);

    fireEvent.keyDown(input, {key: 'Enter', code: 13});
    await wait(500);

    const Apple = screen.getByText('Apple');
    expect(Apple).toHaveClass('cxd-ResultBox-valueLabel');
    const Orange = screen.getByText('Orange');
    expect(Orange).toHaveClass('cxd-ResultBox-valueLabel');
    const Banana = screen.getByText('Banana');
    expect(Banana).toHaveClass('cxd-ResultBox-valueLabel');

    expect(container).toMatchSnapshot();
  });

  test('InputTag input with max quantity 2', async () => {
    const {container, input, queryByText} = await setupInputTag({max: 2});

    fireEvent.focus(input);
    await wait(500);
    fireEvent.change(input, {target: {value: 'Apple'}});
    await wait(500);
    fireEvent.keyDown(input, {key: 'Enter', code: 13});
    await wait(500);
    const Apple = screen.getByText('Apple');
    expect(Apple).toBeVisible();

    fireEvent.focus(input);
    await wait(500);
    fireEvent.change(input, {target: {value: 'Orange'}});
    await wait(500);
    fireEvent.keyDown(input, {key: 'Enter', code: 13});
    await wait(500);
    const Orange = screen.getByText('Orange');
    expect(Orange).toBeVisible();

    fireEvent.focus(input);
    await wait(500);
    fireEvent.change(input, {target: {value: 'Banana'}});
    await wait(500);
    fireEvent.keyDown(input, {key: 'Enter', code: 13});
    await wait(500);
    const Banana = queryByText('Banana');
    expect(Banana).toBeNull();

    expect(container).toMatchSnapshot();
  }, 6000);

  test('InputTag input with maxTagLength 5', async () => {
    const {container, input, queryByText} = await setupInputTag({
      maxTagLength: 5
    });

    fireEvent.focus(input);
    await wait(500);
    fireEvent.change(input, {target: {value: 'Apple'}});
    await wait(500);
    fireEvent.keyDown(input, {key: 'Enter', code: 13});
    await wait(500);
    const Apple = screen.getByText('Apple');
    expect(Apple).toBeVisible();

    fireEvent.focus(input);
    await wait(500);
    fireEvent.change(input, {target: {value: 'Banana'}});
    await wait(500);
    fireEvent.keyDown(input, {key: 'Enter', code: 13});
    await wait(500);
    const Banana = queryByText('Banana');
    expect(Banana).toBeNull();

    expect(container).toMatchSnapshot();
  });
});
