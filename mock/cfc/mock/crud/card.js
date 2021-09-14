const data = [
  {
    title: '爱奇艺',
    avatar:
      'https://internal-amis-res.cdn.bcebos.com/images/2021-4/1617802579388/50fb523c7cc7.jpeg',
    subDescription: '悅享品質'
  },
  {
    title: '今日头条',
    avatar:
      'https://internal-amis-res.cdn.bcebos.com/images/2021-4/1617802678540/6f238951baf0.jpeg',
    subDescription: '信息创造价值'
  },
  {
    title: 'Riot Games',
    avatar:
      'https://internal-amis-res.cdn.bcebos.com/images/2021-4/1617802729936/b3f83336a2e7.jpeg',
    subDescription: 'STAY HUNGRY; STAY HUMBLE'
  },
  {
    title: 'Starbucks',
    avatar:
      'https://internal-amis-res.cdn.bcebos.com/images/2021-4/1617802777761/3d2978fc5253.jpeg',
    subDescription: 'To inspire and nurture the human spirit'
  },
  {
    title: 'Pizza Hut',
    avatar:
      'https://internal-amis-res.cdn.bcebos.com/images/2021-4/1617803060359/d96bfaf731e7.jpeg',
    subDescription: 'No One Outpizzas the Hut'
  },
  {
    title: '微信',
    avatar:
      'https://internal-amis-res.cdn.bcebos.com/images/2021-4/1617803059835/cbb048ecbaad.jpeg',
    subDescription: '微信，是一个生活方式'
  },
  {
    title: "McDonald's",
    avatar:
      'https://internal-amis-res.cdn.bcebos.com/images/2021-4/1617803059279/7e7718477880.jpeg',
    subDescription: "I'm lovin' it"
  },
  {
    title: 'Blizzard Entertainment',
    avatar:
      'https://internal-amis-res.cdn.bcebos.com/images/2021-4/1617802454876/9989f72f58e0.jpeg',
    subDescription:
      'Welcome To Blizzard. At Blizzard Entertainment, we pour our hearts and souls into everything we create.'
  }
];

module.exports = function (req, res) {
  const perPage = 10;
  const page = req.query.page || 1;
  let items = data.concat();

  if (req.query.keywords) {
    const keywords = req.query.keywords;
    items = items.filter(function (item) {
      return ~JSON.stringify(item).indexOf(keywords);
    });
  }

  const ret = {
    status: 0,
    msg: 'ok',
    data: {
      count: items.length,
      rows: items.concat().splice((page - 1) * perPage, perPage)
    }
  };

  res.json(ret);
};
