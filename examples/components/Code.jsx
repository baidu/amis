export default {
  type: 'page',
  title: 'Code组件自定义语言高亮',
  body: [
    {
      type: 'code',
      customLang: {
        name: 'myLog',
        tokens: [
          {
            name: 'custom-error',
            regex: '\\[error.*',
            color: '#ff0000',
            fontStyle: 'bold'
          },
          {
            name: 'custom-notice',
            regex: '\\[notice.*',
            color: '#FFA500'
          },
          {
            name: 'custom-info',
            regex: '\\[info.*',
            color: '#808080'
          },
          {
            name: 'custom-date',
            regex: '\\[[a-zA-Z 0-9:]+\\]',
            color: '#008800'
          }
        ]
      },
      value:
        "[Sun Mar 7 16:02:00 2021] [notice] Apache/1.3.29 (Unix) configured -- resuming normal operations\n[Sun Mar 7 16:02:00 2021] [info] Server built: Feb 27 2021 13:56:37\n[Sun Mar 7 16:02:00 2021] [notice] Accept mutex: sysvsem (Default: sysvsem)\n[Sun Mar 7 17:21:44 2021] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection\n[Sun Mar 7 17:23:53 2021] statistics: Use of uninitialized value in concatenation (.) or string at /home/httpd line 528.\n[Sun Mar 7 17:23:53 2021] statistics: Can't create file /home/httpd/twiki/data/Main/WebStatistics.txt - Permission denied\n[Sun Mar 7 17:27:37 2021] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection\n[Sun Mar 7 17:31:39 2021] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection\n[Sun Mar 7 21:16:17 2021] [error] [client xx.xx.xx.xx] File does not exist: /home/httpd/twiki/view/Main/WebHome"
    },
    {
      type: 'markdown',
      value:
        '`customLang` 中主要是 `tokens` 设置，这里是语言词法配置，它有 4 个配置项：\n- `name`：词法名称\n- `regex`：词法的正则匹配，注意因为是在字符串中，这里正则中如果遇到 `\\` 需要写成 `\\\\`\n- `regexFlags`: 可选，正则的标志参数\n- `color`：颜色\n- `fontStyle`: 可选，字体样式，比如 `bold` 代表加粗'
    }
  ]
};
