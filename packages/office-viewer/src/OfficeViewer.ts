/**
 * 对外统一接口
 */

export interface OfficeViewer {
  render(root: HTMLElement, options: any): Promise<void>;

  updateOptions(options: any): void;

  download(fileName: string): Promise<void>;

  print(): void;

  updateVariable(): void;

  destroy(): void;
}
