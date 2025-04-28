import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react';
import {render as amisRender} from '../../../src';
import {makeEnv} from '../../helper';
import type {RenderOptions} from 'amis-core';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock DataTransfer API
class MockDataTransferItem {
  kind: string;
  type: string;
  _file: File;

  constructor(file: File) {
    this.kind = 'file';
    this.type = file.type;
    this._file = file;
  }

  getAsFile() {
    return this._file;
  }
}

class MockDataTransferItemList {
  _items: MockDataTransferItem[];

  constructor() {
    this._items = [];
  }

  add(file: File) {
    const item = new MockDataTransferItem(file);
    this._items.push(item);
    return item;
  }

  clear() {
    this._items = [];
  }

  get length() {
    return this._items.length;
  }
}

class MockDataTransfer {
  items: MockDataTransferItemList;
  files: File[];

  constructor() {
    this.items = new MockDataTransferItemList();
    this.files = [];
  }

  add(file: File) {
    this.items.add(file);
    this.files.push(file);
  }
}

// @ts-ignore
global.DataTransfer = MockDataTransfer;

// Mock Excel file data
const mockExcelFile = new File(
  [new ArrayBuffer(10)], // Mock binary data
  'test.xlsx',
  {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}
);

// Helper function to simulate file upload
const simulateFileUpload = (input: HTMLInputElement, files: File[]) => {
  Object.defineProperty(input, 'files', {
    value: Object.assign(files, {
      item: (index: number) => files[index],
      length: files.length
    }),
    configurable: true
  });
  fireEvent.change(input);
};

// Mock Excel data for auto-fill test
const mockExcelData = {
  excel: [
    {
      '班级': '1班',
      '学号': 1,
      '姓名': '张三'
    },
    {
      '班级': '1班',
      '学号': 2,
      '姓名': '李四'
    }
  ]
};

