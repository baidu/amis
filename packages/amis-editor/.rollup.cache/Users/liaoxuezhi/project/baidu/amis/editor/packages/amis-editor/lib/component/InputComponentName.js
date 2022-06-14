import { useEffect, useState } from 'react';
export function InputComponentName(props) {
    var value = props.value, onChange = props.onChange, render = props.render, name = props.name, node = props.node;
    var _a = useState([]), options = _a[0], setOptions = _a[1];
    useEffect(function () {
        var thisComp = node === null || node === void 0 ? void 0 : node.getComponent();
        var scoped = thisComp === null || thisComp === void 0 ? void 0 : thisComp.context;
        var comps = [];
        while (scoped === null || scoped === void 0 ? void 0 : scoped.getComponents) {
            scoped.getComponents().forEach(function (c) {
                if (c.props.name && c !== thisComp) {
                    // todo 把孩子节点拼装成 xxx.xxx
                    comps.push(c.props.name);
                }
            });
            scoped = scoped.parent;
        }
        setOptions(comps);
    }, [node]);
    function onInnerChange(value) {
        onChange(value);
        return false;
    }
    return render('inner', {
        type: 'input-text',
        name: name
    }, {
        value: value,
        onChange: onInnerChange,
        options: options
    });
}
