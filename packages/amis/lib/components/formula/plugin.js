"use strict";
/**
 * @file 扩展 codemirror
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormulaPlugin = exports.editorFactory = void 0;
var helper_1 = require("../../utils/helper");
function editorFactory(dom, cm, props) {
    registerLaunguageMode(cm);
    return cm(dom, {
        value: props.value || '',
        autofocus: true,
        mode: props.evalMode ? 'text/formula' : 'text/formula-template'
    });
}
exports.editorFactory = editorFactory;
var FormulaPlugin = /** @class */ (function () {
    function FormulaPlugin(editor, cm, getProps) {
        this.editor = editor;
        this.cm = cm;
        this.getProps = getProps;
        // editor.on('change', this.autoMarkText);
        this.autoMarkText();
    }
    FormulaPlugin.prototype.autoMarkText = function () {
        var _a = this.getProps(), functions = _a.functions, variables = _a.variables, value = _a.value;
        if (value) {
            // todo functions 也需要自动替换
            this.autoMark(variables);
        }
    };
    // 计算 `${`、`}` 括号的位置，如 ${a}+${b}, 结果是 [ { from: 0, to: 3 }, { from: 5, to: 8 } ]
    FormulaPlugin.prototype.computedBracesPosition = function (exp) {
        var braces = [];
        exp === null || exp === void 0 ? void 0 : exp.replace(/\$\{/g, function (val, offset) {
            if (val) {
                var charArr = exp.slice(offset + val.length).split('');
                var cache = ['${'];
                for (var index = 0; index < charArr.length; index++) {
                    var char = charArr[index];
                    if (char === '$' && charArr[index + 1] === '{') {
                        cache.push('${');
                    }
                    else if (char === '}') {
                        cache.pop();
                    }
                    if (cache.length === 0) {
                        braces.push({ begin: offset + 2, end: index + offset + 2 });
                        break;
                    }
                }
            }
            return '';
        });
        return braces;
    };
    // 判断字符串是否在 ${} 中
    FormulaPlugin.prototype.checkStrIsInBraces = function (_a, braces) {
        var from = _a[0], to = _a[1];
        var isIn = false;
        if (braces.length) {
            for (var index = 0; index < braces.length; index++) {
                var brace = braces[index];
                if (from > brace.begin && to <= brace.end) {
                    isIn = true;
                    break;
                }
            }
        }
        return isIn;
    };
    FormulaPlugin.prototype.insertBraces = function (originFrom, originTo) {
        var str = this.editor.getValue();
        var braces = this.computedBracesPosition(str);
        if (!this.checkStrIsInBraces([originFrom.ch, originTo.ch], braces)) {
            this.editor.setCursor({
                line: originFrom.line,
                ch: originFrom.ch
            });
            this.editor.replaceSelection('${');
            this.editor.setCursor({
                line: originTo.line,
                ch: originTo.ch + 2
            });
            this.editor.replaceSelection('}');
        }
    };
    FormulaPlugin.prototype.insertContent = function (value, type) {
        var from = this.editor.getCursor();
        var evalMode = this.getProps().evalMode;
        if (type === 'variable') {
            this.editor.replaceSelection(value.key);
            var to = this.editor.getCursor();
            this.markText(from, to, value.name, 'cm-field');
            !evalMode && this.insertBraces(from, to);
        }
        else if (type === 'func') {
            this.editor.replaceSelection("".concat(value, "()"));
            var to = this.editor.getCursor();
            this.markText(from, {
                line: to.line,
                ch: to.ch - 2
            }, value, 'cm-func');
            this.editor.setCursor({
                line: to.line,
                ch: to.ch - 1
            });
            if (!evalMode) {
                this.insertBraces(from, to);
                this.editor.setCursor({
                    line: to.line,
                    ch: to.ch + 1
                });
            }
        }
        else if (typeof value === 'string') {
            this.editor.replaceSelection(value);
        }
        this.editor.focus();
    };
    FormulaPlugin.prototype.markText = function (from, to, label, className) {
        if (className === void 0) { className = 'cm-func'; }
        var text = document.createElement('span');
        text.className = className;
        text.innerText = label;
        this.editor.markText(from, to, {
            atomic: true,
            replacedWith: text
        });
    };
    FormulaPlugin.prototype.autoMark = function (variables) {
        var _this = this;
        if (!Array.isArray(variables) || !variables.length) {
            return;
        }
        var varMap = {};
        (0, helper_1.eachTree)(variables, function (item) {
            if (item.value) {
                var key = item.value;
                varMap[key] = item.label;
            }
        });
        var vars = Object.keys(varMap).sort(function (a, b) { return b.length - a.length; });
        var editor = this.editor;
        var lines = editor.lineCount();
        var _loop_1 = function (line) {
            var content = editor.getLine(line);
            // 标记方法调用
            content.replace(/([A-Z]+)\s*\(/g, function (_, func, pos) {
                _this.markText({
                    line: line,
                    ch: pos
                }, {
                    line: line,
                    ch: pos + func.length
                }, func, 'cm-func');
                return _;
            });
            // 标记变量
            vars.forEach(function (v) {
                var from = 0;
                var idx = -1;
                while (~(idx = content.indexOf(v, from))) {
                    _this.markText({
                        line: line,
                        ch: idx
                    }, {
                        line: line,
                        ch: idx + v.length
                    }, varMap[v], 'cm-field');
                    from = idx + v.length;
                }
            });
        };
        for (var line = 0; line < lines; line++) {
            _loop_1(line);
        }
    };
    FormulaPlugin.prototype.dispose = function () { };
    FormulaPlugin.prototype.validate = function () { };
    return FormulaPlugin;
}());
exports.FormulaPlugin = FormulaPlugin;
var modeRegisted = false;
function registerLaunguageMode(cm) {
    if (modeRegisted) {
        return;
    }
    modeRegisted = true;
    // 对应 evalMode
    cm.defineMode('formula', function (config, parserConfig) {
        var formula = cm.getMode(config, 'javascript');
        if (!parserConfig || !parserConfig.base)
            return formula;
        return cm.multiplexingMode(cm.getMode(config, parserConfig.base), {
            open: '${',
            close: '}',
            mode: formula
        });
    });
    cm.defineMIME('text/formula', { name: 'formula' });
    cm.defineMIME('text/formula-template', { name: 'formula', base: 'htmlmixed' });
}
//# sourceMappingURL=./components/formula/plugin.js.map
