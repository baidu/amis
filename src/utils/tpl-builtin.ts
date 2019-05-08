import { reigsterTplEnginer, filter } from "./tpl";
import * as moment from "moment";
import { PlainObject } from "../types";
import isPlainObject = require("lodash/isPlainObject");
import { createObject, isObject, setVariable } from "./helper";

const UNITS = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

export const prettyBytes = (num: number) => {
    if (!Number.isFinite(num)) {
        throw new TypeError(`Expected a finite number, got ${typeof num}: ${num}`);
    }

    const neg = num < 0;

    if (neg) {
        num = -num;
    }

    if (num < 1) {
        return (neg ? '-' : '') + num + ' B';
    }

    const exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), UNITS.length - 1);
    const numStr = Number((num / Math.pow(1000, exponent)).toPrecision(3));
    const unit = UNITS[exponent];

    return (neg ? '-' : '') + numStr + ' ' + unit;
}

const entityMap: {
    [propName: string]: string;
} = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "/": "&#x2F;"
};
export const escapeHtml = (str: string) =>
    String(str).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });

export function formatDuration(value: number): string {
    const unit = ["秒", "分", "时", "天", "月", "季", "年"];
    const steps = [1, 60, 3600, 86400, 2592000, 7776000, 31104000];
    let len = steps.length;
    const parts = [];

    while (len--) {
        if (steps[len] && value >= steps[len]) {
            parts.push(Math.round(value / steps[len]) + unit[len]);
            value %= steps[len];
        } else if (len === 0 && value) {
            parts.push((value.toFixed ? value.toFixed(2) : "0") + unit[0]);
        }
    }

    return parts.join("");
}

const timeUnitMap: {
    [propName: string]: string;
} = {
    'year': 'Y',
    'years': 'Y',
    'month': 'M',
    'months': 'M',
    'week': 'w',
    'weeks': 'w',
    'weekday': 'W',
    'day': 'd',
    'days': 'd',
    'hour': 'h',
    'hours': 'h',
    'minute': 'm',
    'minutes': 'm',
    'min': 'm',
    'mins': 'm',
}

export const relativeValueRe = /^(.+)?(\+|-)(\d+)(minute|minutes|min|mins|hours|hour|day|days|week|weeks|month|months|year|years|weekday)$/i;
export const filterDate = (
    value: string,
    data: object = {},
    format = "X"
): moment.Moment => {
    let m;

    if (typeof value === "string") {
        value = value.trim();
    }

    value = filter(value, data);

    if (value && typeof value === "string" && (m = relativeValueRe.exec(value))) {
        const date = new Date();
        const step = parseInt(m[3], 10);
        const from = m[1]
            ? filterDate(m[1], data, format)
            : moment(/minute|minutes|min|mins|hours|hour/.test(m[4])
                ? [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()]
                : [date.getFullYear(), date.getMonth(), date.getDate()]);

        return m[2] === "-"
            ? from.subtract(step, timeUnitMap[(m[4])] as moment.DurationInputArg2)
            : from.add(step, timeUnitMap[(m[4])] as moment.DurationInputArg2);
        //   return from[m[2] === '-' ? 'subtract' : 'add'](step, mapping[m[4]] || m[4]);
    } else if (value === "now") {
        return moment();
    } else if (value === "today") {
        const date = new Date();
        return moment([date.getFullYear(), date.getMonth(), date.getDate()]);
    } else {
        return moment(value, format);
    }
};