describe('Renderer:InputExcel', () => {
  test('Renderer:InputExcel with basic config', async () => {
    const onSubmit = jest.fn();
    const {container} = render(
      amisRender({
        type: 'form',
        api: '/api/mock2/form/saveForm',
        body: [
          {
            type: 'input-excel',
            name: 'excel'
          }
        ]
      }, {
        onSubmit
      } as RenderOptions, makeEnv())
    );

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement | null;
    expect(fileInput).toBeTruthy();
    if (!fileInput) {
      throw new Error('File input not found');
    }

    // Simulate file upload
    simulateFileUpload(fileInput, [mockExcelFile]);

    await waitFor(() => {
      expect(container.querySelector('.cxd-ExcelControl-list')).toBeTruthy();
    });
  });

  test('Renderer:InputExcel with maxLength', async () => {
    const onSubmit = jest.fn();
    const {container} = render(
      amisRender({
        type: 'form',
        api: '/api/mock2/form/saveForm',
        body: [
          {
            type: 'input-excel',
            name: 'excel',
            maxLength: 1
          }
        ]
      }, {
        onSubmit
      } as RenderOptions, makeEnv())
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement | null;
    expect(input).toBeTruthy();
    if (!input) {
      throw new Error('File input not found');
    }

    // Upload first file
    simulateFileUpload(input, [mockExcelFile]);

    await waitFor(() => {
      expect(container.querySelector('.cxd-ExcelControl-list')).toBeTruthy();
    });
  });

  test('Renderer:InputExcel file removal', async () => {
    const onSubmit = jest.fn();
    const {container} = render(
      amisRender({
        type: 'form',
        api: '/api/mock2/form/saveForm',
        body: [
          {
            type: 'input-excel',
            name: 'excel'
          }
        ]
      }, {
        onSubmit
      } as RenderOptions, makeEnv())
    );

    const excelControl = container.querySelector('.cxd-ExcelControl');
    expect(excelControl).toBeInTheDocument();

    // Upload a file
    const input = container.querySelector('input[type="file"]') as HTMLInputElement | null;
    if (!input) {
      throw new Error('File input not found');
    }

    simulateFileUpload(input, [mockExcelFile]);

    await waitFor(() => {
      expect(container.querySelector('.cxd-ExcelControl-list')).toBeInTheDocument();
    });

    // Remove the file
    const removeBtn = container.querySelector('.cxd-ExcelControl-clear');
    expect(removeBtn).toBeInTheDocument();
    fireEvent.click(removeBtn!);

    await waitFor(() => {
      expect(container.querySelector('.cxd-ExcelControl-list-item')).not.toBeInTheDocument();
      expect(container.querySelector('.cxd-ExcelControl-dropzone')).toBeInTheDocument();
    });
  });

  test('Renderer:InputExcel with allSheets=true', async () => {
    const {container} = render(
      amisRender({
        type: 'form',
        body: [
          {
            type: 'input-excel',
            name: 'excel',
            label: 'Excel',
            allSheets: true
          }
        ]
      }, {}, makeEnv())
    );

    const excelControl = container.querySelector('.cxd-ExcelControl');
    expect(excelControl).toBeInTheDocument();

    // Upload a file
    const input = container.querySelector('input[type="file"]') as HTMLInputElement | null;
    if (!input) {
      throw new Error('File input not found');
    }

    simulateFileUpload(input, [mockExcelFile]);

    await waitFor(() => {
      expect(container.querySelector('.cxd-ExcelControl-list')).toBeInTheDocument();
    });
  });

  test('Renderer:InputExcel disabled state', async () => {
    const {container} = render(
      amisRender({
        type: 'form',
        body: [
          {
            type: 'input-excel',
            name: 'excel',
            label: 'Excel',
            disabled: true
          }
        ]
      }, {}, makeEnv())
    );

    const excelControl = container.querySelector('.cxd-ExcelControl');
    expect(excelControl).toBeInTheDocument();
    expect(container.querySelector('.is-disabled')).toBeInTheDocument();

    // Verify that file upload is not possible in disabled state
    const input = container.querySelector('input[type="file"]') as HTMLInputElement | null;
    if (!input) {
      throw new Error('File input not found');
    }

    simulateFileUpload(input, [mockExcelFile]);

    await waitFor(() => {
      expect(container.querySelector('.cxd-ExcelControl-list')).not.toBeInTheDocument();
    });
  });

  test('Renderer:InputExcel with autoFill', async () => {
    const {container} = render(
      amisRender({
        type: 'form',
        data: mockExcelData,
        body: [
          {
            type: 'input-excel',
            name: 'excel',
            label: 'Excel'
          },
          {
            type: 'input-text',
            name: 'fillClass',
            label: 'Class',
            value: '${excel[0].班级}'
          },
          {
            type: 'input-text',
            name: 'fillName',
            label: 'Name',
            value: '${excel[0].姓名}'
          }
        ]
      }, {}, makeEnv())
    );

    // Wait for auto-fill to complete
    await waitFor(() => {
      const classInput = container.querySelector('input[name="fillClass"]') as HTMLInputElement | null;
      const nameInput = container.querySelector('input[name="fillName"]') as HTMLInputElement | null;
      expect(classInput?.value).toBe('1班');
      expect(nameInput?.value).toBe('张三');
    });
  });

  test('Renderer:InputExcel with custom placeholder', async () => {
    const {container} = render(
      amisRender({
        type: 'form',
        body: [
          {
            type: 'input-excel',
            name: 'excel',
            label: 'Excel',
            placeholder: 'Custom placeholder text'
          }
        ]
      }, {}, makeEnv())
    );

    const dropzone = container.querySelector('.cxd-ExcelControl-dropzone');
    expect(dropzone).toBeInTheDocument();
    expect(dropzone?.textContent).toContain('Custom placeholder text');
  });

  test('Renderer:InputExcel with parseMode=array', async () => {
    const {container} = render(
      amisRender({
        type: 'form',
        body: [
          {
            type: 'input-excel',
            name: 'excel',
            label: 'Excel',
            parseMode: 'array'
          }
        ]
      }, {}, makeEnv())
    );

    const excelControl = container.querySelector('.cxd-ExcelControl');
    expect(excelControl).toBeInTheDocument();
  });

  test('Renderer:InputExcel with parseMode=array and includeEmpty=false', async () => {
    const onSubmit = jest.fn();
    const {container} = render(
      amisRender({
        type: 'form',
        body: [
          {
            type: 'input-excel',
            name: 'excel',
            label: 'Excel',
            parseMode: 'array',
            includeEmpty: false
          }
        ],
        onSubmit
      }, {}, makeEnv())
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement | null;
    if (!input) {
      throw new Error('File input not found');
    }
    expect(input).toBeInTheDocument();

    // Simulate file upload
    simulateFileUpload(input, [mockExcelFile]);

    // Wait for file to be processed
    await waitFor(() => {
      expect(container.querySelector('.cxd-ExcelControl-list')).toBeInTheDocument();
    });
  });

  test('Renderer:InputExcel with parseImage=true', async () => {
    const onSubmit = jest.fn();
    const {container} = render(
      amisRender({
        type: 'form',
        body: [
          {
            type: 'input-excel',
            name: 'excel',
            label: 'Excel',
            parseImage: true,
            imageDataURI: true
          }
        ],
        onSubmit
      }, {}, makeEnv())
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement | null;
    if (!input) {
      throw new Error('File input not found');
    }
    expect(input).toBeInTheDocument();

    // Simulate file upload
    simulateFileUpload(input, [mockExcelFile]);

    // Wait for file to be processed
    await waitFor(() => {
      expect(container.querySelector('.cxd-ExcelControl-list')).toBeInTheDocument();
    });

  });

  test('Renderer:InputExcel with maxLength limit', async () => {
    const onSubmit = jest.fn();
    const {container} = render(
      amisRender({
        type: 'form',
        api: '/api/mock2/form/saveForm',
        body: [
          {
            type: 'input-excel',
            name: 'excel',
            maxLength: 1
          }
        ]
      }, {
        onSubmit
      } as RenderOptions, makeEnv())
    );

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement | null;
    expect(fileInput).toBeTruthy();
    if (!fileInput) {
      throw new Error('File input not found');
    }

    // Upload first file
    simulateFileUpload(fileInput, [mockExcelFile]);

    await waitFor(() => {
      expect(container.querySelector('.cxd-ExcelControl-list')).toBeTruthy();
    });

    // Try to upload second file
    simulateFileUpload(fileInput, [mockExcelFile]);

    await waitFor(() => {
      const dropzone = container.querySelector('.cxd-ExcelControl-dropzone');
      expect(dropzone?.classList.contains('is-disabled')).toBeTruthy();
    });
  });
});
