import React from 'react';
import {
  fireEvent,
  render,
  waitFor,
  screen,
  within
} from '@testing-library/react';
import {render as amisRender} from '../../../src';
import {makeEnv} from '../../helper';

const items = [
  {
    name: '手机维修',
    children: [
      {
        name: '苹果',
        children: [
          {
            name: 'iphone系列'
          }
        ]
      },
      {
        name: '华为',
        children: [
          {
            name: 'mate系列'
          },
          {
            name: 'p系列'
          }
        ]
      }
    ]
  }
];

const getExpandBtnByText = (text: string) => {
  const tdElement = screen.getByText(text).parentElement as HTMLElement;

  return tdElement.querySelector('.cxd-Table-expandBtn2') as HTMLAnchorElement;
};

const getCheckMeBtnByText = (text: string) => {
  const trElement = screen.getByText(text).parentElement!
    .parentElement as HTMLElement;

  return within(trElement!).getByRole('checkbox');
};

const renderTable = () =>
  render(
    amisRender(
      {
        type: 'crud',
        headerToolbar: ['bulkActions'],
        bulkActions: [
          {
            type: 'button',
            label: '批量操作'
          }
        ],
        footable: {
          expand: 'first'
        },
        data: {
          items
        },
        columns: [
          {
            name: 'name',
            label: 'name'
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

describe('层级选择', () => {
  it('选择根节点,所有后代节点都会自动选中', async () => {
    renderTable();
    const checkMeFirst = getCheckMeBtnByText('手机维修');

    expect(checkMeFirst).toBeInTheDocument();

    // 选中一级节点
    fireEvent.click(checkMeFirst);

    // 一级节点选中
    await waitFor(() => {
      expect(checkMeFirst).toBeChecked();
    });

    const checkMeSecond1 = getCheckMeBtnByText('苹果');
    const checkMeSecond2 = getCheckMeBtnByText('华为');

    // 二级节点选中
    expect(checkMeSecond1).toBeChecked();
    expect(checkMeSecond2).toBeChecked();

    const expandSecond1 = getExpandBtnByText('苹果');

    expect(expandSecond1).toBeInTheDocument();

    fireEvent.click(expandSecond1);

    const checkMeThird1 = getCheckMeBtnByText('iphone系列');

    // 三级节点选中
    await waitFor(() => {
      expect(checkMeThird1).toBeInTheDocument();
    });
  });

  it('选择所有子节点,所有祖先点选中', async () => {
    renderTable();
    const expandSecond1 = getExpandBtnByText('苹果');

    // 展开三级节点
    fireEvent.click(expandSecond1);
    const checkMeThird1 = getCheckMeBtnByText('iphone系列');

    await waitFor(() => {
      expect(checkMeThird1).toBeInTheDocument();
    });

    fireEvent.click(checkMeThird1);

    const checkMeSecond1 = getCheckMeBtnByText('苹果');
    const checkMeFirst = getCheckMeBtnByText('手机维修');

    await waitFor(() => {
      expect(checkMeSecond1).toBeChecked();
      expect(checkMeSecond1.parentElement!.classList).toContain('checked');
    });

    // 根节点下包含苹果和华为两个节点
    // 华为节点是未选中,所以根节点应该显示部分选中的样式
    expect(checkMeFirst).toBeChecked();
    expect(checkMeFirst.parentElement!.classList).not.toContain(
      'cxd-Checkbox--partial checked'
    );
  });

  it('选择部分子节点,所有祖先点选中,但选中状态是部分选中', async () => {
    renderTable();
    const expandSecond2 = getExpandBtnByText('华为');

    // 展开三级节点
    fireEvent.click(expandSecond2);
    const checkMeThird1 = getCheckMeBtnByText('mate系列');

    await waitFor(() => {
      expect(checkMeThird1).toBeInTheDocument();
    });

    fireEvent.click(checkMeThird1);

    const checkMeSecond2 = getCheckMeBtnByText('华为');
    const checkMeFirst = getCheckMeBtnByText('手机维修');

    await waitFor(() => {
      expect(checkMeSecond2).toBeChecked();
      expect(checkMeSecond2.parentElement!.classList).not.toContain(
        'cxd-Checkbox--partial checked'
      );
    });

    expect(checkMeFirst).toBeChecked();
    expect(checkMeFirst.parentElement!.classList).not.toContain(
      'cxd-Checkbox--partial checked'
    );
  });
});
