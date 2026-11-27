module.exports = function (req, res) {
  res.json({
    status: 0,
    msg: '',
    data: {
      imageList: [
        {
          image:
            'https://internal-amis-res.cdn.bcebos.com/images/2019-12/1577157239810/da6376bf988c.png'
        },
        {
          html: '<div style="width: 100%; height: 300px; background: #e3e3e3; text-align: center; line-height: 300px;">carousel data</div>'
        },
        {
          image: 'https://suda.cdn.bcebos.com/amis/images/alice-macaw.jpg'
        }
      ]
    }
  });
};
