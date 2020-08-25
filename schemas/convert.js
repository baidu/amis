// page SubRenderer 类型
(function() {
    const renderers = [
        'https://houtai.baidu.com/v2/schemas/action.json#',
        'https://houtai.baidu.com/v2/schemas/button-group.json#',
        'https://houtai.baidu.com/v2/schemas/cards.json#',
        'https://houtai.baidu.com/v2/schemas/chart.json#',
        'https://houtai.baidu.com/v2/schemas/collapse.json#',
        'https://houtai.baidu.com/v2/schemas/divider.json#',
        'https://houtai.baidu.com/v2/schemas/crud.json#',
        'https://houtai.baidu.com/v2/schemas/date.json#',
        // 'https://houtai.baidu.com/v2/schemas/dialog.json#',
        // 'https://houtai.baidu.com/v2/schemas/drawer.json#',
        'https://houtai.baidu.com/v2/schemas/dropdown-button.json#',
        'https://houtai.baidu.com/v2/schemas/form.json#',
        'https://houtai.baidu.com/v2/schemas/grid.json#',
        'https://houtai.baidu.com/v2/schemas/hbox.json#',
        'https://houtai.baidu.com/v2/schemas/iframe.json#',
        'https://houtai.baidu.com/v2/schemas/image.json#',
        'https://houtai.baidu.com/v2/schemas/json.json#',
        'https://houtai.baidu.com/v2/schemas/list.json#',
        'https://houtai.baidu.com/v2/schemas/mapping.json#',
        'https://houtai.baidu.com/v2/schemas/nav.json#',
        'https://houtai.baidu.com/v2/schemas/operation.json#',
        // 自己不能放在其他地方 'https://houtai.baidu.com/v2/schemas/page.json#',
        'https://houtai.baidu.com/v2/schemas/panel.json#',
        'https://houtai.baidu.com/v2/schemas/plain.json#',
        'https://houtai.baidu.com/v2/schemas/progress.json#',
        'https://houtai.baidu.com/v2/schemas/service.json#',
        'https://houtai.baidu.com/v2/schemas/status.json#',
        'https://houtai.baidu.com/v2/schemas/switch.json#',
        'https://houtai.baidu.com/v2/schemas/table.json#',
        'https://houtai.baidu.com/v2/schemas/tabs.json#',
        'https://houtai.baidu.com/v2/schemas/tasks.json#',
        'https://houtai.baidu.com/v2/schemas/tpl.json#',
        'https://houtai.baidu.com/v2/schemas/video.json#',
        'https://houtai.baidu.com/v2/schemas/wizard.json#',
        'https://houtai.baidu.com/v2/schemas/wrapper.json#',
        'https://houtai.baidu.com/v2/schemas/page.json#/definitions/customRenderer'
    ];
    
    const root = {};
    let last = renderers.pop();
    let current = root;

    while(renderers.length) {
        const renderer = renderers.shift().replace(/#$/, '');

        current.if = {
            '$ref': `${renderer}#/definitions/test`
        };

        current.then = {
            '$ref': `${renderer}#/definitions/common`
        };

        current = current.else = {};
    }

    current['$ref'] = last;

    console.log(JSON.stringify(root, null, 4));
})();

// Cards 里面 field 类型
(function() {
    const renderers = [
        'https://houtai.baidu.com/v2/schemas/tpl.json#',
        'https://houtai.baidu.com/v2/schemas/image.json#',
        'https://houtai.baidu.com/v2/schemas/date.json#',
        'https://houtai.baidu.com/v2/schemas/status.json#',
        'https://houtai.baidu.com/v2/schemas/mapping.json#',
        'https://houtai.baidu.com/v2/schemas/progress.json#',
        'https://houtai.baidu.com/v2/schemas/switch.json#',
        'https://houtai.baidu.com/v2/schemas/hbox.json#',
        'https://houtai.baidu.com/v2/schemas/grid.json#',
        'https://houtai.baidu.com/v2/schemas/json.json#',
        'https://houtai.baidu.com/v2/schemas/list.json#',
        'https://houtai.baidu.com/v2/schemas/operation.json#',
        'https://houtai.baidu.com/v2/schemas/plain.json#'
    ];
    
    const root = {};
    let last = renderers.pop().replace(/#$/, '');
    let current = root;

    while(renderers.length) {
        const renderer = renderers.shift().replace(/#$/, '');

        current.if = {
            '$ref': `${renderer}#/definitions/test`
        };

        current.then = {
            '$ref': `${renderer}#/definitions/common`
        };

        current = current.else = {};
    }

    current['$ref'] = `${last}#/definitions/common`;

    console.log(JSON.stringify(root, null, 4));
})();


// Control 里面各种类型
(function() {
    const renderers = [
        'https://houtai.baidu.com/v2/schemas/form/array.json#',
        'https://houtai.baidu.com/v2/schemas/form/button-group.json#',
        'https://houtai.baidu.com/v2/schemas/form/button-toolbar.json#',
        'https://houtai.baidu.com/v2/schemas/form/button.json#',
        'https://houtai.baidu.com/v2/schemas/form/chained-select.json#',
        'https://houtai.baidu.com/v2/schemas/form/checkbox.json#',
        'https://houtai.baidu.com/v2/schemas/form/checkboxes.json#',
        'https://houtai.baidu.com/v2/schemas/form/color.json#',
        'https://houtai.baidu.com/v2/schemas/form/combo.json#',
        'https://houtai.baidu.com/v2/schemas/form/control.json#',
        'https://houtai.baidu.com/v2/schemas/form/date-range.json#',
        'https://houtai.baidu.com/v2/schemas/form/date.json#',
        'https://houtai.baidu.com/v2/schemas/form/datetime.json#',
        'https://houtai.baidu.com/v2/schemas/form/editor.json#',
        'https://houtai.baidu.com/v2/schemas/form/email.json#',
        'https://houtai.baidu.com/v2/schemas/form/fieldSet.json#',
        'https://houtai.baidu.com/v2/schemas/form/file.json#',
        'https://houtai.baidu.com/v2/schemas/form/formula.json#',
        'https://houtai.baidu.com/v2/schemas/form/grid.json#',
        'https://houtai.baidu.com/v2/schemas/form/group.json#',
        'https://houtai.baidu.com/v2/schemas/form/hbox.json#',
        'https://houtai.baidu.com/v2/schemas/form/hidden.json#',
        'https://houtai.baidu.com/v2/schemas/form/image.json#',
        'https://houtai.baidu.com/v2/schemas/form/list.json#',
        'https://houtai.baidu.com/v2/schemas/form/matrix.json#',
        'https://houtai.baidu.com/v2/schemas/form/number.json#',
        'https://houtai.baidu.com/v2/schemas/form/tag.json#',
        'https://houtai.baidu.com/v2/schemas/form/panel.json#',
        'https://houtai.baidu.com/v2/schemas/form/password.json#',
        'https://houtai.baidu.com/v2/schemas/form/picker.json#',
        'https://houtai.baidu.com/v2/schemas/form/radios.json#',
        'https://houtai.baidu.com/v2/schemas/form/range.json#',
        'https://houtai.baidu.com/v2/schemas/form/repeat.json#',
        'https://houtai.baidu.com/v2/schemas/form/reset.json#',
        'https://houtai.baidu.com/v2/schemas/form/rich-text.json#',
        'https://houtai.baidu.com/v2/schemas/form/select.json#',
        'https://houtai.baidu.com/v2/schemas/form/service.json#',
        'https://houtai.baidu.com/v2/schemas/form/static.json#',
        'https://houtai.baidu.com/v2/schemas/form/sub-form.json#',
        'https://houtai.baidu.com/v2/schemas/form/submit.json#',
        'https://houtai.baidu.com/v2/schemas/form/switch.json#',
        'https://houtai.baidu.com/v2/schemas/form/table.json#',
        'https://houtai.baidu.com/v2/schemas/form/tabs.json#',
        'https://houtai.baidu.com/v2/schemas/form/text.json#',
        'https://houtai.baidu.com/v2/schemas/form/textarea.json#',
        'https://houtai.baidu.com/v2/schemas/form/time.json#',
        'https://houtai.baidu.com/v2/schemas/form/tree-select.json#',
        'https://houtai.baidu.com/v2/schemas/form/tree.json#',
        'https://houtai.baidu.com/v2/schemas/form/url.json#',

        // 其他 renderers
        'https://houtai.baidu.com/v2/schemas/divider.json#',
        'https://houtai.baidu.com/v2/schemas/cards.json#',
        'https://houtai.baidu.com/v2/schemas/chart.json#',
        'https://houtai.baidu.com/v2/schemas/collapse.json#',
        'https://houtai.baidu.com/v2/schemas/crud.json#',
        'https://houtai.baidu.com/v2/schemas/iframe.json#',
        'https://houtai.baidu.com/v2/schemas/nav.json#',
        'https://houtai.baidu.com/v2/schemas/tasks.json#',
        'https://houtai.baidu.com/v2/schemas/video.json#',
        'https://houtai.baidu.com/v2/schemas/wrapper.json#',

        'https://houtai.baidu.com/v2/schemas/form.json#/definitions/customControlItem'
    ];
    
    const root = {};
    let last = renderers.pop().replace(/#$/, '');
    let current = root;

    while(renderers.length) {
        const renderer = renderers.shift().replace(/#$/, '');

        current.if = {
            '$ref': `${renderer}#/definitions/test`
        };

        current.then = {
            '$ref': `${renderer}#/definitions/common`
        };

        current = current.else = {};
    }

    current['$ref'] = `${last}`;

    console.log(JSON.stringify(root, null, 4));
})();