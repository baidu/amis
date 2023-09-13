const result = async (req, res) => {
  const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
  const data = [
    {
      browser: 'Chrome',
      version: '1',
      platform: 'linux 1',
      Chrome: 'xxx1'
    },
    {
      browser: 'Chrome',
      version: '2',
      platform: 'windows xp',
      Chrome: 'xxx2'
    },
    {
      browser: 'Firefox',
      version: '3',
      platform: 'linux 2',
      Chrome: 'xxx3'
    },
    {
      browser: 'Firefox',
      version: '4',
      platform: 'windows 8',
      Chrome: 'xxx4'
    },
    {
      browser: 'Opera',
      version: '5',
      platform: 'linux 3',
      Chrome: 'xxx5'
    },
    {
      browser: 'Opera',
      version: '6',
      platform: 'windows 10',
      Chrome: 'xxx6'
    }
  ];

  await sleep(1000);
  const browser = req.query.browser;
  const items = req.query.items;
  res.json({
    status: 0,
    msg: '',
    data: items
      ? data
      : data.filter(function (item) {
          return browser ? ~item.browser.indexOf(browser) : false;
        })[0]
  });
};

module.exports = result;