export const filters: {
    [propName: string]: (input: any, ...args: any[]) => any;
} = {
    html: (input: string) => escapeHtml(input),
    json: (input, tabSize: number | string = 2) =>
        tabSize
            ? JSON.stringify(input, null, parseInt(tabSize as string, 10))
            : JSON.stringify(input),
    toJson: input => {
        let ret;
        try {
            ret = JSON.parse(input);
        } catch (e) {
            ret = null;
        }
        return ret;
    },
    raw: input => input,
    date: (input, format = "LLL", inputFormat = "X") =>
        moment(input, inputFormat).format(format),
    number: input => String(input).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    trim: input => input.trim(),
    percent: (input, decimals = 0) => {
        input = parseFloat(input) || 0;
        decimals = parseInt(decimals, 10) || 0;

        let whole = input * 100;
        let multiplier = Math.pow(10, decimals);

        return (
            (Math.round(whole * multiplier) / multiplier).toFixed(decimals) + "%"
        );
    },
    duration: input => (input ? formatDuration(input) : input),
    bytes: input => (input ? prettyBytes(parseFloat(input)) : input),
    round: (input, decimals = 0) => {
        if (isNaN(input)) {
            return 0;
        }

        decimals = parseInt(decimals, 10) || 2;

        let multiplier = Math.pow(10, decimals);
        return (Math.round(input * multiplier) / multiplier).toFixed(decimals);
    },
    truncate: (input, length, end) => {
        end = end || "...";

        if (length == null) {
            return input;
        }

        length = parseInt(length, 10) || 200;

        return input.substring(0, length) + (input.length > length ? end : "");
    },
    url_encode: input => encodeURIComponent(input),
    url_decode: input => decodeURIComponent(input),
    default: (input, defaultValue) => input || (() => {
        try {
            if (defaultValue === 'undefined') {
                return undefined;
            }

            return JSON.parse(defaultValue);
        } catch (e) {
            return defaultValue;
        }
    })(),
    join: (input, glue) => (input && input.join ? input.join(glue) : input),
    split: (input, delimiter = ",") =>
        typeof input === "string" ? input.split(delimiter) : input,
    first: input => input && input[0],
    nth: (input, nth = 0) => input && input[nth],
    last: input => input && (input.length ? input[input.length - 1] : null),
    minus: (input, step = 1) => (parseInt(input, 10) || 0) - parseInt(step, 10),
    plus: (input, step = 1) => (parseInt(input, 10) || 0) + parseInt(step, 10),
    pick: (input, path = "&") =>
        Array.isArray(input) && !/^\d+$/.test(path)
            ? input.map(item => pickValues(path, item))
            : pickValues(path, input),
    pick_if_exist: (input, path = "&") =>
        Array.isArray(input)
            ? input.map(item => resolveVariable(path, item) || item)
            : resolveVariable(path, input) || input,
    str2date: function (input, inputFormat = "X", outputFormat = "X") {
        return input
            ? filterDate(input, this, inputFormat).format(outputFormat)
            : "";
    },
    asArray: input => (input ? [input] : input),
    filter: function (input, keys, exp) {
        let keywords: string;
        if (!Array.isArray(input) || !keys || !exp || !(keywords = resolveVariable(exp, this as any))) {
            return input;
        }

        keywords = keywords.toLowerCase();
        keys = keys.split(/\s*,\s*/);
        return input.filter((item: any) => keys.some((key: string) => ~String(resolveVariable(key, item)).toLowerCase().indexOf(keywords)));
    },
    base64Encode(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode(('0x' + p1) as any);
            }));
    },

    base64Decode(str) {
        return decodeURIComponent(atob(str).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    },

    lowerCase: input => input && typeof input === 'string' ? input.toLowerCase() : input,
    upperCase: input => input && typeof input === 'string' ? input.toUpperCase() : input,
};

export function registerFilter(
    name: string,
    fn: (input: any, ...args: any[]) => any
): void {
    filters[name] = fn;
}

export function pickValues(names:string, data:object) {
    let arr:Array<string>;
    if (!names || (arr = names.split(',')) && arr.length < 2) {
        let idx = names.indexOf('~');
        if (~idx) {
            let key = names.substring(0, idx);
            let target = names.substring(idx + 1);
            return {
                [key]: resolveVariable(target, data)
            }
        }
        return resolveVariable(names, data);
    }

    let ret:any = {};
    arr.forEach(name => {
        let idx = name.indexOf('~');
        let target = name;

        if (~idx) {
            target = name.substring(idx + 1);
            name = name.substring(0, idx);
        }

        setVariable(ret, name, resolveVariable(target, data));
    });
    return ret;
}

export const resolveVariable = (path: string, data: any = {}): any => {
    if (!path) {
        return undefined;
    }

    if (path === "$$") {
        return data;
    } else if (path[0] === "$") {
        path = path.substring(1);
    }

    if (!path) {
        return undefined;
    } else if (path === "&") {
        return data;
    }
    
    if (typeof data[path] !== "undefined") {
        return data[path];
    }
    
    let parts = path.replace(/^{|}$/g, "").split(".");
    return parts.reduce((data, path) => {
        if ((isObject(data) || Array.isArray(data)) && path in data) {
            return (data as { [propName: string]: any })[path];
        }

        return undefined;
    }, data);
};

