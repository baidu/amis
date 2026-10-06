import React from 'react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  waitFor,
  within
} from '@testing-library/react';
import CityArea, {AreaProps} from 'amis-ui/lib/components/CityArea';

// Keep the real database, picker columns and popup in these regressions.
afterEach(cleanup);

async function setup(
  value: AreaProps['value'],
  props: Partial<AreaProps> = {}
) {
  const onChange = jest.fn();
  const onCancel = jest.fn();

  function Controlled() {
    const [currentValue, setValue] = React.useState(value);
    return (
      <CityArea
        {...props}
        value={currentValue}
        onChange={(nextValue: AreaProps['value']) => {
          onChange(nextValue);
          setValue(nextValue);
        }}
        onCancel={onCancel}
      />
    );
  }

  const {container} = render(<Controlled />);
  const result = () => container.querySelector('.cxd-CityArea-Input')!;
  const columns = () =>
    document.querySelectorAll<HTMLElement>('.cxd-PickerColumns-columnWrapper');
  const open = async () => {
    fireEvent.click(result());
    await waitFor(() => expect(columns().length).toBeGreaterThan(0));
  };
  const click = async (element: Element) => {
    await act(async () => {
      fireEvent.click(element);
      await new Promise(requestAnimationFrame);
    });
  };
  const select = async (column: number, text: string) => {
    await click(within(columns()[column]).getByText(text));
  };
  const confirm = async () => {
    await click(document.querySelector('.cxd-PopUp-confirm')!);
    await waitFor(() => expect(columns()).toHaveLength(0));
  };

  await waitFor(() => expect(result().textContent).not.toBe(''));
  return {result, columns, open, click, select, confirm, onChange, onCancel};
}

test.each<[number | string, string]>([
  [500229, '重庆市,城口县'],
  ['500229', '重庆市,城口县'],
  [500230, '重庆市,丰都县'],
  ['500230', '重庆市,丰都县'],
  [429004, '湖北省,仙桃市'],
  ['429004', '湖北省,仙桃市']
])(
  'CityArea restores direct county %p without a district column value',
  async (value, label) => {
    const {result, columns, open, confirm, onChange} = await setup(value);
    await waitFor(() => expect(result()).toHaveTextContent(label));
    expect(result().textContent).toBe(label);
    expect(onChange).not.toHaveBeenCalled();
    await open();
    expect(columns()).toHaveLength(3);
    expect(columns()[2].children).toHaveLength(0);
    await confirm();
    expect(onChange).toHaveBeenLastCalledWith(String(value));
    expect(result().textContent).toBe(label);
    await open();
    expect(columns()[2].children).toHaveLength(0);
  }
);

test.each<[number, string]>([
  [110101, '北京市,北京市市辖区,东城区'],
  [310101, '上海市,上海市市辖区,黄浦区'],
  [500101, '重庆市,重庆市市辖区,万州区'],
  [510104, '四川省,成都市,锦江区']
])('CityArea preserves ordinary district %p', async (value, label) => {
  const {result, columns, open, confirm, onChange} = await setup(value);
  await waitFor(() => expect(result().textContent).toBe(label));
  await open();
  expect(columns()).toHaveLength(3);
  expect(columns()[2].children.length).toBeGreaterThan(0);
  await confirm();
  expect(onChange).toHaveBeenLastCalledWith(String(value));
  expect(result().textContent).toBe(label);
});

test('CityArea confirms and restores direct counties when switching between city levels', async () => {
  const {result, columns, open, select, confirm, onChange} = await setup(
    500101
  );
  await open();
  await select(1, '城口县');
  await waitFor(() => expect(columns()[2].children).toHaveLength(0));
  expect(onChange).not.toHaveBeenCalled();
  await confirm();
  expect(onChange).toHaveBeenLastCalledWith('500229');
  expect(result().textContent).toBe('重庆市,城口县');

  await open();
  await select(1, '重庆市市辖区');
  await waitFor(() =>
    expect(within(columns()[2]).getByText('万州区')).toBeInTheDocument()
  );
  await select(2, '万州区');
  await confirm();
  expect(onChange).toHaveBeenLastCalledWith('500101');
  expect(result().textContent).toBe('重庆市,重庆市市辖区,万州区');

  await open();
  await select(1, '丰都县');
  await waitFor(() => expect(columns()[2].children).toHaveLength(0));
  await confirm();
  expect(onChange).toHaveBeenLastCalledWith('500230');
  expect(result().textContent).toBe('重庆市,丰都县');
});

