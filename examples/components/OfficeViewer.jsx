export default {
  type: 'page',
  body: {
    type: 'form',
    title: '',
    wrapWithPanel: false,
    body: [
      {
        type: 'input-file',
        name: 'file',
        label: '选择 Docx 文件预览效果（不会上传到服务器）',
        asBlob: true,
        accept: '.docx'
      },
      {
        type: 'office-viewer',
        id: 'office-viewer',
        name: 'file'
      }
    ]
  }
};