export const resolveVariableAndFilter = (
    path: string,
    data: object = {},
    defaultFilter: string = "| html"
): any => {
    if (!path) {
        return undefined;
    }

    const m = /^(\\)?\$(?:([a-z0-9_.]+)|{([\s\S]+)})$/i.exec(path);

    if (!m) {
        return undefined;
    }

    const [_, escape, key, key2] = m;

    // 如果是转义如： `\$abc` => `$abc`
    if (escape) {
        return _.substring(1);
    }

    let finalKey: string = key || key2;

    // 先只支持一层吧
    finalKey = finalKey.replace(/(\\)?\$(?:([a-z0-9_.]+)|{([^}{]+)})/g, (_, escape) => {
        return escape ? _.substring(1) : resolveVariableAndFilter(_, data, defaultFilter);
    });

    // 默认 html 转义
    if (!~finalKey.indexOf("|")) {
        finalKey += defaultFilter;
    }

    let paths = finalKey.split(/\s*\|\s*/g);
    let originalKey = finalKey;
    finalKey = paths.shift() as string;

    let ret = resolveVariable(finalKey, data);

    return ret == null && !~originalKey.indexOf("default")
        ? ""
        : paths.reduce((input, filter) => {
            let params = filter
                .replace(/([^\\])\\([\:\\])/g, (_, affix, content) => `${affix}__${content === ':' ? 'colon' : 'slash'}__`)
                .split(":")
                .map(item => item.replace(/__(slash|colon)__/g, (_, type) => type === 'colon' ? ':' : '\\'));
            let key = params.shift() as string;

            return (filters[key] || filters.raw).call(data, input, ...params);
        }, ret);
};

export const tokenize = (str: string, data: object, defaultFilter: string = '| html') => {
    if (!str || typeof str !== 'string') {
        return str;
    }

    return str.replace(/(\\)?\$(?:([a-z0-9_\.]+|&)|{([^}{]+?)})/gi, (_, escape) =>
        escape ? _.substring(1) : resolveVariableAndFilter(_, data, defaultFilter)
    );
};

function resolveMapping(value: any, data: PlainObject) {
    return typeof value === "string" &&
        /^\$(?:([a-z0-9_.]+)|{[^}{]+})$/.test(value)
        ? resolveVariableAndFilter(value, data, '| raw')
        : typeof value === "string" && ~value.indexOf("$")
            ? tokenize(value, data, '| raw')
            : value;
}

export function dataMapping(to: PlainObject, from: PlainObject): object {
    let ret = {};

    Object.keys(to).forEach(key => {
        const value = to[key];
        let keys: Array<string>;

        if (key === "&" && value === "$$") {
            ret = {
                ...ret,
                ...from
            };
        } else if (key === "&") {
            const v = resolveMapping(value, from);

            if (Array.isArray(v) || typeof v === "string") {
                ret = v;
            } else if (typeof v === 'function') {
                ret = {
                    ...ret,
                    ...v(from)
                };
            } else {
                ret = {
                    ...ret,
                    ...v
                };
            }
        } else if (value === "$$") {
            (ret as PlainObject)[key] = from;
        } else if (value && value[0] === "$") {
            const v = resolveMapping(value, from);
            (ret as PlainObject)[key] = v;

            if (v === "__undefined") {
                delete (ret as PlainObject)[key];
            }
        } else if (
            isPlainObject(value) &&
            (keys = Object.keys(value)) &&
            keys.length === 1 &&
            from[keys[0].substring(1)] &&
            Array.isArray(from[keys[0].substring(1)])
        ) {
            // 支持只取数组中的部分值这个需求
            // 如:
            // data: {
            //   items: {
            //     '$rows': {
            //        id: '$id',
            //        forum_id: '$forum_id'
            //      }
            //   }
            // }
            const arr = from[keys[0].substring(1)];
            const mapping = value[keys[0]];

            (ret as PlainObject)[key] = arr.map((raw: object) => {
                let itemData = createObject(from, raw);
                let item: any = null;

                Object.keys(mapping).forEach(key => {
                    const value = mapping[key];

                    if (key === "&" && value === "$$") {
                        item = isPlainObject(item) ? item : {};
                        item = {
                            ...item,
                            itemData
                        };
                    } else if (key === "&") {
                        isPlainObject(item)
                            ? (item = { ...item, ...resolveMapping(value, itemData) })
                            : (item = resolveMapping(value, itemData));
                    } else {
                        item = isPlainObject(item) ? item : {};
                        item[key] = resolveMapping(value, itemData);
                    }
                });

                return item;
            });
        } else if (isPlainObject(value)) {
            (ret as PlainObject)[key] = dataMapping(value, from);
        } else if (Array.isArray(value)) {
            (ret as PlainObject)[key] = value.map((value: any) => isPlainObject(value) ? dataMapping(value, from) : resolveMapping(value, from));
        } else if (typeof value == "string" && ~value.indexOf("$")) {
            (ret as PlainObject)[key] = resolveMapping(value, from);
        } else if (typeof value === 'function') {
            (ret as PlainObject)[key] = value(from);
        } else {
            (ret as PlainObject)[key] = value;

            if (value === "__undefined") {
                delete (ret as PlainObject)[key];
            }
        }
    });

    return ret;
}

reigsterTplEnginer("builtin", {
    test: str => !!~str.indexOf("$"),
    compile: (str: string, data: object) => tokenize(str, data)
});
