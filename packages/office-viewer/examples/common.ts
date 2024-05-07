import {Excel} from '../src';
import {OfficeViewer} from '../src/OfficeViewer';
import {createOfficeViewer} from '../src/createOfficeViewer';
import XMLPackageParser from '../src/package/XMLPackageParser';

let office: OfficeViewer;

export class App {
  dir: string;
  fileLists: Record<string, string[]>;
  viewerElement: HTMLElement;
  renderOptions: any;
  initFile: string;

  constructor(
    dir: string,
    fileLists: Record<string, string[]>,
    viewerElement: HTMLElement,
    renderOptions: any
  ) {
    this.dir = dir;
    this.fileLists = fileLists;
    this.viewerElement = viewerElement;
    this.renderOptions = renderOptions;

    // 支持临时拖拽文件到页面里显示
    document.addEventListener('dragover', function (event) {
      event.preventDefault();
    });

    document.addEventListener(
      'drop',
      e => {
        e.preventDefault();
        let dt = e.dataTransfer!;
        let files = dt.files;
        this.renderDrop(files[0]);
      },
      false
    );

    const url = new URL(location.href);

    const initFile = url.searchParams.get('file');

    if (initFile) {
      this.renderFile(initFile);
    }

    this.initFile = initFile || '';

    this.renderFileList();

    const uploadFile = document.getElementById('uploadFile')!;
    uploadFile.addEventListener('change', e => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        this.renderDrop(files[0]);
      }
      e.stopPropagation();
    });
  }

  renderFileList() {
    const fileLists = this.fileLists;
    const fileListElement = document.getElementById('files')!;
    const html: string[] = ['<select id="fileList">'];

    for (const dirName in fileLists) {
      html.push(`<optgroup label="${dirName}">`);
      const dir = dirName as keyof typeof fileLists;
      for (const file of fileLists[dir]) {
        const fileName = file.split('.')[0];
        const selected =
          this.initFile === `${dirName}/${file}` ? 'selected' : '';
        html.push(
          `<option value="${dirName}/${file}" ${selected}>${fileName}</option>`
        );
      }
      html.push('</optgroup>');
    }

    fileListElement.innerHTML = html.join('');

    document.getElementById('fileList')!.addEventListener('change', e => {
      const fileName = (e.target as HTMLSelectElement).value;
      history.pushState({fileName}, fileName, `?file=${fileName}`);
      this.renderFile(fileName);
    });
  }

  /**
   * 支持临时拖拽文件到页面里显示
   */
  renderDrop(file: File) {
    const reader = new FileReader();
    reader.onload = _e => {
      const data = reader.result as ArrayBuffer;
      this.renderOffice(data, file.name);
    };
    reader.readAsArrayBuffer(file);
  }

  async renderFile(fileName: string) {
    const filePath = `${this.dir}/${fileName}`;
    const file = await (await fetch(filePath)).arrayBuffer();
    await this.renderOffice(file, fileName);
  }

  /**
   * 渲染
   */
  async renderOffice(data: ArrayBuffer, fileName: string) {
    if (office) {
      office.destroy();
    }
    if (fileName.endsWith('.xml')) {
      office = await createOfficeViewer(
        data,
        this.renderOptions,
        fileName,
        new XMLPackageParser()
      );
    } else {
      office = await createOfficeViewer(data, this.renderOptions, fileName);
      if (office instanceof Excel) {
        await office.loadExcel();
      }
    }
    const fileNameSplit = fileName.split('/');
    const downloadName = fileNameSplit[fileNameSplit.length - 1].replace(
      '.xml',
      '.docx'
    );

    (window as any).downloadDocx = () => {
      office.download(downloadName);
    };

    (window as any).printDocx = () => {
      office.print();
    };

    office.render(this.viewerElement, this.renderOptions);
  }
}
