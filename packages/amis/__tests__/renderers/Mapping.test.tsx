import {render} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv} from '../helper';

const tag = (label: string) => render(
  amisRender(
    {type: 'tag', label},
    {},
    makeEnv({})
  )
).container;

test('Renderer:mapping width object map', async () => {
  const setup = (value?: any) => render(
    amisRender(
      {
        type: 'mapping',
        map: {
          1: "漂亮",
          2: "开心",
          3: "惊吓",
          4: "紧张",
          '*': '其他',
        },
        ...(value !== undefined ? {value} : {})
      },
      {},
      makeEnv({})
    )
  ).container;

  const noValue = setup().querySelector('.cxd-MappingField .text-muted')! as HTMLElement;
  expect(noValue.innerHTML).toBe('-');

  const value1 = setup(1).querySelector('.cxd-MappingField .cxd-TplField span')! as HTMLElement;
  expect(value1.innerHTML).toBe('漂亮');

  const value5 = setup(5).querySelector('.cxd-MappingField .cxd-TplField span')! as HTMLElement;
  expect(value5.innerHTML).toBe('其他');
});

test('Renderer:mapping width array map', async () => {
  const setup = (value?: any) => render(
    amisRender(
      {
        type: 'mapping',
        map: [
          {1: "漂亮"},
          {2: "开心"},
          {3: "惊吓"},
          {4: "紧张"},
          {'*': '其他'}
        ],
        ...(value !== undefined ? {value} : {})
      },
      {},
      makeEnv({})
    )
  ).container;

  const noValue = setup().querySelector('.cxd-MappingField .text-muted')! as HTMLElement;
  expect(noValue.innerHTML).toBe('-');

  const value1 = setup(1).querySelector('.cxd-MappingField .cxd-TplField span')! as HTMLElement;
  expect(value1.innerHTML).toBe('漂亮');

  const value5 = setup(5).querySelector('.cxd-MappingField .cxd-TplField span')! as HTMLElement;
  expect(value5.innerHTML).toBe('其他');
});

test('Renderer:mapping attr: valueField and labelField', async () => {
  const setup = (value?: any) => render(
    amisRender(
      {
        type: 'mapping',
        map: [
          {
            name: 1,
            text: '漂亮'
          },
          {
            name: 2,
            text: '开心'
          },
          {
            name: '*',
            text: '其他'
          }
        ],
        labelField: 'text',
        valueField: 'name',
        ...(value !== undefined ? {value} : {})
      },
      {},
      makeEnv({})
    )
  ).container;

  const noValue = setup().querySelector('.cxd-MappingField .text-muted')! as HTMLElement;
  expect(noValue.innerHTML).toBe('-');

  const value1 = setup(1).querySelector('.cxd-MappingField .cxd-TplField span')! as HTMLElement;
  expect(value1.innerHTML).toBe('漂亮');

  const value5 = setup(5).querySelector('.cxd-MappingField .cxd-TplField span')! as HTMLElement;
  expect(value5.innerHTML).toBe('其他');
});

test('Renderer:mapping attr: itemSchema when simple map', async () => {
  const setup = (value?: any) => render(
    amisRender(
      {
        type: 'mapping',
        map: [
          {1: "漂亮"},
          {2: "开心"},
          {3: "惊吓"},
          {4: "紧张"},
          {'*': '其他'}
        ],
        valueField: 'name',
        ...(value !== undefined ? {value} : {}),
        itemSchema: {
          type: 'tag',
          label: '${item}'
        }
      },
      {},
      makeEnv({})
    )
  ).container;

  const noValue = setup().querySelector('.cxd-MappingField .text-muted')! as HTMLElement;
  expect(noValue.innerHTML).toBe('-');

  const value1 = setup(1).querySelector('.cxd-MappingField')! as HTMLElement;
  expect(value1.innerHTML).toBe(tag('漂亮').innerHTML);

  const value5 = setup(5).querySelector('.cxd-MappingField')! as HTMLElement;
  expect(value5.innerHTML).toBe(tag('其他').innerHTML);
});

test('Renderer:mapping attr: itemSchema when normal map', async () => {
  const setup = (value?: any) => render(
    amisRender(
      {
        type: 'mapping',
        map: [
          {
            name: 1,
            text: '漂亮'
          },
          {
            name: 2,
            text: '开心'
          },
          {
            name: '*',
            text: '其他'
          }
        ],
        valueField: 'name',
        ...(value !== undefined ? {value} : {}),
        itemSchema: {
          type: 'tag',
          label: '${name} ${text}'
        }
      },
      {},
      makeEnv({})
    )
  ).container;

  const noValue = setup().querySelector('.cxd-MappingField .text-muted')! as HTMLElement;
  expect(noValue.innerHTML).toBe('-');

  const value1 = setup(1).querySelector('.cxd-MappingField')! as HTMLElement;
  expect(value1.innerHTML).toBe(tag('1 漂亮').innerHTML);

  const value5 = setup(5).querySelector('.cxd-MappingField')! as HTMLElement;
  expect(value5.innerHTML).toBe(tag('* 其他').innerHTML);
});

test('Renderer:mapping', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'mapping',
        map: {
          1: "<span class='label label-info'>漂亮</span>",
          2: "<span class='label label-success'>开心</span>",
          3: "<span class='label label-danger'>惊吓</span>",
          4: "<span class='label label-warning'>紧张</span>",
          '*': '其他'
        }
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});

test('Renderer:mapping html', async () => {
  const setup = (value?: any) => render(
    amisRender(
      {
        type: 'mapping',
        map: {
          1: "<span class='label label-info'>漂亮</span>",
          2: "<span class='label label-success'>开心</span>",
          3: "<span class='label label-danger'>惊吓</span>",
          4: "<span class='label label-warning'>紧张</span>",
          '*': '其他'
        },
        ...(value !== undefined ? {value} : {})
      },
      {},
      makeEnv({})
    )
  ).container;

  expect(setup()).toMatchSnapshot();
  expect(setup(1)).toMatchSnapshot();
  expect(setup(5)).toMatchSnapshot();
});

test('Renderer:mapping schema', async () => {
  const setup = (value?: any) => render(
    amisRender(
      {
        type: 'mapping',
        map: {
          1: {type: 'tag', label: '漂亮'},
          2: {type: 'tag', label: '开心'},
          3: {type: 'tag', label: '惊吓'},
          4: {type: 'tag', label: '紧张'},
          '*': {type: 'tag', label: '其他'}
        },
        ...(value !== undefined ? {value} : {})
      },
      {},
      makeEnv({})
    )
  ).container;

  const noValue = setup().querySelector('.cxd-MappingField .text-muted')! as HTMLElement;
  expect(noValue.innerHTML).toBe('-');

  const value1 = setup(1).querySelector('.cxd-MappingField')! as HTMLElement;
  expect(value1.innerHTML).toBe(tag('漂亮').innerHTML);

  const value5 = setup(5).querySelector('.cxd-MappingField')! as HTMLElement;
  expect(value5.innerHTML).toBe(tag('其他').innerHTML);
});
