/** 列字段为布尔值，开启查询 */
module.exports = function (req, res) {
  const perPage = 10;
  const page = req.query.page || 1;
  let items = data.concat();

  const validQueryKey = Object.keys(req.query).filter(
    item => item !== 'keywords' && req.query[item] != null
  );

  if (validQueryKey.length > 0) {
    items = items.filter(item =>
      validQueryKey.every(key => {
        if (key === 'status') {
          return item[key] === (req.query[key] === 'true' ? true : false);
        }

        return !!~req.query[key].indexOf(item[key] || '');
      })
    );
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

const data = [
  {
      "browser": "Internet Explorer 4.0",
      "platform": "Win 95+",
      "version": "4",
      "grade": "X",
      "status": true
  },
  {
      "browser": "Internet Explorer 5.0",
      "platform": "Win 95+",
      "version": "5",
      "grade": "C",
      "status": false
  },
  {
      "browser": "Internet Explorer 5.5",
      "platform": "Win 95+",
      "version": "5.5",
      "grade": "A",
      "status": true
  },
  {
      "engine": "Trident",
      "browser": "Internet Explorer 6",
      "version": "6",
      "grade": "A",
      "status": false
  },
  {
      "engine": "Trident",
      "browser": "Internet Explorer 7",
      "version": "7",
      "grade": "A",
      "status": true
  },
  {
      "engine": "Trident",
      "browser": "AOL browser (AOL desktop)",
      "platform": "Win XP",
      "grade": "A",
      "status": false
  },
  {
      "engine": "Gecko",
      "browser": "Firefox 1.0",
      "platform": "Win 98+ / OSX.2+",
      "grade": "A",
      "status": true
  },
  {
      "engine": "Gecko",
      "browser": "Firefox 1.5",
      "platform": "Win 98+ / OSX.2+",
      "version": "1.8",
      "status": false
  },
  {
      "engine": "Gecko",
      "browser": "Firefox 2.0",
      "platform": "Win 98+ / OSX.2+",
      "version": "1.8",
      "status": true
  },
  {
      "engine": "Gecko",
      "browser": "Firefox 3.0",
      "platform": "Win 2k+ / OSX.3+",
      "version": "1.9",
      "grade": "A",
      "status": false
  },
  {
      "engine": "Gecko",
      "browser": "Camino 1.0",
      "platform": "OSX.2+",
      "version": "1.8",
      "grade": "A",
      "status": true
  },
  {
      "engine": "Gecko",
      "browser": "Camino 1.5",
      "platform": "OSX.3+",
      "version": "1.8",
      "grade": "A",
      "status": false
  },
  {
      "engine": "Gecko",
      "browser": "Netscape 7.2",
      "platform": "Win 95+ / Mac OS 8.6-9.2",
      "version": "1.7",
      "grade": "A",
      "status": true
  },
  {
      "engine": "Gecko",
      "browser": "Netscape Browser 8",
      "platform": "Win 98SE+",
      "version": "1.7",
      "grade": "A",
      "status": false
  },
  {
      "engine": "Gecko",
      "browser": "Netscape Navigator 9",
      "platform": "Win 98+ / OSX.2+",
      "version": "1.8",
      "grade": "A",
      "status": true
  },
  {
      "engine": "Gecko",
      "browser": "Mozilla 1.0",
      "platform": "Win 95+ / OSX.1+",
      "version": "1",
      "grade": "A",
      "status": false
  },
  {
      "engine": "Gecko",
      "browser": "Mozilla 1.1",
      "platform": "Win 95+ / OSX.1+",
      "version": "1.1",
      "grade": "A",
      "status": true
  },
  {
      "engine": "Gecko",
      "browser": "Mozilla 1.2",
      "platform": "Win 95+ / OSX.1+",
      "version": "1.2",
      "grade": "A",
      "status": false
  },
  {
      "engine": "Gecko",
      "browser": "Mozilla 1.3",
      "platform": "Win 95+ / OSX.1+",
      "version": "1.3",
      "grade": "A",
      "status": true
  },
  {
      "engine": "Gecko",
      "browser": "Mozilla 1.4",
      "platform": "Win 95+ / OSX.1+",
      "version": "1.4",
      "grade": "A",
      "status": false
  },
  {
      "engine": "Gecko",
      "browser": "Mozilla 1.5",
      "platform": "Win 95+ / OSX.1+",
      "version": "1.5",
      "grade": "A",
      "status": true
  },
  {
      "engine": "Gecko",
      "browser": "Mozilla 1.6",
      "platform": "Win 95+ / OSX.1+",
      "version": "1.6",
      "grade": "A",
      "status": false
  },
  {
      "engine": "Gecko",
      "browser": "Mozilla 1.7",
      "platform": "Win 98+ / OSX.1+",
      "version": "1.7",
      "grade": "A",
      "status": true
  },
  {
      "engine": "Gecko",
      "browser": "Mozilla 1.8",
      "platform": "Win 98+ / OSX.1+",
      "version": "1.8",
      "grade": "A",
      "status": false
  },
  {
      "engine": "Gecko",
      "browser": "Seamonkey 1.1",
      "platform": "Win 98+ / OSX.2+",
      "version": "1.8",
      "grade": "A",
      "status": true
  },
  {
      "engine": "Gecko",
      "browser": "Epiphany 2.20",
      "platform": "Gnome",
      "version": "1.8",
      "grade": "A",
      "status": false
  },
  {
      "engine": "Webkit",
      "browser": "Safari 1.2",
      "platform": "OSX.3",
      "version": "125.5",
      "grade": "A",
      "status": true
  },
  {
      "engine": "Webkit",
      "browser": "Safari 1.3",
      "platform": "OSX.3",
      "version": "312.8",
      "grade": "A",
      "status": false
  },
  {
      "engine": "Webkit",
      "browser": "Safari 2.0",
      "platform": "OSX.4+",
      "version": "419.3",
      "grade": "A",
      "status": true
  },
  {
      "engine": "Webkit",
      "browser": "Safari 3.0",
      "platform": "OSX.4+",
      "version": "522.1",
      "grade": "A",
      "status": false
  },
  {
      "engine": "Webkit",
      "browser": "OmniWeb 5.5",
      "platform": "OSX.4+",
      "version": "420",
      "grade": "A",
      "status": true
  },
  {
      "engine": "Webkit",
      "browser": "iPod Touch / iPhone",
      "platform": "iPod",
      "version": "420.1",
      "grade": "A",
      "status": false
  },
  {
      "engine": "Webkit",
      "browser": "S60",
      "platform": "S60",
      "version": "413",
      "grade": "A",
      "status": true
  },
  {
      "engine": "Presto",
      "browser": "Opera 7.0",
      "platform": "Win 95+ / OSX.1+",
      "version": "-",
      "grade": "A",
      "status": false
  },
  {
      "engine": "Presto",
      "browser": "Opera 7.5",
      "platform": "Win 95+ / OSX.2+",
      "version": "-",
      "grade": "A",
      "status": true
  },
  {
      "engine": "Presto",
      "browser": "Opera 8.0",
      "platform": "Win 95+ / OSX.2+",
      "version": "-",
      "grade": "A",
      "status": false
  },
  {
      "engine": "Presto",
      "browser": "Opera 8.5",
      "platform": "Win 95+ / OSX.2+",
      "version": "-",
      "grade": "A",
      "status": true
  },
  {
      "engine": "Presto",
      "browser": "Opera 9.0",
      "platform": "Win 95+ / OSX.3+",
      "version": "-",
      "grade": "A",
      "status": false
  },
  {
      "engine": "Presto",
      "browser": "Opera 9.2",
      "platform": "Win 88+ / OSX.3+",
      "version": "-",
      "grade": "A",
      "status": true
  },
  {
      "engine": "Presto",
      "browser": "Opera 9.5",
      "platform": "Win 88+ / OSX.3+",
      "version": "-",
      "grade": "A",
      "status": false
  },
  {
      "engine": "Presto",
      "browser": "Opera for Wii",
      "platform": "Wii",
      "version": "-",
      "grade": "A",
      "status": true
  },
  {
      "engine": "Presto",
      "browser": "Nokia N800",
      "platform": "N800",
      "version": "-",
      "grade": "A",
      "status": false
  },
  {
      "engine": "Presto",
      "browser": "Nintendo DS browser",
      "platform": "Nintendo DS",
      "version": "8.5",
      "grade": "C",
      "status": true
  },
  {
      "engine": "KHTML",
      "browser": "Konqureror 3.1",
      "platform": "KDE 3.1",
      "version": "3.1",
      "grade": "C",
      "status": false
  },
  {
      "engine": "KHTML",
      "browser": "Konqureror 3.3",
      "platform": "KDE 3.3",
      "version": "3.3",
      "grade": "A",
      "status": true
  },
  {
      "engine": "KHTML",
      "browser": "Konqureror 3.5",
      "platform": "KDE 3.5",
      "version": "3.5",
      "grade": "A",
      "status": false
  },
  {
      "engine": "Tasman",
      "browser": "Internet Explorer 4.5",
      "platform": "Mac OS 8-9",
      "version": "-",
      "grade": "X",
      "status": true
  },
  {
      "engine": "Tasman",
      "browser": "Internet Explorer 5.1",
      "platform": "Mac OS 7.6-9",
      "version": "1",
      "grade": "C",
      "status": false
  },
  {
      "engine": "Tasman",
      "browser": "Internet Explorer 5.2",
      "platform": "Mac OS 8-X",
      "version": "1",
      "grade": "C",
      "status": true
  },
  {
      "engine": "Misc",
      "browser": "NetFront 3.1",
      "platform": "Embedded devices",
      "version": "-",
      "grade": "C",
      "status": false
  },
  {
      "engine": "Misc",
      "browser": "NetFront 3.4",
      "platform": "Embedded devices",
      "version": "-",
      "grade": "A",
      "status": true
  },
  {
      "engine": "Misc",
      "browser": "Dillo 0.8",
      "platform": "Embedded devices",
      "version": "-",
      "grade": "X",
      "status": false
  },
  {
      "engine": "Misc",
      "browser": "Links",
      "platform": "Text only",
      "version": "-",
      "grade": "X",
      "status": true
  },
  {
      "engine": "Misc",
      "browser": "Lynx",
      "platform": "Text only",
      "version": "-",
      "grade": "X",
      "status": false
  },
  {
      "engine": "Misc",
      "browser": "IE Mobile",
      "platform": "Windows Mobile 6",
      "version": "-",
      "grade": "C",
      "status": true
  },
  {
      "engine": "Misc",
      "browser": "PSP browser",
      "platform": "PSP",
      "version": "-",
      "grade": "C",
      "status": false
  },
  {
      "engine": "Other browsers",
      "browser": "All others",
      "platform": "-",
      "version": "-",
      "grade": "U",
      "status": true
  }
].map(function (item, index) {
  return Object.assign({}, item, {
    id: index + 1
  });
});
