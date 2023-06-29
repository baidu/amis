export const normalizeLink = (to: string, location = window.location) => {
  to = to || '';

  if (to && to[0] === '#') {
    to = location.pathname + location.search + to;
  } else if (to && to[0] === '?') {
    to = location.pathname + to;
  }

  const idx = to.indexOf('?');
  const idx2 = to.indexOf('#');
  let pathname = to;
  let search = '';
  let hash = location.hash;
  // host?a=a#b 的情况
  if (idx < idx2) {
    pathname = ~idx ? to.substring(0, idx) : ~idx2 ? to.substring(0, idx2) : to;
    hash = ~idx2 ? to.substring(idx2) : location.hash;
    search = ~idx ? to.substring(idx, ~idx2 ? idx2 : undefined) : '';
  }
  // host#b?a=a 的情况
  else if (idx > idx2) {
    pathname = ~idx2 ? to.substring(0, idx2) : ~idx ? to.substring(0, idx) : to;
    hash = ~idx2 ? to.substring(idx2, ~idx ? idx : undefined) : location.hash;
    search = ~idx ? to.substring(idx) : '';
  }

  if (!pathname) {
    pathname = location.pathname;
  } else if (pathname[0] != '/' && !/^https?\:\/\//.test(pathname)) {
    let relativeBase = location.pathname;
    const paths = relativeBase.split('/');
    paths.pop();
    let m;
    while ((m = /^\.\.?\//.exec(pathname))) {
      if (m[0] === '../') {
        paths.pop();
      }
      pathname = pathname.substring(m[0].length);
    }
    pathname = paths.concat(pathname).join('/');
  }

  const rest = idx < idx2 ? search + hash : hash + search;
  return pathname + rest;
};
