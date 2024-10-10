import {OfficeViewer} from './OfficeViewer';

/**
 * 不支持的文件类型，主要用于显示报错信息
 */
export default class UnSupport implements OfficeViewer {
  errorMessage: string;
  constructor(errorMessage: string) {
    this.errorMessage = errorMessage;
  }
  updateOptions(options: any): void {
    throw new Error('Method not implemented.');
  }
  updateVariable(): void {
    throw new Error('Method not implemented.');
  }
  async render(root: HTMLElement, options: any): Promise<void> {
    root.innerHTML = this.errorMessage;
  }
  download(fileName: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  print(): void {
    throw new Error('Method not implemented.');
  }
  destroy(): void {
    throw new Error('Method not implemented.');
  }
}
