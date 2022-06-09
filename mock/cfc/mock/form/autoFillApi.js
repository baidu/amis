const result = async (req, res) => {
  const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
  const data = [
    {
      name: 'Chrome',
      version: '1',
      platform: 'linux',
      Chrome: 'xxx1'
    },
    {
      name: 'Chrome',
      version: '2',
      platform: 'windows',
      Chrome: 'xxx2'
    },
    {
      name: 'Firefox',
      version: '3',
      platform: 'linux',
      Chrome: 'xxx3'
    },
    {
      name: 'Firefox',
      version: '4',
      platform: 'windows',
      Chrome: 'xxx4'
    },
    {
      name: 'Opera',
      version: '5',
      platform: 'linux',
      Chrome: 'xxx5'
    },
    {
      name: 'Opera',
      version: '6',
      platform: 'windows',
      Chrome: 'xxx6'
    }
  ];

  await sleep(1000);
  res.json({
    status: 0,
    msg: '',
    data: data
  });
};

module.exports = result;
