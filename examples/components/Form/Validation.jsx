export default {
  title: '表单验证示例',
  toolbar: "<a target='_blank' href='/docs/renderers/Form/FormItem'>文档</a>",
  body: [
    {
      type: 'grid',
      columns: [
        {
          body: [
            {
              type: 'form',
              autoFocus: false,
              messages: {
                validateFailed: '请仔细检查表单规则，部分表单项没通过验证'
              },
              title: '表单',
              actions: [
                {
                  type: 'submit',
                  label: '提交'
                }
              ],
              api: '/api/mock2/form/saveFormFailed?waitSeconds=2',
              mode: 'horizontal',
              body: [
                {
                  type: 'input-text',
                  name: 'test',
                  label: '必填',
                  required: true
                },
                {
                  type: 'divider'
                },
                {
                  name: 'test1',
                  type: 'input-email',
                  label: 'Email'
                },
                {
                  type: 'divider'
                },
                {
                  name: 'url',
                  type: 'input-url',
                  label: 'URL'
                },
                {
                  type: 'divider'
                },
                {
                  name: 'num',
                  type: 'input-text',
                  label: '数字',
                  validations: 'isNumeric'
                },
                {
                  type: 'divider'
                },
                {
                  name: 'alpha',
                  type: 'input-text',
                  label: '字母或数字',
                  validations: 'isAlphanumeric'
                },
                {
                  type: 'divider'
                },
                {
                  name: 'int',
                  type: 'input-text',
                  label: '整形',
                  validations: 'isInt'
                },
                {
                  type: 'divider'
                },
                {
                  name: 'minLength',
                  type: 'input-text',
                  label: '长度限制',
                  validations: 'minLength:2,maxLength:10'
                },
                {
                  type: 'divider'
                },
                {
                  name: 'min',
                  type: 'input-text',
                  label: '数值限制',
                  validations: 'maximum:10,minimum:2'
                },
                {
                  type: 'divider'
                },
                {
                  name: 'reg',
                  type: 'input-text',
                  label: '正则',
                  validations: 'matchRegexp:/^abc/',
                  validationErrors: {
                    matchRegexp: '请输入abc开头的好么?'
                  }
                },
                {
                  type: 'divider'
                },
                {
                  name: 'test2',
                  type: 'input-text',
                  label: '服务端验证'
                }
              ]
            }
          ]
        },
        {
          body: [
            {
              type: 'form',
              name: 'form2',
              api: '/api/mock2/form/saveForm',
              debug: true,
              debugConfig: {
                levelExpand: 3
              },
              title: '<b>日期时间相关校验规则</b>',
              data: {
                datetime1: '2022-09-10 00:00:00',
                datetime2: '2022-10-01 00:00:00',
                datetime3: '2022-10-01 00:00:00',
                datetime4: '2022-10-01 00:00:01',
                datetime5: '2022-09-30 23:59:59',
                datetime6: '2022-09-30 23:59:59'
              },
              body: [
                {
                  type: 'input-datetime',
                  label: 'isDateTimeSame',
                  name: 'datetime1',
                  format: 'YYYY-MM-DD HH:mm:ss',
                  validations: {
                    isDateTimeSame: '2022-10-01 00:00:00'
                  }
                },
                {
                  type: 'divider'
                },
                {
                  type: 'input-datetime',
                  label: 'isDateTimeBefore',
                  name: 'datetime2',
                  format: 'YYYY-MM-DD HH:mm:ss',
                  validations: {
                    isDateTimeBefore: '2022-10-01 00:00:00'
                  }
                },
                {
                  type: 'divider'
                },
                {
                  type: 'input-datetime',
                  label: 'isDateTimeAfter',
                  name: 'datetime3',
                  format: 'YYYY-MM-DD HH:mm:ss',
                  validations: {
                    isDateTimeAfter: '2022-10-01 00:00:00'
                  }
                },
                {
                  type: 'divider'
                },
                {
                  type: 'input-datetime',
                  label: 'isDateTimeSameOrBefore',
                  name: 'datetime4',
                  format: 'YYYY-MM-DD HH:mm:ss',
                  validations: {
                    isDateTimeSameOrBefore: '2022-10-01 00:00:00'
                  }
                },
                {
                  type: 'divider'
                },
                {
                  type: 'input-datetime',
                  label: 'isDateTimeSameOrAfter',
                  name: 'datetime5',
                  format: 'YYYY-MM-DD HH:mm:ss',
                  validations: {
                    isDateTimeSameOrAfter: '2022-10-01 00:00:00'
                  }
                },
                {
                  type: 'divider'
                },
                {
                  type: 'input-datetime',
                  label: 'isDateTimeBetween',
                  name: 'datetime6',
                  format: 'YYYY-MM-DD HH:mm:ss',
                  validations: {
                    isDateTimeBetween: [
                      '2022-10-01 00:00:00',
                      '2022-10-03 00:00:00',
                      'second',
                      '[]'
                    ]
                  },
                  validationErrors: {
                    isDateTimeBetween:
                      '选择的日期有误，日期必须在 $1 ～ $2 范围内'
                  }
                }
              ]
            },
            {
              type: 'form',
              name: 'form3',
              api: '/api/mock2/form/saveForm',
              debug: true,
              debugConfig: {
                levelExpand: 3
              },
              title: '<b>日期时间相关校验规则（带变量）</b>',
              body: [
                {
                  type: 'input-datetime',
                  label: '开始日期时间',
                  name: 'startTime',
                  inputFormat: 'YYYY-MM-DD HH:mm:ss',
                  format: 'YYYY-MM-DD HH:mm:ss',
                  required: true,
                  validations: {
                    isDateTimeSameOrBefore: '${endTime}'
                  },
                  validationErrors: {
                    isDateTimeSameOrBefore:
                      '当前日期值不合法，开始时间不能大于结束时间'
                  }
                },
                {
                  type: 'input-datetime',
                  label: '结束日期时间',
                  name: 'endTime',
                  inputFormat: 'YYYY-MM-DD HH:mm:ss',
                  format: 'YYYY-MM-DD HH:mm:ss',
                  required: true
                }
              ]
            }
          ]
        },
        {
          body: [
            {
              type: 'form',
              name: 'form4',
              api: '/api/mock2/form/saveForm',
              debug: true,
              debugConfig: {
                levelExpand: 3
              },
              title: '<b>时间相关校验规则</b>',
              data: {
                time1: '16:00:00',
                time2: '16:00:00',
                time3: '16:00:00',
                time4: '16:00:01',
                time5: '16:00:01',
                time6: '15:00:01'
              },
              body: [
                {
                  type: 'input-time',
                  label: 'isTimeSame',
                  name: 'time1',
                  format: 'HH:mm:ss',
                  timeFormat: 'HH:mm:ss',
                  inputFormat: 'HH:mm:ss',
                  validations: {
                    isTimeSame: '16:00:01'
                  }
                },
                {
                  type: 'divider'
                },
                {
                  type: 'input-time',
                  label: 'isTimeBefore',
                  name: 'time2',
                  format: 'HH:mm:ss',
                  timeFormat: 'HH:mm:ss',
                  inputFormat: 'HH:mm:ss',
                  validations: {
                    isTimeBefore: '15:00:00'
                  }
                },
                {
                  type: 'divider'
                },
                {
                  type: 'input-time',
                  label: 'isTimeAfter',
                  name: 'time3',
                  format: 'HH:mm:ss',
                  timeFormat: 'HH:mm:ss',
                  inputFormat: 'HH:mm:ss',
                  validations: {
                    isTimeAfter: '16:00:30'
                  }
                },
                {
                  type: 'divider'
                },
                {
                  type: 'input-time',
                  label: 'isTimeSameOrBefore',
                  name: 'time4',
                  format: 'HH:mm:ss',
                  timeFormat: 'HH:mm:ss',
                  inputFormat: 'HH:mm:ss',
                  validations: {
                    isTimeSameOrBefore: '16:00:00'
                  }
                },
                {
                  type: 'divider'
                },
                {
                  type: 'input-time',
                  label: 'isTimeSameOrAfter',
                  name: 'time5',
                  format: 'HH:mm:ss',
                  timeFormat: 'HH:mm:ss',
                  inputFormat: 'HH:mm:ss',
                  validations: {
                    isTimeSameOrAfter: '16:30:00'
                  }
                },
                {
                  type: 'divider'
                },
                {
                  type: 'input-time',
                  label: 'isTimeBetween',
                  name: 'time6',
                  format: 'HH:mm:ss',
                  timeFormat: 'HH:mm:ss',
                  inputFormat: 'HH:mm:ss',
                  validations: {
                    isTimeBetween: ['03:00:00', '15:00:00', 'second', '[]']
                  },
                  validationErrors: {
                    isTimeBetween: '选择的时间有误，时间必须在 $1 ～ $2 范围内'
                  }
                }
              ]
            },
            {
              type: 'form',
              name: 'form5',
              api: '/api/mock2/form/saveForm',
              debug: true,
              debugConfig: {
                levelExpand: 3
              },
              title: '<b>时间相关校验规则（带变量）</b>',
              body: [
                {
                  type: 'input-time',
                  label: '开始时间',
                  name: 'startTime',
                  timeFormat: 'HH:mm:ss',
                  inputFormat: 'HH:mm:ss',
                  format: 'HH:mm:ss',
                  validations: {
                    isRequired: true,
                    isTimeSameOrBefore: '${endTime}'
                  },
                  validationErrors: {
                    isTimeSameOrBefore:
                      '当前时间值不合法，开始时间不能大于结束时间 $1'
                  }
                },
                {
                  type: 'input-time',
                  label: '结束时间',
                  name: 'endTime',
                  timeFormat: 'HH:mm:ss',
                  inputFormat: 'HH:mm:ss',
                  format: 'HH:mm:ss',
                  required: true
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
