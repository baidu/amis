export default {
  type: 'page',
  body: {
    type: 'form',
    id: 'form',
    debug: true,
    wrapWithPanel: false,
    body: [
      {
        type: 'input-file',
        name: 'file',
        label: '选择 PDF 文件预览效果（不会上传到服务器）',
        asBlob: true,
        accept: '.pdf'
      },
      {
        type: 'pdf-viewer',
        id: 'pdf-viewer',
        name: 'file',
        width: 500
      }
    ]
  }
};
