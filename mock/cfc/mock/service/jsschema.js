module.exports = function (req, res) {
  return res.send(
    `
  return {
    type: 'button',
    label: '按钮修改',
    onClick: (e, props) => {
      alert('消息通知');
    }
  }
  `,
    {'Content-Type': 'text/javascript'}
  );
};
