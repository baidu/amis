/**
 * @file app 模式示例
 */

import APPSchema from './app';
import {createHashHistory} from 'history';
import {embed} from '../embed';

const history = createHashHistory({});

function normalizeLink(to, location = history.location) {
  to = to || '';

  if (to && to[0] === '#') {
    to = location.pathname + location.search + to;
  } else if (to && to[0] === '?') {
    to = location.pathname + to;
  }

  const idx = to.indexOf('?');
  const idx2 = to.indexOf('#');
  let pathname = ~idx
    ? to.substring(0, idx)
    : ~idx2
    ? to.substring(0, idx2)
    : to;
  let search = ~idx ? to.substring(idx, ~idx2 ? idx2 : undefined) : '';
  let hash = ~idx2 ? to.substring(idx2) : location.hash;

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

  return pathname + search + hash;
}

function isCurrentUrl(to, ctx) {
  if (!to) {
    return false;
  }
  const pathname = history.location.pathname;
  const link = normalizeLink(to, {
    ...location,
    pathname,
    hash: ''
  });

  if (!~link.indexOf('http') && ~link.indexOf(':')) {
    let strict = ctx && ctx.strict;
    return match(link, {
      decode: decodeURIComponent,
      strict: typeof strict !== 'undefined' ? strict : true
    })(pathname);
  }

  return decodeURI(pathname) === link;
}

const APPENV = {
  updateLocation: (location, replace) => {
    location = normalizeLink(location);
    if (location === 'goBack') {
      return history.goBack();
    } else if (
      (!/^https?\:\/\//.test(location) &&
        location === history.location.pathname + history.location.search) ||
      location === history.location.href
    ) {
      // 目标地址和当前地址一样，不处理，免得重复刷新
      return;
    } else if (/^https?\:\/\//.test(location) || !history) {
      return (window.location.href = location);
    }

    history[replace ? 'replace' : 'push'](location);
  },
  jumpTo: (to, action) => {
    if (to === 'goBack') {
      return history.goBack();
    }

    to = normalizeLink(to);

    if (isCurrentUrl(to)) {
      return;
    }

    if (action && action.actionType === 'url') {
      action.blank === false
        ? (window.location.href = to)
        : window.open(to, '_blank');
      return;
    } else if (action && action.blank) {
      window.open(to, '_blank');
      return;
    }

    if (/^https?:\/\//.test(to)) {
      window.location.href = to;
    } else if (
      (!/^https?\:\/\//.test(to) &&
        to === history.pathname + history.location.search) ||
      to === history.location.href
    ) {
      // do nothing
    } else {
      history.push(to);
    }
  },
  isCurrentUrl: isCurrentUrl
};

export function bootstrap(mountTo) {
  const amisInstance = embed(
    mountTo,
    APPSchema,
    {
      location: history.location
    },
    APPENV
  );

  history.listen(state => {
    amisInstance.updateProps({
      location: state.location || state
    });
  });
}
