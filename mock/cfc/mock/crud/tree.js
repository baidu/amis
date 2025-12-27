const data = [
  {
    "engine": "Trident - afurms",
    "browser": "Internet Explorer 4.0",
    "platform": "Win 95+",
    "version": "4",
    "grade": "X",
    "id": 1,
    "children": [
      {
        "engine": "Trident - f7006",
        "browser": "Internet Explorer 5.0",
        "platform": "Win 95+",
        "version": "5",
        "grade": "C",
        "id": 2
      },
      {
        "engine": "Trident - t6r3s4",
        "browser": "Internet Explorer 5.5",
        "platform": "Win 95+",
        "version": "5.5",
        "grade": "A",
        "id": 3
      },
      {
        "engine": "Trident - 3a99nb",
        "browser": "Internet Explorer 6",
        "platform": "Win 98+",
        "version": "6",
        "grade": "A",
        "id": 4
      }
    ]
  },
  {
    "engine": "Trident - plb6cd",
    "browser": "Internet Explorer 7",
    "platform": "Win XP SP2+",
    "version": "7",
    "grade": "A",
    "id": 5,
    "children": [
      {
        "engine": "Trident - dpgbw",
        "browser": "AOL browser (AOL desktop)",
        "platform": "Win XP",
        "version": "6",
        "grade": "A",
        "id": 6
      }
    ]
  },
  {
    "engine": "Gecko - syo6k7",
    "browser": "Firefox 1.0",
    "platform": "Win 98+ / OSX.2+",
    "version": "1.7",
    "grade": "A",
    "id": 7
  },
  {
    "engine": "Gecko - xha3vk",
    "browser": "Firefox 1.5",
    "platform": "Win 98+ / OSX.2+",
    "version": "1.8",
    "grade": "A",
    "id": 8
  },
  {
    "engine": "Gecko - wc71bb",
    "browser": "Firefox 2.0",
    "platform": "Win 98+ / OSX.2+",
    "version": "1.8",
    "grade": "A",
    "id": 9
  },
  {
    "engine": "Gecko - xfqpti",
    "browser": "Firefox 3.0",
    "platform": "Win 2k+ / OSX.3+",
    "version": "1.9",
    "grade": "A",
    "id": 10
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
