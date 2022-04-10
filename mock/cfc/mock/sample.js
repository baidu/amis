const DB = require('./sample.db.js');

module.exports = function (req, res) {
  const pathname = (req.originalUrl || req.url).replace(
    /^\/(api\/mock2|api)\/|\?.*$/g,
    ''
  );

  if (
    pathname === 'sample' &&
    (req.method === 'POST' || req.method === 'PUT')
  ) {
    return store(req, res);
  } else if (/sample\/(\d+(?:,\d+)*)?$/.test(pathname)) {
    if (req.method === 'POST' || req.method === 'PUT') {
      return update(req, res, RegExp.$1);
    } else if (req.method === 'DELETE') {
      return del(req, res, RegExp.$1);
    } else if (req.method === 'GET') {
      return show(req, res, RegExp.$1);
    }
  } else if (pathname === 'sample/bulkUpdate') {
    return bulkUpdate(req, res);
  } else if (pathname === 'sample/bulkUpdate2') {
    return bulkUpdate2(req, res);
  } else if (pathname === 'sample/mirror') {
    return mirror(req, res);
  } else if (pathname === 'sample/array') {
    return res.json(DB.concat());
  } else if (pathname === 'sample/itemsHasAnother') {
    return res.json({myItems: DB.concat()});
  } else if (pathname === 'sample/arrayInData') {
    return res.json({data: DB.concat()});
  }

  return index(req, res);
};

function index(req, res) {
  const perPage = parseInt(req.query.perPage, 10);
  const page = req.query.page || 1;
  let items = DB.concat();

  // 制造点随机内容不然还以为没刷新
  items = items.map(item => {
    return {
      ...item,
      engine: item.engine + ' - ' + Math.random().toString(36).substring(7)
    };
  });

  if (req.query.keywords && !req.query.loadDataOnce) {
    const keywords = req.query.keywords;
    items = items.filter(function (item) {
      return ~JSON.stringify(item).indexOf(keywords);
    });
  }

  if (req.query.engine && !req.query.loadDataOnce) {
    const keywords = req.query.engine;
    items = items.filter(function (item) {
      return ~JSON.stringify(item.engine).indexOf(keywords);
    });
  }

  if (req.query.orderBy && !req.query.loadDataOnce) {
    const field = req.query.orderBy;
    const direction = req.query.orderDir === 'desc' ? -1 : 1;
    items = items.sort(function (a, b) {
      a = String(a[field]);
      b = String(b[field]);

      if (/^\d+$/.test(a) && /^\d+$/.test(b)) {
        a = parseInt(a, 10);
        b = parseInt(b, 10);
        return (a > b ? 1 : a < b ? -1 : 0) * direction;
      }

      return a.localeCompare(b) * direction;
    });
  }

  let response = () =>
    res.json({
      status: 0,
      msg: 'ok',
      data: {
        count: items.length,
        rows: perPage
          ? items.splice((page - 1) * perPage, perPage)
          : items.concat()
      }
    });

  if (req.query.waitSeconds) {
    return setTimeout(response, parseInt(req.query.waitSeconds, 10) * 1000);
  }

  return response();
}

function store(req, res) {
  const data = Object.assign({}, req.body);

  data.id = DB.length ? DB[DB.length - 1].id + 1 : 1;

  DB.push(data);

  return res.json({
    status: 0,
    msg: '新增成功'
  });
}

function show(req, res, id) {
  const idx = DB.findIndex(function (item) {
    return item.id == id;
  });

  if (!~idx) {
    return res.json({
      status: 404,
      msg: '保存失败，数据可能已被删除！'
    });
  }

  const item = Object.assign({}, DB[idx], req.body);
  res.json({
    status: 0,
    data: item
  });
}

function update(req, res, id) {
  const ids = id.split(',');

  if (
    !ids.every(function (id) {
      const idx = DB.findIndex(function (item) {
        return item.id == id;
      });

      if (!~idx) {
        return false;
      }

      const item = Object.assign({}, DB[idx], req.body);
      item.id = id;
      DB.splice(idx, 1, item);
      return true;
    })
  ) {
    return res.json({
      status: 404,
      msg: '保存失败，数据可能已被删除！'
    });
  }

  return res.json({
    status: 0,
    msg: '保存成功'
  });
}

function del(req, res, id) {
  const ids = id.split(',');
  console.log(ids);

  if (
    !ids.every(function (id) {
      const idx = DB.findIndex(function (item) {
        return item.id == id;
      });

      if (!~idx) {
        return false;
      }

      DB.splice(idx, 1);
      return true;
    })
  ) {
    return res.json({
      status: 404,
      msg: '保存失败，数据可能已被删除！'
    });
  }

  return res.json({
    status: 0,
    msg: '删除成功'
  });
}

function bulkUpdate(req, res) {
  const rowDiff = req.body.rowsDiff;
  const ids = req.body.ids ? req.body.ids.split(',') : [];
  if (
    !ids.length ||
    !ids.every(function (id, index) {
      const idx = DB.findIndex(function (item) {
        return item.id == id;
      });

      if (!~idx) {
        return false;
      }

      const item = Object.assign({}, DB[idx], rowDiff[index]);
      item.id = id;
      DB.splice(idx, 1, item);
      return true;
    })
  ) {
    return res.json({
      status: 404,
      msg: '保存失败，数据可能已被删除！'
    });
  }

  return res.json({
    status: 0,
    msg: '保存成功'
  });
}

function bulkUpdate2(req, res) {
  const data = Object.assign({}, req.body);

  delete data.ids;

  const ids = req.body.ids ? req.body.ids.split(',') : [];
  if (
    !ids.length ||
    !ids.every(function (id, index) {
      const idx = DB.findIndex(function (item) {
        return item.id == id;
      });

      if (!~idx) {
        return false;
      }

      const item = Object.assign({}, DB[idx], data);
      item.id = id;
      DB.splice(idx, 1, item);
      return true;
    })
  ) {
    return res.json({
      status: 404,
      msg: '保存失败，数据可能已被删除！'
    });
  }

  return res.json({
    status: 0,
    msg: '保存成功'
  });
}

// 方便前端模拟任意数据
function mirror(req, res) {
  const json = JSON.parse(req.query.json);
  console.log('mirror', json);
  if ('status' in json) {
    return res.json(json);
  } else {
    return res.json({
      status: 0,
      data: json
    });
  }
}
