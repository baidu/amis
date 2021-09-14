module.exports = function (req, res) {
  res.json({
    status: 0,
    msg: '',
    data: {
      imageList: [
        {
          image:
            'https://internal-amis-res.cdn.bcebos.com/images/2019-12/1577157239810/da6376bf988c.png',
        },
        {
          html:
            '<div style="width: 100%; height: 300px; background: #e3e3e3; text-align: center; line-height: 300px;">carousel data</div>',
        },
        {
          image:
            'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg',
        },
      ],
    },
  });
};