test.each(['.cxd-PopUp-cancel', '.cxd-PopUp-overlay'])(
  'CityArea discards a pending county change through %s',
  async dismissSelector => {
    const {result, columns, open, click, select, confirm, onChange, onCancel} =
      await setup(500229);
    await open();
    await select(1, '丰都县');
    await click(document.querySelector(dismissSelector)!);
    await waitFor(() => expect(columns()).toHaveLength(0));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onChange).not.toHaveBeenCalled();
    expect(result().textContent).toBe('重庆市,城口县');
    await open();
    expect(within(columns()[1]).getByText('城口县').closest('li')).toHaveClass(
      'is-selected'
    );
    await confirm();
    expect(onChange).toHaveBeenLastCalledWith('500229');
  }
);

test.each<[boolean, boolean, number, string, string]>([
  [true, false, 2, '500229', '重庆市,城口县'],
  [false, false, 1, '500000', '重庆市'],
  [false, true, 1, '500229', '重庆市,城口县']
])(
  'CityArea preserves allowCity=%p and allowDistrict=%p behavior',
  async (allowCity, allowDistrict, count, code, label) => {
    const {result, columns, open, confirm, onChange} = await setup(500229, {
      allowCity,
      allowDistrict
    });
    await waitFor(() => expect(result().textContent).toBe(label));
    await open();
    expect(columns()).toHaveLength(count);
    await confirm();
    expect(onChange).toHaveBeenLastCalledWith(code);
  }
);

test('CityArea preserves structured direct county values without inventing a district', async () => {
  const value = {
    code: 500229,
    provinceCode: 500000,
    province: '重庆市',
    cityCode: 500229,
    city: '城口县',
    districtCode: undefined,
    district: undefined,
    street: ''
  };
  const {result, open, select, confirm, onChange} = await setup(value, {
    extractValue: false
  });
  await waitFor(() => expect(result().textContent).toBe('重庆市,城口县'));
  await open();
  await confirm();
  expect(onChange).toHaveBeenLastCalledWith(value);
  await open();
  await select(1, '丰都县');
  await confirm();
  expect(onChange).toHaveBeenLastCalledWith({
    ...value,
    code: 500230,
    cityCode: 500230,
    city: '丰都县'
  });
  expect(result().textContent).toBe('重庆市,丰都县');
});

test('CityArea switches from a direct county to a different province and back', async () => {
  const {result, columns, open, select, confirm, onChange} = await setup(
    500229
  );
  await open();
  await select(0, '四川省');
  await waitFor(() =>
    expect(within(columns()[1]).getByText('成都市')).toBeInTheDocument()
  );
  await select(1, '成都市');
  await waitFor(() =>
    expect(within(columns()[2]).getByText('锦江区')).toBeInTheDocument()
  );
  await select(2, '锦江区');
  await confirm();
  expect(onChange).toHaveBeenLastCalledWith('510104');
  expect(result().textContent).toBe('四川省,成都市,锦江区');

  await open();
  await select(0, '湖北省');
  await waitFor(() =>
    expect(within(columns()[1]).getByText('仙桃市')).toBeInTheDocument()
  );
  await select(1, '仙桃市');
  await waitFor(() => expect(columns()[2].children).toHaveLength(0));
  await confirm();
  expect(onChange).toHaveBeenLastCalledWith('429004');
  expect(result().textContent).toBe('湖北省,仙桃市');
});
