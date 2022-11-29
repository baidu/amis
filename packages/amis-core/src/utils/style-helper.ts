import {PlainObject} from '../types';
import {uuid} from './helper';

const valueMap: PlainObject = {
  'marginTop': 'margin-top',
  'marginRight': 'margin-right',
  'marginBottom': 'margin-bottom',
  'marginLeft': 'margin-left',
  'paddingTop': 'padding-top',
  'paddingRight': 'padding-right',
  'paddingBottom': 'padding-bottom',
  'paddingLeft': 'padding-left',
  'top-border-width': 'border-top-width',
  'right-border-width': 'border-right-width',
  'bottom-border-width': 'border-bottom-width',
  'left-border-width': 'border-left-width',
  'top-border-style': 'border-top-style',
  'right-border-style': 'border-right-style',
  'bottom-border-style': 'border-bottom-style',
  'left-border-style': 'border-left-style',
  'top-border-color': 'border-top-color',
  'right-border-color': 'border-right-color',
  'bottom-border-color': 'border-bottom-color',
  'left-border-color': 'border-left-color',
  'fontSize': 'font-size',
  'fontWeight': 'font-weight',
  'lineHeight': 'line-height'
};

interface extra {
  pre?: string;
  suf?: string;
}

export function findOrCreactStyle(id: string) {
  let varStyleTag = document.getElementById(id);
  if (!varStyleTag) {
    varStyleTag = document.createElement('style');
    varStyleTag.id = id;
    document.body.appendChild(varStyleTag);
  }
  return varStyleTag;
}

export function insertStyle(style: string, id: string) {
  const varStyleTag = findOrCreactStyle(id);

  // bca-disable-line
  varStyleTag.innerHTML = style;
}

export function addStyle(style: string, id: string) {
  const varStyleTag = findOrCreactStyle(id);
  // bca-disable-line
  varStyleTag.innerHTML += style;
}

export function formatStyle(
  css: any,
  classNames: {
    key: string;
    value?: string;
    weights?: {
      default?: extra;
      hover?: extra;
      active?: extra;
      disabled?: extra;
    };
  }[],
  id?: string
) {
  if (!css) {
    return {value: '', origin: []};
  }
  const res = [];
  const status2string: PlainObject = {
    default: '',
    hover: ':hover',
    active: ':hover:active',
    disabled: '.is-disabled'
  };

  for (let item of classNames) {
    const body = css[item.key];
    const list = item.value?.split(' ');
    const classNameList: string[] = [];

    if (!body) {
      continue;
    }

    list?.forEach(n => {
      if (
        /(\S*[C|c]lassName-\S*)/.test(n) &&
        !!~n.indexOf(id?.replace('u:', '') || '')
      ) {
        classNameList.push(n);
      }
    });
    const weightsList: PlainObject = item.weights || {};

    for (let className of classNameList) {
      // 没有具体的样式，或者没有对应的classname
      const statusMap: PlainObject = {
        default: {},
        hover: {},
        active: {},
        disabled: {}
      };
      for (let key in body) {
        if (key === '$$id') {
          continue;
        }
        if (!!~key.indexOf(':default')) {
          statusMap.default[key.replace(':default', '')] = body[key];
        } else if (!!~key.indexOf(':hover')) {
          statusMap.hover[key.replace(':hover', '')] = body[key];
        } else if (!!~key.indexOf(':active')) {
          statusMap.active[key.replace(':active', '')] = body[key];
        } else if (!!~key.indexOf(':disabled')) {
          statusMap.disabled[key.replace(':disabled', '')] = body[key];
        } else {
          statusMap.default[key] = body[key];
        }
      }

      for (let status in statusMap) {
        const weights = weightsList[status];
        const styles: string[] = [];
        const fn = (key: string, value: string) => {
          key = valueMap[key] || key;
          styles.push(`${key}: ${value};`);
        };
        for (let key in statusMap[status]) {
          if (key === '$$id') {
            continue;
          }
          const style = statusMap[status][key];
          if (typeof style === 'object') {
            // 圆角特殊处理
            if (key === 'radius') {
              fn(
                'border-radius',
                [
                  style['top-left-border-radius'],
                  style['top-right-border-radius'],
                  style['bottom-right-border-radius'],
                  style['bottom-left-border-radius']
                ].join(' ')
              );
            } else {
              for (let k in style) {
                if (k === '$$id') {
                  continue;
                }
                const value = style[k];
                value && fn(k, value);
              }
            }
          } else {
            const value = style;
            value && fn(key, value);
          }
        }
        if (styles.length > 0) {
          const cx = (weights?.pre || '') + className + (weights?.suf || '');
          res.push({
            className: cx + status2string[status],
            content: `.${cx + status2string[status]} {\n  ${styles.join(
              '\n  '
            )}\n}`
          });
          if (['hover', 'active', 'disabled'].includes(status)) {
            res.push({
              className: cx + '.' + status,
              content: `.${cx}.${status} {\n  ${styles.join('\n  ')}\n}`
            });
          }
        }
      }
    }
  }
  return {
    value: res.map(n => n.content).join('\n'),
    origin: res
  };
}

export function insertCustomStyle(
  css: any,
  classNames: {
    key: string;
    value?: string;
    weights?: {
      default?: extra;
      hover?: extra;
      active?: extra;
      disabled?: extra;
    };
  }[],
  id?: string
) {
  if (!css) {
    return;
  }
  const {value} = formatStyle(css, classNames, id);
  insertStyle(value, id?.replace('u:', '') || uuid());
}
