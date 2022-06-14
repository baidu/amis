import { __assign, __spreadArray } from "tslib";
import { setSchemaTpl, isObject, defaultValue, getSchemaTpl } from 'amis-editor-core';
import { str2rules } from 'amis';
import find from 'lodash/find';
import reduce from 'lodash/reduce';
import forEach from 'lodash/forEach';
setSchemaTpl('validations', function () {
    var options = [
        // {
        //     label: '必填',
        //     value: 'isRequired'
        // },
        {
            label: '邮箱格式',
            value: 'isEmail'
        },
        {
            label: 'Url格式',
            value: 'isUrl'
        },
        {
            label: '数字',
            value: 'isNumeric'
        },
        {
            label: '字母',
            value: 'isAlpha'
        },
        {
            label: '字母和数字',
            value: 'isAlphanumeric'
        },
        {
            label: '整型数字',
            value: 'isInt'
        },
        {
            label: '浮点型数字',
            value: 'isFloat'
        },
        {
            label: '固定长度',
            value: 'isLength'
        },
        {
            label: '最大长度',
            value: 'maxLength'
        },
        {
            label: '最小长度',
            value: 'minLength'
        },
        {
            label: '最大值',
            value: 'maximum'
        },
        {
            label: '最小值',
            value: 'minimum'
        },
        {
            label: '手机号码',
            value: 'isPhoneNumber'
        },
        {
            label: '电话号码',
            value: 'isTelNumber'
        },
        {
            label: '邮编号码',
            value: 'isZipcode'
        },
        {
            label: '身份证号码',
            value: 'isId'
        },
        {
            label: 'JSON格式',
            value: 'isJson'
        },
        {
            label: '与指定值相同',
            value: 'equals'
        },
        {
            label: '与指定字段值相同',
            value: 'equalsField'
        },
        {
            label: '自定义正则',
            value: 'matchRegexp'
        },
        {
            label: '自定义正则2',
            value: 'matchRegexp1'
        },
        {
            label: '自定义正则3',
            value: 'matchRegexp2'
        },
        {
            label: '自定义正则4',
            value: 'matchRegexp3'
        },
        {
            label: '自定义正则5',
            value: 'matchRegexp4'
        }
    ];
    var trueProps = [
        'isEmail',
        'isUrl',
        'isNumeric',
        'isAlpha',
        'isAlphanumeric',
        'isInt',
        'isFloat',
        'isJson',
        'isPhoneNumber',
        'isTelNumber',
        'isZipcode',
        'isId'
    ];
    function firstValue(arr, iterator) {
        var theone = find(arr, iterator);
        return theone ? theone.value : '';
    }
    return {
        type: 'combo',
        syncDefaultValue: false,
        name: 'validations',
        label: '验证规则',
        addButtonText: '新增规则',
        multiple: true,
        pipeIn: function (value) {
            if (typeof value === 'string' && value) {
                value = str2rules(value);
            }
            if (!isObject(value)) {
                return value;
            }
            var arr = [];
            Object.keys(value).forEach(function (key) {
                var _a;
                if (/^\$\$/.test(key)) {
                    return;
                }
                arr.push((_a = {
                        type: key
                    },
                    _a[key] = Array.isArray(value[key]) ? value[key][0] : value[key],
                    _a));
            });
            return arr;
        },
        pipeOut: function (value) {
            if (!Array.isArray(value)) {
                return value;
            }
            var obj = {};
            value.forEach(function (item) {
                var key = item.type ||
                    firstValue(options, function (item) { return !obj[item.value]; }) ||
                    options[0].value;
                obj[key] = item[key] || (~trueProps.indexOf(key) ? true : '');
            });
            return obj;
        },
        items: [
            {
                type: 'select',
                unique: true,
                name: 'type',
                options: options,
                columnClassName: 'w-sm'
            },
            {
                type: 'input-number',
                name: 'isLength',
                visibleOn: 'data.type == "isLength"',
                placeholder: '设置长度',
                value: '1'
            },
            {
                type: 'input-number',
                name: 'maximum',
                visibleOn: 'data.type == "maximum"',
                placeholder: '设置最大值'
            },
            {
                type: 'input-number',
                name: 'minimum',
                visibleOn: 'data.type == "minimum"',
                placeholder: '设置最小值'
            },
            {
                type: 'input-number',
                name: 'maxLength',
                visibleOn: 'data.type == "maxLength"',
                placeholder: '设置最大长度值'
            },
            {
                type: 'input-number',
                name: 'minLength',
                visibleOn: 'data.type == "minLength"',
                placeholder: '设置最小长度值'
            },
            {
                type: 'input-text',
                name: 'equals',
                visibleOn: 'data.type == "equals"',
                placeholder: '设置值',
                value: ''
            },
            {
                type: 'input-text',
                name: 'equalsField',
                visibleOn: 'data.type == "equalsField"',
                placeholder: '设置字段名',
                value: ''
            },
            {
                type: 'input-text',
                name: 'matchRegexp',
                visibleOn: 'data.type == "matchRegexp"',
                placeholder: '设置正则规则'
            },
            {
                type: 'input-text',
                name: 'matchRegexp1',
                visibleOn: 'data.type == "matchRegexp1"',
                placeholder: '设置正则规则'
            },
            {
                type: 'input-text',
                name: 'matchRegexp2',
                visibleOn: 'data.type == "matchRegexp2"',
                placeholder: '设置正则规则'
            },
            {
                type: 'input-text',
                name: 'matchRegexp3',
                visibleOn: 'data.type == "matchRegexp3"',
                placeholder: '设置正则规则'
            },
            {
                type: 'input-text',
                name: 'matchRegexp4',
                visibleOn: 'data.type == "matchRegexp4"',
                placeholder: '设置正则规则'
            }
        ]
    };
});
setSchemaTpl('validationErrors', function () {
    var options = [
        // {
        //     label: '必填',
        //     value: 'isRequired'
        // },
        {
            label: '邮箱格式',
            value: 'isEmail'
        },
        {
            label: 'Url格式',
            value: 'isUrl'
        },
        {
            label: '数字',
            value: 'isNumeric'
        },
        {
            label: '字母',
            value: 'isAlpha'
        },
        {
            label: '字母和数字',
            value: 'isAlphanumeric'
        },
        {
            label: '整型数字',
            value: 'isInt'
        },
        {
            label: '浮点型数字',
            value: 'isFloat'
        },
        {
            label: '固定长度',
            value: 'isLength'
        },
        {
            label: '最大长度',
            value: 'maxLength'
        },
        {
            label: '最小长度',
            value: 'minLength'
        },
        {
            label: '最大值',
            value: 'maximum'
        },
        {
            label: '最小值',
            value: 'minimum'
        },
        {
            label: 'JSON格式',
            value: 'isJson'
        },
        {
            label: '手机号码',
            value: 'isPhoneNumber'
        },
        {
            label: '电话号码',
            value: 'isTelNumber'
        },
        {
            label: '邮编号码',
            value: 'isZipcode'
        },
        {
            label: '身份证号码',
            value: 'isId'
        },
        {
            label: '与指定值相同',
            value: 'equals'
        },
        {
            label: '与指定字段值相同',
            value: 'equalsField'
        },
        {
            label: '自定义正则',
            value: 'matchRegexp'
        },
        {
            label: '自定义正则2',
            value: 'matchRegexp1'
        },
        {
            label: '自定义正则3',
            value: 'matchRegexp2'
        },
        {
            label: '自定义正则4',
            value: 'matchRegexp3'
        },
        {
            label: '自定义正则5',
            value: 'matchRegexp4'
        }
    ];
    var defaultMessages = {
        isEmail: 'Email 格式不正确',
        isRequired: '这是必填项',
        isUrl: 'Url 格式不正确',
        isInt: '请输入整形数字',
        isAlpha: '请输入字母',
        isNumeric: '请输入数字',
        isAlphanumeric: '请输入字母或者数字',
        isFloat: '请输入浮点型数值',
        isWords: '请输入字母',
        isUrlPath: '只能输入字母、数字、`-` 和 `_`.',
        matchRegexp: '格式不正确, 请输入符合规则为 `$1` 的内容。',
        minLength: '请输入更多的内容，至少输入 $1 个字符。',
        maxLength: '请控制内容长度, 请不要输入 $1 个字符以上',
        maximum: '当前输入值超出最大值 $1，请检查',
        minimum: '当前输入值低于最小值 $1，请检查',
        isJson: '请检查 Json 格式。',
        isPhoneNumber: '请输入合法的手机号码',
        isTelNumber: '请输入合法的电话号码',
        isZipcode: '请输入合法的邮编地址',
        isId: '请输入合法的身份证号',
        isLength: '请输入长度为 $1 的内容',
        notEmptyString: '请不要全输入空白字符',
        equalsField: '输入的数据与 $1 值不一致',
        equals: '输入的数据与 $1 不一致'
    };
    function firstValue(arr, iterator) {
        var theone = find(arr, iterator);
        return theone ? theone.value : '';
    }
    return {
        type: 'combo',
        syncDefaultValue: false,
        name: 'validationErrors',
        label: '自定义验证提示',
        description: '自带提示不满足时，可以自定义。',
        addButtonText: '新增提示',
        multiple: true,
        pipeIn: function (value) {
            if (!isObject(value)) {
                return value;
            }
            var arr = [];
            Object.keys(value).forEach(function (key) {
                if (/^\$\$/.test(key)) {
                    return;
                }
                arr.push({
                    type: key,
                    msg: value[key]
                });
            });
            return arr;
        },
        pipeOut: function (value) {
            if (!Array.isArray(value)) {
                return value;
            }
            var obj = {};
            value.forEach(function (item) {
                var key = item.type ||
                    firstValue(options, function (item) { return !obj[item.value]; }) ||
                    options[0].value;
                obj[key] = item.msg || defaultMessages[key] || '';
            });
            return obj;
        },
        items: [
            {
                type: 'select',
                unique: true,
                name: 'type',
                options: options,
                columnClassName: 'w-sm'
            },
            {
                type: 'input-text',
                name: 'msg',
                placeholder: '提示信息'
            },
            {
                type: 'formula',
                name: 'msg',
                initSet: false,
                formula: "({\n          isEmail: 'Email \u683C\u5F0F\u4E0D\u6B63\u786E',\n          isRequired: '\u8FD9\u662F\u5FC5\u586B\u9879',\n          isUrl: 'Url \u683C\u5F0F\u4E0D\u6B63\u786E',\n          isInt: '\u8BF7\u8F93\u5165\u6574\u5F62\u6570\u5B57',\n          isAlpha: '\u8BF7\u8F93\u5165\u5B57\u6BCD',\n          isNumeric: '\u8BF7\u8F93\u5165\u6570\u5B57',\n          isAlphanumeric: '\u8BF7\u8F93\u5165\u5B57\u6BCD\u6216\u8005\u6570\u5B57',\n          isFloat: '\u8BF7\u8F93\u5165\u6D6E\u70B9\u578B\u6570\u503C',\n          isWords: '\u8BF7\u8F93\u5165\u5B57\u6BCD',\n          isUrlPath: '\u53EA\u80FD\u8F93\u5165\u5B57\u6BCD\u3001\u6570\u5B57\u3001`-` \u548C `_`.',\n          matchRegexp: '\u683C\u5F0F\u4E0D\u6B63\u786E, \u8BF7\u8F93\u5165\u7B26\u5408\u89C4\u5219\u4E3A `$1` \u7684\u5185\u5BB9\u3002',\n          minLength: '\u8BF7\u8F93\u5165\u66F4\u591A\u7684\u5185\u5BB9\uFF0C\u81F3\u5C11\u8F93\u5165 $1 \u4E2A\u5B57\u7B26\u3002',\n          maxLength: '\u8BF7\u63A7\u5236\u5185\u5BB9\u957F\u5EA6, \u8BF7\u4E0D\u8981\u8F93\u5165 $1 \u4E2A\u5B57\u7B26\u4EE5\u4E0A',\n          maximum: '\u5F53\u524D\u8F93\u5165\u503C\u8D85\u51FA\u6700\u5927\u503C $1\uFF0C\u8BF7\u68C0\u67E5',\n          minimum: '\u5F53\u524D\u8F93\u5165\u503C\u4F4E\u4E8E\u6700\u5C0F\u503C $1\uFF0C\u8BF7\u68C0\u67E5',\n          isJson: '\u8BF7\u68C0\u67E5 Json \u683C\u5F0F\u3002',\n          isLength: '\u8BF7\u8F93\u5165\u957F\u5EA6\u4E3A $1 \u7684\u5185\u5BB9',\n          notEmptyString: '\u8BF7\u4E0D\u8981\u5168\u8F93\u5165\u7A7A\u767D\u5B57\u7B26',\n          equalsField: '\u8F93\u5165\u7684\u6570\u636E\u4E0E $1 \u503C\u4E0D\u4E00\u81F4',\n          equals: '\u8F93\u5165\u7684\u6570\u636E\u4E0E $1 \u4E0D\u4E00\u81F4',\n          isPhoneNumber: '\u8BF7\u8F93\u5165\u5408\u6CD5\u7684\u624B\u673A\u53F7\u7801',\n          isTelNumber: '\u8BF7\u8F93\u5165\u5408\u6CD5\u7684\u7535\u8BDD\u53F7\u7801',\n          isZipcode: '\u8BF7\u8F93\u5165\u5408\u6CD5\u7684\u90AE\u7F16\u5730\u5740',\n          isId: '\u8BF7\u8F93\u5165\u5408\u6CD5\u7684\u8EAB\u4EFD\u8BC1\u53F7',\n      })[data.type] || ''"
            }
        ]
    };
});
setSchemaTpl('submitOnChange', {
    type: 'switch',
    label: '修改即提交',
    name: 'submitOnChange',
    labelRemark: {
        trigger: 'click',
        className: 'm-l-xs',
        rootClose: true,
        content: '设置后，表单中每次有修改都会触发提交',
        placement: 'left'
    }
});
setSchemaTpl('validateOnChange', {
    type: 'select',
    name: 'validateOnChange',
    label: '校验触发',
    options: [
        {
            label: '提交后每次修改即触发',
            value: ''
        },
        {
            label: '修改即触发',
            value: true
        },
        {
            label: '提交触发',
            value: false
        }
    ],
    pipeIn: defaultValue(''),
    pipeOut: function (value) { return (value === '' ? undefined : !!value); }
});
setSchemaTpl('validation', function (config) {
    var a = {
        title: '校验',
        body: [
            __assign({ type: 'ae-validationControl', mode: 'normal' }, config
            // pipeIn: (value: any, data: any) => {
            //   // return reduce(value, (arr: any, item) => {
            //   //   if (typeof item === 'string') {
            //   //     arr.push(item);
            //   //   }
            //   //   else {
            //   //     let isAdd = false;
            //   //     // 优先判断是否具备可展示条件
            //   //     forEach(item?.isShow, (val, key) => {
            //   //       if ([...val].includes(data?.data[key])) {
            //   //         isAdd = true;
            //   //         return false;
            //   //       }
            //   //     })
            //   //     !isAdd  && forEach(item?.isHidden, (val, key) => {
            //   //       const hasExist = [...val].includes(data?.data[key]);
            //   //         isAdd = hasExist ? false : true;
            //   //         if (hasExist) {
            //   //           return false;
            //   //         }
            //   //     })
            //   //     isAdd && arr.push(item.option);
            //   //   }
            //   //   return arr;
            //   // }, []);
            // },
            ),
            getSchemaTpl('validateOnChange')
        ]
    };
    return a;
});
setSchemaTpl('validationControl', function (value) {
    if (value === void 0) { value = []; }
    return ({
        type: 'ae-validationControl',
        label: '校验规则',
        mode: 'normal',
        pipeIn: function (value, data) {
            return reduce(value, function (arr, item) {
                if (typeof item === 'string') {
                    arr.push(item);
                }
                else {
                    var isAdd_1 = false;
                    // 优先判断是否具备可展示条件
                    forEach(item === null || item === void 0 ? void 0 : item.isShow, function (val, key) {
                        if (__spreadArray([], val, true).includes(data === null || data === void 0 ? void 0 : data.data[key])) {
                            isAdd_1 = true;
                            return false;
                        }
                        return true;
                    });
                    !isAdd_1 &&
                        forEach(item === null || item === void 0 ? void 0 : item.isHidden, function (val, key) {
                            var hasExist = __spreadArray([], val, true).includes(data === null || data === void 0 ? void 0 : data.data[key]);
                            isAdd_1 = hasExist ? false : true;
                            if (hasExist) {
                                return false;
                            }
                            return true;
                        });
                    isAdd_1 && arr.push(item.option);
                }
                return arr;
            }, []);
        },
        value: value
    });
});
