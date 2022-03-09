const wizardSchema = {
  type: 'wizard',
  initApi: '/api/mock2/form/initForm',
  steps: [
    {
      title: '第一步',
      body: [
        {
          name: 'website',
          label: '网址',
          type: 'input-url',
          required: true
        },
        {
          name: 'email',
          label: '邮箱',
          type: 'input-email',
          required: true
        }
      ],
      api: '/api/mock2/form/saveForm?waitSeconds=2'
    },
    {
      title: '第二步',
      body: [
        {
          name: 'defaultEmail',
          type: 'input-email',
          label: 'Email',
          value: 'test@test.com'
        },
        {
          type: 'input-text',
          name: 'name'
        }
      ],
      initApi: '/api/mock2/form/initForm',
      api: '/api/mock2/form/saveForm?waitSeconds=2'
    },
    {
      title: '确定',
      body: ['最后一步了，确认要提交吗？'],
      api: '/api/mock2/form/saveForm?waitSeconds=2'
    }
  ]
}

function generateEventAcions(events) {
  const onEvent = {};
  events.forEach(event => {
    onEvent[event] = {
      actions: [{
        actionType: 'toast',
        msgType: 'info',
        msg: `派发 ${event} 事件`
      }]
    }
  });

  return onEvent;
}

function generateActions(actions) {
  return actions.map(action => ({
    name: `wizard-${action.actionName}`,
    type: "button",
    label: action.label,
    level: actions.level || 'primary',
    className: 'mr-3 mb-3',
    onEvent: {
      click: {
        actions: [
          {
            actionType: action.actionName,
            componentId: 'wizard-receiver',
            description: action.label,
            args: action.actionValue
          }
        ]
      }
    }
  }))
}

export default {
  type: 'page',
  title: '向导组件事件',
  regions: ['body', 'toolbar', 'header'],
  body: [
    ...generateActions([
      {
        actionName: 'prev',
        label: '跳转上一步'
      },
      {
        actionName: 'next',
        label: '跳转下一步'
      },
      {
        actionName: 'goto-step',
        label: '跳转第三步',
        actionValue: {
          step: 3
        }
      },
      {
        actionName: 'step-submit',
        label: '本步骤提交'
      },
      {
        actionName: 'submit',
        label: '全部提交'
      }
    ]),

    {
      name: 'wizard',
      id: 'wizard-receiver',
      ...wizardSchema,
      onEvent: generateEventAcions([
        'inited',
        'change',
        'stepChange',
        'finished',
        'submitSucc',
        'submitFail',
        'stepSubmitSucc',
        'stepSubmitFail'
      ])
    }
  ]
};
