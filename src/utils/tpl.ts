export interface Enginer {
    test: (tpl:string) => boolean;
    compile: (tpl:string, data:object) => string;
}

const enginers:{
    [propName:string] : Enginer;
} = {};

export function reigsterTplEnginer(name:string, enginer:Enginer) {
    enginers[name] = enginer;
}

export function filter(tpl: string, data: object = {}): string {
    if (!tpl || typeof tpl !== 'string') {
        return '';
    }

    let keys = Object.keys(enginers);
    for (let i = 0, len = keys.length; i < len; i++) {
        let enginer = enginers[keys[i]];
        if (enginer.test(tpl)) {
            return enginer.compile(tpl, data);
        }
    }

    return tpl;
}

export function evalExpression(expression: string, data?: object): boolean {
    /* jshint evil:true */
    try {
        const fn = new Function(
            "data",
            `with(data) {return !!(${expression});}`
        );
        data = data || {};
        return fn.call(data, data);
    } catch (e) {
        return false;
    }
}

export function evalJS(js: string, data: object): any {
    /* jshint evil:true */
    try {
        const fn = new Function(
            "data",
            `with(data) {${~js.indexOf('return') ? '' : 'return '}${js};}`
        );
        data = data || {};
        return fn.call(data, data);
    } catch (e) {
        return null;
    }
}
