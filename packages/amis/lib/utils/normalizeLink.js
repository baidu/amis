"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeLink = void 0;
var normalizeLink = function (to, location) {
    if (location === void 0) { location = window.location; }
    to = to || '';
    if (to && to[0] === '#') {
        to = location.pathname + location.search + to;
    }
    else if (to && to[0] === '?') {
        to = location.pathname + to;
    }
    var idx = to.indexOf('?');
    var idx2 = to.indexOf('#');
    var pathname = ~idx
        ? to.substring(0, idx)
        : ~idx2
            ? to.substring(0, idx2)
            : to;
    var search = ~idx ? to.substring(idx, ~idx2 ? idx2 : undefined) : '';
    var hash = ~idx2 ? to.substring(idx2) : location.hash;
    if (!pathname) {
        pathname = location.pathname;
    }
    else if (pathname[0] != '/' && !/^https?\:\/\//.test(pathname)) {
        var relativeBase = location.pathname;
        var paths = relativeBase.split('/');
        paths.pop();
        var m = void 0;
        while ((m = /^\.\.?\//.exec(pathname))) {
            if (m[0] === '../') {
                paths.pop();
            }
            pathname = pathname.substring(m[0].length);
        }
        pathname = paths.concat(pathname).join('/');
    }
    return pathname + search + hash;
};
exports.normalizeLink = normalizeLink;
//# sourceMappingURL=./utils/normalizeLink.js.map
