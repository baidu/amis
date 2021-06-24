/** @license amis v@version
 *
 * Copyright Baidu
 *
 * This source code is licensed under the Apache license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function (global) {
  var require, define;
  var amis = window.amis || {};
  // 避免重复加载而导致已定义模块丢失
  if (amis.require) {
    return;
  }

  var head = document.getElementsByTagName('head')[0];
  var loadingMap = {};
  var factoryMap = {};
  var modulesMap = {};
  var scriptsMap = {};
  var resMap = {};
  var pkgMap = {};

  var createScripts = function (queues, onerror) {
    var docFrag = document.createDocumentFragment();

    for (var i = 0, len = queues.length; i < len; i++) {
      var id = queues[i].id;
      var url = queues[i].url;

      if (url in scriptsMap) {
        continue;
      }

      scriptsMap[url] = true;

      var script = document.createElement('script');
      if (onerror) {
        (function (script, id) {
          var tid = setTimeout(function () {
            onerror(id);
          }, require.timeout);

          script.onerror = function () {
            clearTimeout(tid);
            onerror(id);
          };

          var onload = function () {
            clearTimeout(tid);
          };

          if ('onload' in script) {
            script.onload = onload;
          } else {
            script.onreadystatechange = function () {
              if (
                this.readyState === 'loaded' ||
                this.readyState === 'complete'
              ) {
                onload();
              }
            };
          }
        })(script, id);
      }
      script.type = 'text/javascript';
      script.src = url;

      docFrag.appendChild(script);
    }

    head.appendChild(docFrag);
  };

  var loadScripts = function (ids, callback, onerror) {
    var queues = [];
    for (var i = 0, len = ids.length; i < len; i++) {
      var id = ids[i];
      var queue = loadingMap[id] || (loadingMap[id] = []);
      queue.push(callback);

      //
      // resource map query
      //
      var res = resMap[id] || resMap[id + '.js'] || {};
      var pkg = res.pkg;
      var url;

      if (pkg) {
        url = pkgMap[pkg].url || pkgMap[pkg].uri;
      } else {
        url = res.url || res.uri || id;
      }

      queues.push({
        id: id,
        url: url
      });
    }

    createScripts(queues, onerror);
  };

  var runQueue = function (id) {
    var queue = loadingMap[id];
    if (queue) {
      for (var i = 0, n = queue.length; i < n; i++) {
        queue[i]();
      }
      delete loadingMap[id];
    }
  };

  define = function (id, factory) {
    id = id.replace(/\.js$/i, '');
    factoryMap[id] = factory;

    if (~factory.toString().indexOf('__mod__async__load')) {
      var mod = {exports: {}};
      factoryMap[id] = {
        deffer: true,
        callbacks: [],
        loaded: false,
        load: function () {}
      };
      factory.apply(mod, [require, mod.exports, mod]);
      var load = mod.exports.__mod__async__load;
      factoryMap[id].load = function () {
        if (this.loaded) {
          return;
        }
        this.loaded = true;

        load(function (ret) {
          var callbacks = factoryMap[id].callbacks;
          factoryMap[id] = function () {
            return ret;
          };
          callbacks.forEach(function (fn) {
            fn();
          });
          runQueue(id);
        });
      };
      if (loadingMap[id] && loadingMap[id].length) {
        factoryMap[id].load();
      }
    } else {
      runQueue(id);
    }
  };

  require = function (id) {
    // compatible with require([dep, dep2...]) syntax.
    if (id && id.splice) {
      return require.async.apply(this, arguments);
    }

    id = require.alias(id);

    var mod = modulesMap[id];
    if (mod) {
      return mod.exports;
    }

    //
    // init module
    //
    var factory = factoryMap[id];
    if (!factory) {
      throw '[ModJS] Cannot find module `' + id + '`';
    }

    mod = modulesMap[id] = {
      exports: {}
    };

    //
    // factory: function OR value
    //
    var ret =
      typeof factory === 'function'
        ? factory.apply(mod, [require, mod.exports, mod])
        : factory;

    if (ret) {
      mod.exports = ret;
    }

    return mod.exports;
  };

  require.async = function (names, onload, onerror) {
    if (typeof names === 'string') {
      names = [names];
    }

    var needMap = {};
    var needNum = 0;
    var needLoad = [];

    function findNeed(depArr) {
      var child;

      for (var i = 0, n = depArr.length; i < n; i++) {
        //
        // skip loading or loaded
        //
        var dep = require.alias(depArr[i]);

        if (dep in needMap) {
          continue;
        }

        needMap[dep] = true;

        if (dep in factoryMap) {
          if (factoryMap[dep] && factoryMap[dep].deffer) {
            needNum++;
            factoryMap[dep].callbacks.push(updateNeed);
            factoryMap[dep].load();
          }

          // check whether loaded resource's deps is loaded or not
          child = resMap[dep] || resMap[dep + '.js'];
          if (child && 'deps' in child) {
            findNeed(child.deps);
          }
          continue;
        }

        needLoad.push(dep);
        needNum++;

        child = resMap[dep] || resMap[dep + '.js'];
        if (child && 'deps' in child) {
          findNeed(child.deps);
        }
      }
    }

    function updateNeed() {
      if (0 === needNum--) {
        var args = [];
        for (var i = 0, n = names.length; i < n; i++) {
          args[i] = require(names[i]);
        }

        onload && onload.apply(global, args);
      }
    }

    findNeed(names);
    loadScripts(needLoad, updateNeed, onerror);
    updateNeed();
  };

  require.ensure = function (names, callback) {
    require.async(names, function () {
      callback && callback.call(this, require);
    });
  };

  require.resourceMap = function (obj) {
    var k;
    var col;

    // merge `res` & `pkg` fields
    col = obj.res;
    for (k in col) {
      if (col.hasOwnProperty(k)) {
        resMap[k] = col[k];
      }
    }

    col = obj.pkg;
    for (k in col) {
      if (col.hasOwnProperty(k)) {
        pkgMap[k] = col[k];
      }
    }
  };

  require.loadJs = function (url) {
    if (url in scriptsMap) {
      return;
    }

    scriptsMap[url] = true;

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    head.appendChild(script);
    return script;
  };

  require.aliasMapping = {};
  require.alias = function (id) {
    id = require.aliasMapping[id] || id;
    return id.replace(/\.js$/i, '');
  };
  require.exists = function (id) {
    id = require.alias(id);
    return !!modulesMap[id];
  };

  require.timeout = 5000;

  amis.require = require;
  amis.define = define;
  window.amis = amis;
  // window.require = window.require || require;
})(this);
