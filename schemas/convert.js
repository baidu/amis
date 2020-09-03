// page SubRenderer 类型
(function () {
  const renderers = [
    '/schemas/action.json#',
    '/schemas/button-group.json#',
    '/schemas/cards.json#',
    '/schemas/chart.json#',
    '/schemas/collapse.json#',
    '/schemas/divider.json#',
    '/schemas/crud.json#',
    '/schemas/date.json#',
    // '/schemas/dialog.json#',
    // '/schemas/drawer.json#',
    '/schemas/dropdown-button.json#',
    '/schemas/form.json#',
    '/schemas/grid.json#',
    '/schemas/hbox.json#',
    '/schemas/iframe.json#',
    '/schemas/image.json#',
    '/schemas/json.json#',
    '/schemas/list.json#',
    '/schemas/mapping.json#',
    '/schemas/nav.json#',
    '/schemas/operation.json#',
    // 自己不能放在其他地方 '/schemas/page.json#',
    '/schemas/panel.json#',
    '/schemas/plain.json#',
    '/schemas/progress.json#',
    '/schemas/service.json#',
    '/schemas/status.json#',
    '/schemas/switch.json#',
    '/schemas/table.json#',
    '/schemas/tabs.json#',
    '/schemas/tasks.json#',
    '/schemas/tpl.json#',
    '/schemas/video.json#',
    '/schemas/wizard.json#',
    '/schemas/wrapper.json#',
    '/schemas/page.json#/definitions/customRenderer'
  ];

  const root = {};
  let last = renderers.pop();
  let current = root;

  while (renderers.length) {
    const renderer = renderers.shift().replace(/#$/, '');

    current.if = {
      $ref: `${renderer}#/definitions/test`
    };

    current.then = {
      $ref: `${renderer}#/definitions/common`
    };

    current = current.else = {};
  }

  current['$ref'] = last;

  console.log(JSON.stringify(root, null, 4));
})();

// Cards 里面 field 类型
(function () {
  const renderers = [
    '/schemas/tpl.json#',
    '/schemas/image.json#',
    '/schemas/date.json#',
    '/schemas/status.json#',
    '/schemas/mapping.json#',
    '/schemas/progress.json#',
    '/schemas/switch.json#',
    '/schemas/hbox.json#',
    '/schemas/grid.json#',
    '/schemas/json.json#',
    '/schemas/list.json#',
    '/schemas/operation.json#',
    '/schemas/plain.json#'
  ];

  const root = {};
  let last = renderers.pop().replace(/#$/, '');
  let current = root;

  while (renderers.length) {
    const renderer = renderers.shift().replace(/#$/, '');

    current.if = {
      $ref: `${renderer}#/definitions/test`
    };

    current.then = {
      $ref: `${renderer}#/definitions/common`
    };

    current = current.else = {};
  }

  current['$ref'] = `${last}#/definitions/common`;

  console.log(JSON.stringify(root, null, 4));
})();

// Control 里面各种类型
(function () {
  const renderers = [
    '/schemas/form/array.json#',
    '/schemas/form/button-group.json#',
    '/schemas/form/button-toolbar.json#',
    '/schemas/form/button.json#',
    '/schemas/form/chained-select.json#',
    '/schemas/form/checkbox.json#',
    '/schemas/form/checkboxes.json#',
    '/schemas/form/color.json#',
    '/schemas/form/combo.json#',
    '/schemas/form/control.json#',
    '/schemas/form/date-range.json#',
    '/schemas/form/date.json#',
    '/schemas/form/datetime.json#',
    '/schemas/form/editor.json#',
    '/schemas/form/email.json#',
    '/schemas/form/fieldSet.json#',
    '/schemas/form/file.json#',
    '/schemas/form/formula.json#',
    '/schemas/form/grid.json#',
    '/schemas/form/group.json#',
    '/schemas/form/hbox.json#',
    '/schemas/form/hidden.json#',
    '/schemas/form/image.json#',
    '/schemas/form/list.json#',
    '/schemas/form/matrix.json#',
    '/schemas/form/number.json#',
    '/schemas/form/tag.json#',
    '/schemas/form/panel.json#',
    '/schemas/form/password.json#',
    '/schemas/form/picker.json#',
    '/schemas/form/radios.json#',
    '/schemas/form/range.json#',
    '/schemas/form/repeat.json#',
    '/schemas/form/reset.json#',
    '/schemas/form/rich-text.json#',
    '/schemas/form/select.json#',
    '/schemas/form/service.json#',
    '/schemas/form/static.json#',
    '/schemas/form/sub-form.json#',
    '/schemas/form/submit.json#',
    '/schemas/form/switch.json#',
    '/schemas/form/table.json#',
    '/schemas/form/tabs.json#',
    '/schemas/form/text.json#',
    '/schemas/form/textarea.json#',
    '/schemas/form/time.json#',
    '/schemas/form/tree-select.json#',
    '/schemas/form/tree.json#',
    '/schemas/form/url.json#',

    // 其他 renderers
    '/schemas/divider.json#',
    '/schemas/cards.json#',
    '/schemas/chart.json#',
    '/schemas/collapse.json#',
    '/schemas/crud.json#',
    '/schemas/iframe.json#',
    '/schemas/nav.json#',
    '/schemas/tasks.json#',
    '/schemas/video.json#',
    '/schemas/wrapper.json#',

    '/schemas/form.json#/definitions/customControlItem'
  ];

  const root = {};
  let last = renderers.pop().replace(/#$/, '');
  let current = root;

  while (renderers.length) {
    const renderer = renderers.shift().replace(/#$/, '');

    current.if = {
      $ref: `${renderer}#/definitions/test`
    };

    current.then = {
      $ref: `${renderer}#/definitions/common`
    };

    current = current.else = {};
  }

  current['$ref'] = `${last}`;

  console.log(JSON.stringify(root, null, 4));
})();
