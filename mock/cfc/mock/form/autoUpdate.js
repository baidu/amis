const result = async (req, res) => {
  const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
  const data = [
    {
      browser: 'Chrome',
      version: '1',
      platform: 'linux',
      Chrome: 'xxx1'
    },
    {
      browser: 'Chrome',
      version: '2',
      platform: 'windows',
      Chrome: 'xxx2'
    },
    {
      browser: 'Firefox',
      version: '3',
      platform: 'linux',
      Chrome: 'xxx3'
    },
    {
      browser: 'Firefox',
      version: '4',
      platform: 'windows',
      Chrome: 'xxx4'
    },
    {
      browser: 'Opera',
      version: '5',
      platform: 'linux',
      Chrome: 'xxx5'
    },
    {
      browser: 'Opera',
      version: '6',
      platform: 'windows',
      Chrome: 'xxx6'
    }
  ];

  await sleep(1000);
  const browser = req.query.browser;
  res.json({
    status: 0,
    msg: '',
    data:
      data.filter(function (item) {
        return browser ? ~item.browser.indexOf(browser) : false;
      })[0] || data[0]
  });
};

module.exports = result;
