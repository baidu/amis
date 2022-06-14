var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
import { __spreadArray } from "tslib";
/**
 * @file 所有可用验证器
 */
var Validators = [];
/**
 * 校验规则类名
 */
export var ValidationGroup;
(function (ValidationGroup) {
    ValidationGroup["Pattern"] = "\u6587\u672C";
    ValidationGroup["Number"] = "\u6570\u5B57";
    ValidationGroup["Regex"] = "\u6B63\u5219";
    ValidationGroup["Others"] = "\u5176\u4ED6";
})(ValidationGroup || (ValidationGroup = {}));
var ValidTagMatchType;
(function (ValidTagMatchType) {
    ValidTagMatchType[ValidTagMatchType["isDefault"] = 1] = "isDefault";
    ValidTagMatchType[ValidTagMatchType["isMore"] = 2] = "isMore";
    ValidTagMatchType[ValidTagMatchType["isBuiltIn"] = 3] = "isBuiltIn"; // 默认内置校验， 默认开启，不可操作开关关闭
})(ValidTagMatchType || (ValidTagMatchType = {}));
export var registerValidator = function () {
    var config = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        config[_i] = arguments[_i];
    }
    Validators.push.apply(Validators, config);
};
export var getValidatorsByTag = function (tag) {
    var defaultValidators = {};
    var moreValidators = {};
    var builtInValidators = {};
    Validators.forEach(function (valid) {
        var tagMatch = valid.tag[tag];
        if (tagMatch != null) {
            if (tagMatch === ValidTagMatchType.isDefault) {
                defaultValidators[valid.name] = valid;
            }
            else if (tagMatch === ValidTagMatchType.isMore) {
                moreValidators[valid.name] = valid;
            }
            else if (tagMatch === ValidTagMatchType.isBuiltIn) {
                builtInValidators[valid.name] = valid;
            }
            return;
        }
        tagMatch = valid.tag[ValidatorTag.All];
        if (tagMatch != null) {
            if (tagMatch === ValidTagMatchType.isDefault) {
                defaultValidators[valid.name] = valid;
            }
            else if (tagMatch === ValidTagMatchType.isMore) {
                moreValidators[valid.name] = valid;
            }
            else if (tagMatch === ValidTagMatchType.isBuiltIn) {
                builtInValidators[valid.name] = valid;
            }
        }
    });
    return {
        defaultValidators: defaultValidators,
        moreValidators: moreValidators,
        builtInValidators: builtInValidators
    };
};
export var getValidator = function (name) {
    return Validators.find(function (item) { return item.name === name; });
};
export var ValidatorTag;
(function (ValidatorTag) {
    ValidatorTag["All"] = "0";
    ValidatorTag["Text"] = "1";
    ValidatorTag["MultiSelect"] = "2";
    ValidatorTag["Check"] = "3";
    ValidatorTag["Email"] = "4";
    ValidatorTag["Password"] = "5";
    ValidatorTag["URL"] = "6";
    ValidatorTag["Number"] = "7";
    ValidatorTag["File"] = "8";
    ValidatorTag["Date"] = "9";
    ValidatorTag["Code"] = "10";
})(ValidatorTag || (ValidatorTag = {}));
registerValidator.apply(void 0, __spreadArray([{
        label: '必填',
        name: 'required',
        tag: (_a = {},
            _a[ValidatorTag.Text] = ValidTagMatchType.isDefault,
            _a[ValidatorTag.File] = ValidTagMatchType.isDefault,
            _a[ValidatorTag.MultiSelect] = ValidTagMatchType.isDefault,
            _a[ValidatorTag.Date] = ValidTagMatchType.isDefault,
            _a[ValidatorTag.Code] = ValidTagMatchType.isDefault,
            _a[ValidatorTag.Email] = ValidTagMatchType.isDefault,
            _a[ValidatorTag.Password] = ValidTagMatchType.isDefault,
            _a[ValidatorTag.URL] = ValidTagMatchType.isDefault,
            _a)
    },
    {
        label: '邮箱格式',
        name: 'isEmail',
        group: ValidationGroup.Pattern,
        message: 'Email 格式不正确',
        tag: (_b = {},
            _b[ValidatorTag.Email] = ValidTagMatchType.isBuiltIn,
            _b[ValidatorTag.Text] = ValidTagMatchType.isMore,
            _b)
    },
    {
        label: 'Url格式',
        name: 'isUrl',
        group: ValidationGroup.Pattern,
        message: 'Url 格式不正确',
        tag: (_c = {},
            _c[ValidatorTag.URL] = ValidTagMatchType.isBuiltIn,
            _c[ValidatorTag.Text] = ValidTagMatchType.isMore,
            _c)
    },
    {
        label: '字母',
        name: 'isAlpha',
        group: ValidationGroup.Pattern,
        message: '请输入字母',
        tag: (_d = {},
            _d[ValidatorTag.Text] = ValidTagMatchType.isMore,
            _d)
    },
    {
        label: '数字',
        name: 'isNumeric',
        group: ValidationGroup.Number,
        message: '请输入数字',
        tag: (_e = {},
            _e[ValidatorTag.Number] = ValidTagMatchType.isDefault,
            _e[ValidatorTag.Text] = ValidTagMatchType.isMore,
            _e)
    },
    {
        label: '字母和数字',
        name: 'isAlphanumeric',
        group: ValidationGroup.Pattern,
        message: '请输入字母或者数字',
        tag: (_f = {},
            _f[ValidatorTag.Text] = ValidTagMatchType.isMore,
            _f)
    },
    {
        label: '整型数字',
        name: 'isInt',
        group: ValidationGroup.Number,
        message: '请输入整形数字',
        tag: (_g = {},
            _g[ValidatorTag.Number] = ValidTagMatchType.isDefault,
            _g[ValidatorTag.Text] = ValidTagMatchType.isMore,
            _g)
    },
    {
        label: '浮点型数字',
        name: 'isFloat',
        group: ValidationGroup.Number,
        message: '请输入浮点型数值',
        tag: (_h = {},
            _h[ValidatorTag.Number] = ValidTagMatchType.isDefault,
            _h[ValidatorTag.Text] = ValidTagMatchType.isMore,
            _h)
    },
    {
        label: '固定长度',
        name: 'isLength',
        group: ValidationGroup.Pattern,
        message: '请输入长度为 $1 的内容',
        tag: (_j = {},
            _j[ValidatorTag.Number] = ValidTagMatchType.isDefault,
            _j[ValidatorTag.Text] = ValidTagMatchType.isMore,
            _j),
        schema: [
            {
                type: 'input-number',
                name: 'value',
                label: '字符数',
                placeholder: '请输入字符个数'
            }
        ]
    },
    {
        label: '最大长度',
        name: 'maxLength',
        group: ValidationGroup.Pattern,
        message: '请控制内容长度, 请不要输入 $1 个字符以上',
        tag: (_k = {},
            _k[ValidatorTag.Text] = ValidTagMatchType.isDefault,
            _k),
        schema: [
            {
                type: 'input-number',
                name: 'value',
                label: '字符数'
                // placeholder: '请输入字符个数'
            }
        ]
    },
    // {
    //   label: '最大个数',
    //   name: 'maxLength',
    //   group: ValidationGroup.Pattern,
    //   message: '文件个数不可超过 $1 个',
    //   tag: {
    //     [ValidatorTag.File]: true
    //   },
    //   schema: [
    //     {
    //       type: 'input-number',
    //       name: 'value',
    //       label: '文件数'
    //     }
    //   ]
    // },
    // {
    //   label: '最小个数',
    //   name: 'minLength',
    //   group: ValidationGroup.Pattern,
    //   message: '文件个数不可少于 $1 个',
    //   tag: {
    //     [ValidatorTag.File]: true
    //   },
    //   schema: [
    //     {
    //       type: 'input-number',
    //       name: 'value',
    //       label: '文件数'
    //     }
    //   ]
    // },
    // {
    //   label: '最大体积',
    //   group: ValidationGroup.Pattern,
    //   name: 'maxSize',
    //   message: '文件体积不可超过 $1 Byte',
    //   tag: {
    //     [ValidatorTag.File]: true
    //   },
    //   schema: [
    //     {
    //       type: 'input-number',
    //       label: '体积(Byte)'
    //     }
    //   ]
    // },
    {
        label: '最小长度',
        name: 'minLength',
        group: ValidationGroup.Pattern,
        message: '请输入更多的内容，至少输入 $1 个字符',
        tag: (_l = {},
            _l[ValidatorTag.Text] = ValidTagMatchType.isDefault,
            _l),
        schema: [
            {
                type: 'input-number',
                name: 'value',
                label: '字符数'
                // placeholder: '请输入字符个数'
            }
        ]
    },
    {
        label: '最大值',
        name: 'maximum',
        group: ValidationGroup.Number,
        message: '当前输入值超出最大值 $1，请检查',
        tag: (_m = {},
            _m[ValidatorTag.Number] = ValidTagMatchType.isDefault,
            _m[ValidatorTag.Text] = ValidTagMatchType.isMore,
            _m),
        schema: [
            {
                type: 'input-number',
                name: 'value',
                label: '最大值'
                // placeholder: '请输入最大值'
            }
        ]
    },
    {
        label: '最小值',
        name: 'minimum',
        group: ValidationGroup.Number,
        message: '当前输入值低于最小值 $1，请检查',
        tag: (_o = {},
            _o[ValidatorTag.Number] = ValidTagMatchType.isDefault,
            _o[ValidatorTag.Text] = ValidTagMatchType.isMore,
            _o),
        schema: [
            {
                type: 'input-number',
                name: 'value',
                label: '最小值'
                // placeholder: '请输入最小值'
            }
        ]
    },
    {
        label: '手机号码',
        name: 'isPhoneNumber',
        group: ValidationGroup.Pattern,
        message: '请输入合法的手机号码',
        tag: (_p = {},
            _p[ValidatorTag.Text] = ValidTagMatchType.isMore,
            _p)
    },
    {
        label: '电话号码',
        name: 'isTelNumber',
        group: ValidationGroup.Pattern,
        message: '请输入合法的电话号码',
        tag: (_q = {},
            _q[ValidatorTag.Text] = ValidTagMatchType.isMore,
            _q)
    },
    {
        label: '邮编号码',
        name: 'isZipcode',
        group: ValidationGroup.Pattern,
        message: '请输入合法的邮编地址',
        tag: (_r = {},
            _r[ValidatorTag.Text] = ValidTagMatchType.isMore,
            _r)
    },
    {
        label: '身份证号码',
        name: 'isId',
        group: ValidationGroup.Pattern,
        message: '请输入合法的身份证号',
        tag: (_s = {},
            _s[ValidatorTag.Text] = ValidTagMatchType.isMore,
            _s)
    },
    {
        label: 'JSON格式',
        name: 'isJson',
        group: ValidationGroup.Pattern,
        message: '请检查 Json 格式',
        tag: (_t = {},
            _t[ValidatorTag.Text] = ValidTagMatchType.isMore,
            _t)
    },
    {
        label: '与指定值相同',
        name: 'equals',
        group: ValidationGroup.Others,
        message: '输入的数据与 $1 不一致',
        tag: (_u = {},
            _u[ValidatorTag.All] = ValidTagMatchType.isMore,
            _u[ValidatorTag.Password] = ValidTagMatchType.isDefault,
            _u),
        schema: [
            {
                type: 'input-text',
                name: 'value',
                label: '值内容'
            }
        ]
    },
    {
        label: '与指定字段值相同',
        name: 'equalsField',
        group: ValidationGroup.Others,
        message: '输入的数据与 $1 值不一致',
        tag: (_v = {},
            _v[ValidatorTag.All] = ValidTagMatchType.isMore,
            _v[ValidatorTag.Password] = ValidTagMatchType.isDefault,
            _v),
        schema: [
            {
                type: 'input-text',
                name: 'value',
                label: '字段名'
            }
        ]
    }], Array(5)
    .fill(null)
    .map(function (v, index) {
    var _a;
    var num = index === 0 ? '' : index;
    return {
        label: '自定义正则' + num,
        name: 'matchRegexp' + num,
        group: ValidationGroup.Regex,
        message: '格式不正确, 请输入符合规则为 `$1` 的内容。',
        tag: (_a = {},
            _a[ValidatorTag.All] = ValidTagMatchType.isMore,
            _a),
        schema: [
            {
                type: 'input-text',
                name: 'value',
                label: '表达式',
                placeholder: '请输入Js正则',
                prefix: '/',
                suffix: '/'
            }
        ]
    };
}), false));
