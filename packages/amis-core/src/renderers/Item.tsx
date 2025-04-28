import React, {StrictMode} from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import {IFormItemStore, IFormStore} from '../store/form';
import {reaction} from 'mobx';
import {isAlive} from 'mobx-state-tree';
import {isGlobalVarExpression} from '../globalVar';
import {resolveVariableAndFilter} from '../utils/resolveVariableAndFilter';

import {
  renderersMap,
  RendererProps,
  registerRenderer,
  TestFunc,
  RendererConfig
} from '../factory';
import {
  anyChanged,
  ucFirst,
  getWidthRate,
  autobind,
  isMobile,
  createObject,
  getVariable
} from '../utils/helper';
import {observer} from 'mobx-react';
import {FormHorizontal, FormSchemaBase} from './Form';
import {
  ActionObject,
  BaseApiObject,
  BaseSchemaWithoutType,
  ClassName,
  DataChangeReason,
  Schema
} from '../types';
import {HocStoreFactory} from '../WithStore';
import {wrapControl} from './wrapControl';
import debounce from 'lodash/debounce';
import {isApiOutdated, isEffectiveApi} from '../utils/api';
import {findDOMNode} from 'react-dom';
import {
  createObjectFromChain,
  dataMapping,
  deleteVariable,
  getTreeAncestors,
  isEmpty,
  keyToPath,
  setThemeClassName,
  setVariable
} from '../utils';
import Overlay from '../components/Overlay';
import PopOver from '../components/PopOver';
import CustomStyle from '../components/CustomStyle';
import classNames from 'classnames';
import isPlainObject from 'lodash/isPlainObject';
import {IScopedContext} from '../Scoped';

export type LabelAlign = 'right' | 'left' | 'top' | 'inherit';

export interface FormBaseControl extends BaseSchemaWithoutType {
  /**
   * 表单项大小
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';

  /**
   * 描述标题
   */
  label?: string | false;

  /**
   * 描述标题
   */
  labelAlign?: LabelAlign;

  /**
   * label自定义宽度，默认单位为px
   */
  labelWidth?: number | string;

  /**
   * 配置 label className
   */
  labelClassName?: string;

  /**
   * 字段名，表单提交时的 key，支持多层级，用.连接，如： a.b.c
   */
  name?: string;

  /**
   * 额外的字段名，当为范围组件时可以用来将另外一个值打平出来
   */
  extraName?: string;

  /**
   * 显示一个小图标, 鼠标放上去的时候显示提示内容
   */
  remark?: any;

  /**
   * 显示一个小图标, 鼠标放上去的时候显示提示内容, 这个小图标跟 label 在一起
   */
  labelRemark?: any;

  /**
   * 输入提示，聚焦的时候显示
   */
  hint?: string;

  /**
   * 当修改完的时候是否提交表单。
   */
  submitOnChange?: boolean;

  /**
   * 是否只读
   */
  readOnly?: boolean;

  /**
   * 只读条件
   */
  readOnlyOn?: string;

  /**
   * 不设置时，当表单提交过后表单项每次修改都会触发重新验证，
   * 如果设置了，则由此配置项来决定要不要每次修改都触发验证。
   */
  validateOnChange?: boolean;

  /**
   * 描述内容，支持 Html 片段。
   */
  description?: string;

  /**
   * @deprecated 用 description 代替
   */
  desc?: string;

  /**
   * 配置描述上的 className
   */
  descriptionClassName?: ClassName;

  /**
   * 配置当前表单项展示模式
   */
  mode?: 'normal' | 'inline' | 'horizontal';

  /**
   * 当配置为水平布局的时候，用来配置具体的左右分配。
   */
  horizontal?: FormHorizontal;

  /**
   * 表单 control 是否为 inline 模式。
   */
  inline?: boolean;

  /**
   * 配置 input className
   */
  inputClassName?: ClassName;

  /**
   * 占位符
   */
  placeholder?: string;

  /**
   * 是否为必填
   */
  required?: boolean;

  /**
   * 验证失败的提示信息
   */
  validationErrors?: {
    isAlpha?: string;
    isAlphanumeric?: string;
    isEmail?: string;
    isFloat?: string;
    isInt?: string;
    isJson?: string;
    isLength?: string;
    isNumeric?: string;
    isRequired?: string;
    isUrl?: string;
    matchRegexp?: string;
    matchRegexp2?: string;
    matchRegexp3?: string;
    matchRegexp4?: string;
    matchRegexp5?: string;
    maxLength?: string;
    maximum?: string;
    minLength?: string;
    minimum?: string;
    isDateTimeSame?: string;
    isDateTimeBefore?: string;
    isDateTimeAfter?: string;
    isDateTimeSameOrBefore?: string;
    isDateTimeSameOrAfter?: string;
    isDateTimeBetween?: string;
    isTimeSame?: string;
    isTimeBefore?: string;
    isTimeAfter?: string;
    isTimeSameOrBefore?: string;
    isTimeSameOrAfter?: string;
    isTimeBetween?: string;
    [propName: string]: any;
  };

  validations?:
    | string
    | {
        /**
         * 是否是字母
         */
        isAlpha?: boolean;

        /**
         * 是否为字母数字
         */
        isAlphanumeric?: boolean;

        /**
         * 是否为邮箱地址
         */
        isEmail?: boolean;

        /**
         * 是否为浮点型
         */
        isFloat?: boolean;

        /**
         * 是否为整型
         */
        isInt?: boolean;

        /**
         * 是否为 json
         */
        isJson?: boolean;

        /**
         * 长度等于指定值
         */
        isLength?: number;

        /**
         * 是否为数字
         */
        isNumeric?: boolean;

        /**
         * 是否为必填
         */
        isRequired?: boolean;

        /**
         * 是否为 URL 地址
         */
        isUrl?: boolean;

        /**
         * 内容命中指定正则
         */
        matchRegexp?: string;
        /**
         * 内容命中指定正则
         */
        matchRegexp1?: string;
        /**
         * 内容命中指定正则
         */
        matchRegexp2?: string;
        /**
         * 内容命中指定正则
         */
        matchRegexp3?: string;
        /**
         * 内容命中指定正则
         */
        matchRegexp4?: string;
        /**
         * 内容命中指定正则
         */
        matchRegexp5?: string;

        /**
         * 最大长度为指定值
         */
        maxLength?: number;

        /**
         * 最大值为指定值
         */
        maximum?: number;

        /**
         * 最小长度为指定值
         */
        minLength?: number;

        /**
         * 最小值为指定值
         */
        minimum?: number;

        /**
         * 和目标日期相同，支持指定粒度，默认到毫秒
         * @version 2.2.0
         */
        isDateTimeSame?: string | string[];

        /**
         * 早于目标日期，支持指定粒度，默认到毫秒
         * @version 2.2.0
         */
        isDateTimeBefore?: string | string[];

        /**
         * 晚于目标日期，支持指定粒度，默认到毫秒
         * @version 2.2.0
         */
        isDateTimeAfter?: string | string[];

        /**
         * 早于目标日期或和目标日期相同，支持指定粒度，默认到毫秒
         * @version 2.2.0
         */
        isDateTimeSameOrBefore?: string | string[];

        /**
         * 晚于目标日期或和目标日期相同，支持指定粒度，默认到毫秒
         * @version 2.2.0
         */
        isDateTimeSameOrAfter?: string | string[];

        /**
         * 日期处于目标日期范围，支持指定粒度和区间的开闭形式，默认到毫秒, 左右开区间
         * @version 2.2.0
         */
        isDateTimeBetween?: string | string[];

        /**
         * 和目标时间相同，支持指定粒度，默认到毫秒
         * @version 2.2.0
         */
        isTimeSame?: string | string[];

        /**
         * 早于目标时间，支持指定粒度，默认到毫秒
         * @version 2.2.0
         */
        isTimeBefore?: string | string[];

        /**
         * 晚于目标时间，支持指定粒度，默认到毫秒
         * @version 2.2.0
         */
        isTimeAfter?: string | string[];

        /**
         * 早于目标时间或和目标时间相同，支持指定粒度，默认到毫秒
         * @version 2.2.0
         */
        isTimeSameOrBefore?: string | string[];

        /**
         * 晚于目标时间或和目标时间相同，支持指定粒度，默认到毫秒
         * @version 2.2.0
         */
        isTimeSameOrAfter?: string | string[];

        /**
         * 时间处于目标时间范围，支持指定粒度和区间的开闭形式，默认到毫秒, 左右开区间
         * @version 2.2.0
         */
        isTimeBetween?: string | string[];

        [propName: string]: any;
      };

  /**
   * 默认值，切记只能是静态值，不支持取变量，跟数据关联是通过设置 name 属性来实现的。
   */
  value?: any;

  /**
   * 表单项隐藏时，是否在当前 Form 中删除掉该表单项值。注意同名的未隐藏的表单项值也会删掉
   */
  clearValueOnHidden?: boolean;

  /**
   * 远端校验表单项接口
   */
  validateApi?: string | BaseApiObject;

  /**
   * 自动填充，当选项被选择的时候，将选项中的其他值同步设置到表单内。
   *
   */
  autoFill?:
    | {
        [propName: string]: string;
      }
    | {
        /**
         * 是否为参照录入模式，参照录入会展示候选值供用户选择，而不是直接填充。
         */
        showSuggestion?: boolean;

        /**
         * 参照录入时，默认选中的值
         */
        defaultSelection?: any;

        /**
         * 自动填充 api
         */
        api?: BaseApiObject | string;

        /**
         * 是否展示数据格式错误提示，默认为不展示
         * @default true
         */
        silent?: boolean;

        /**
         * 填充时的数据映射
         */
        fillMappinng?: {
          [propName: string]: any;
        };

        /**
         * 触发条件，默认为 change
         */
        trigger?: 'change' | 'focus' | 'blur';

        /**
         * 弹窗方式，当为参照录入时用可以配置
         */
        mode?: 'popOver' | 'dialog' | 'drawer';

        /**
         * 当参照录入为抽屉时可以配置弹出位置
         */
        position?: string;

        /**
         * 当为参照录入时可以配置弹出容器的大小
         */
        size?: string;

        /**
         * 参照录入展示的项
         */
        columns?: Array<any>;

        /**
         * 参照录入时的过滤条件
         */
        filter?: any;
      };

  /**
   * @default fillIfNotSet
   * 初始化时是否把其他字段同步到表单内部。
   */
  initAutoFill?: boolean | 'fillIfNotSet';

  row?: number; // flex模式下指定所在的行数
}

export interface FormItemBasicConfig extends Partial<RendererConfig> {
  type?: string;
  wrap?: boolean;
  renderLabel?: boolean;
  renderDescription?: boolean;
  test?: RegExp | TestFunc;
  storeType?: string;
  formItemStoreType?: string;
  validations?: string;
  strictMode?: boolean;

  /**
   * 是否是瘦子
   */
  thin?: boolean;
  /**
   * schema变化使视图更新的属性白名单
   */
  detectProps?: Array<string>;
  shouldComponentUpdate?: (props: any, prevProps: any) => boolean;
  descriptionClassName?: string;
  storeExtendsData?: boolean;
  sizeMutable?: boolean;
  weight?: number;
  extendsData?: boolean;
  showErrorMsg?: boolean;

  // 兼容老用法，新用法直接在 Component 里面定义 validate 方法即可。
  validate?: (values: any, value: any) => string | boolean;
}

// 自己接收到属性。
export interface FormItemProps extends RendererProps {
  name?: string;
  formStore?: IFormStore;
  formItem?: IFormItemStore;
  formInited: boolean;
  formMode: 'normal' | 'horizontal' | 'inline' | 'row' | 'default';
  formHorizontal: FormHorizontal;
  formLabelAlign: LabelAlign;
  formLabelWidth?: number | string;
  defaultSize?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
  labelAlign?: LabelAlign;
  labelWidth?: number | string;
  disabled?: boolean;
  btnDisabled: boolean;
  defaultValue: any;
  value?: any;
  prinstine: any;
  setPrinstineValue: (value: any) => void;
  onChange: (
    value: any,
    submitOnChange?: boolean,
    changeImmediately?: boolean
  ) => void;
  onBulkChange?: (
    values: {[propName: string]: any},
    submitOnChange?: boolean,
    changeReason?: DataChangeReason
  ) => void;
  addHook: (
    fn: Function,
    mode?: 'validate' | 'init' | 'flush',
    enforce?: 'prev' | 'post'
  ) => () => void;
  removeHook: (fn: Function, mode?: 'validate' | 'init' | 'flush') => void;
  renderFormItems: (
    schema: Partial<FormSchemaBase>,
    region: string,
    props: any
  ) => JSX.Element;
  onFocus: (e: any) => void;
  onBlur: (e: any) => void;

  formItemValue: any; // 不建议使用 为了兼容 v1
  getValue: () => any; // 不建议使用 为了兼容 v1
  setValue: (value: any, key: string) => void; // 不建议使用 为了兼容 v1

  inputClassName?: string;
  renderControl?: (props: FormControlProps) => JSX.Element;

  inputOnly?: boolean;
  renderLabel?: boolean;
  renderDescription?: boolean;
  sizeMutable?: boolean;
  wrap?: boolean;
  hint?: string;
  description?: string;
  descriptionClassName?: string;
  // error 详情
  errors?: {
    [propName: string]: string;
  };
  // error string
  error?: string;
  showErrorMsg?: boolean;
}

// 下发下去的属性
export type FormControlProps = RendererProps & {
  onOpenDialog: (schema: Schema, data: any) => Promise<any>;
} & Exclude<
    FormItemProps,
    | 'inputClassName'
    | 'renderControl'
    | 'defaultSize'
    | 'size'
    | 'error'
    | 'errors'
    | 'hint'
    | 'descriptionClassName'
    | 'inputOnly'
    | 'renderLabel'
    | 'renderDescription'
    | 'sizeMutable'
    | 'wrap'
  >;

export type FormItemComponent = React.ComponentType<FormItemProps>;
export type FormControlComponent = React.ComponentType<FormControlProps>;

export interface FormItemConfig extends FormItemBasicConfig {
  component: FormControlComponent;
}

const getItemLabelClassName = (props: FormItemProps) => {
  const {staticLabelClassName, labelClassName, id, themeCss} = props;
  return props.static && staticLabelClassName
    ? staticLabelClassName
    : classNames(
        labelClassName,
        setThemeClassName({
          ...props,
          name: 'labelClassName',
          id,
          themeCss,
          extra: 'item'
        })
      );
};

const getItemInputClassName = (props: FormItemProps) => {
  const {staticInputClassName, inputClassName} = props;
  return props.static && staticInputClassName
    ? staticInputClassName
    : inputClassName;
};

export class FormItemWrap extends React.Component<FormItemProps> {
  lastSearchTerm: any;
  target: HTMLElement;
  mounted = false;
  initedOptionFilled = false;
  initedApiFilled = false;
  toDispose: Array<() => void> = [];

  constructor(props: FormItemProps) {
    super(props);

    const {formItem: model, formInited, addHook, initAutoFill} = props;
    if (!model) {
      return;
    }

    this.toDispose.push(
      reaction(
        () =>
          `${model.errors.join('')}${model.isFocused}${
            model.dialogOpen
          }${JSON.stringify(model.filteredOptions)}${model.popOverOpen}`,
        () => this.forceUpdate()
      )
    );

    let onInit = () => {
      this.initedOptionFilled = true;
      initAutoFill !== false &&
        isAlive(model) &&
        this.syncOptionAutoFill(
          model.getSelectedOptions(model.tmpValue),
          initAutoFill === 'fillIfNotSet'
        );
      this.initedApiFilled = true;
      initAutoFill !== false &&
        isAlive(model) &&
        this.syncApiAutoFill(
          model.tmpValue ?? '',
          false,
          initAutoFill === 'fillIfNotSet'
        );

      this.toDispose.push(
        reaction(
          () => JSON.stringify(model.tmpValue),
          () =>
            this.mounted &&
            this.initedApiFilled &&
            this.syncApiAutoFill(model.tmpValue)
        )
      );

      this.toDispose.push(
        reaction(
          () => JSON.stringify(model.getSelectedOptions(model.tmpValue)),
          () =>
            this.mounted &&
            this.initedOptionFilled &&
            this.syncOptionAutoFill(model.getSelectedOptions(model.tmpValue))
        )
      );
    };
    this.toDispose.push(
      formInited || !addHook
        ? model.addInitHook(onInit, 999)
        : addHook(onInit, 'init', 'post')
    );
  }

  componentDidMount() {
    this.mounted = true;
    this.target = findDOMNode(this) as HTMLElement;
  }

  componentDidUpdate(prevProps: FormItemProps) {
    const props = this.props;
    const {formItem: model} = props;

    if (
      isEffectiveApi(props.autoFill?.api, props.data) &&
      isApiOutdated(
        prevProps.autoFill?.api,
        props.autoFill?.api,
        prevProps.data,
        props.data
      )
    ) {
      this.syncApiAutoFill(model?.tmpValue, true);
    }
  }

  componentWillUnmount() {
    this.syncApiAutoFill.cancel();
    this.mounted = false;
    this.toDispose.forEach(fn => fn());
    this.toDispose = [];
  }

  @autobind
  handleFocus(e: any) {
    const {formItem: model, autoFill} = this.props;
    model && model.focus();
    this.props.onFocus && this.props.onFocus(e);

    if (
      !autoFill ||
      (autoFill && !autoFill?.hasOwnProperty('showSuggestion'))
    ) {
      return;
    }
    this.handleAutoFill('focus');
  }

  @autobind
  handleBlur(e: any) {
    const {formItem: model, autoFill} = this.props;
    model && model.blur();
    this.props.onBlur && this.props.onBlur(e);

    if (
      !autoFill ||
      (autoFill && !autoFill?.hasOwnProperty('showSuggestion'))
    ) {
      return;
    }
    this.handleAutoFill('blur');
  }

  handleAutoFill(type: string) {
    const {autoFill, formItem, data} = this.props;
    const {trigger, mode} = autoFill;
    if (trigger === type && mode === 'popOver') {
      // 参照录入 popOver形式
      formItem?.openPopOver(
        this.buildAutoFillSchema(),
        data,
        (confirmed, result) => {
          if (!confirmed || !result?.selectedItems) {
            return;
          }

          this.updateAutoFillData(result.selectedItems);
        }
      );
    } else if (
      // 参照录入 dialog | drawer
      trigger === type &&
      (mode === 'dialog' || mode === 'drawer')
    ) {
      formItem?.openDialog(
        this.buildAutoFillSchema(),
        data,
        (confirmed, result) => {
          if (!confirmed || !result?.selectedItems) {
            return;
          }

          this.updateAutoFillData(result.selectedItems);
        }
      );
    }
  }

  updateAutoFillData(context: any) {
    const {data, autoFill, onBulkChange} = this.props;
    const {fillMapping, multiple} = autoFill;
    // form原始数据
    const contextData = Array.isArray(context)
      ? createObject(data, {
          items: context
        })
      : createObjectFromChain([
          data,
          {
            items: [context]
          },
          context
        ]);

    this.applyMapping(fillMapping ?? {}, contextData, false);
  }

  syncApiAutoFill = debounce(
    async (term: any, forceLoad?: boolean, skipIfExits = false) => {
      try {
        const {autoFill, onBulkChange, formItem, data} = this.props;

        // 参照录入
        if (
          !onBulkChange ||
          !formItem ||
          !autoFill ||
          (autoFill && !autoFill?.hasOwnProperty('api'))
        ) {
          return;
        } else if (
          skipIfExits &&
          (!autoFill.fillMapping ||
            Object.keys(autoFill.fillMapping).some(
              key => typeof getVariable(data, key) !== 'undefined'
            ))
        ) {
          // 只要目标填充值有一个有值，就初始不自动填充
          return;
        }

        if (autoFill?.showSuggestion) {
          this.handleAutoFill('change');
        } else {
          // 自动填充
          const itemName = formItem.name;
          const ctx = createObject(data, {
            __term: term
          });
          setVariable(ctx, itemName, term);

          if (
            forceLoad ||
            (isEffectiveApi(autoFill.api, ctx) && this.lastSearchTerm !== term)
          ) {
            let result = await formItem.loadAutoUpdateData(
              autoFill.api,
              ctx,
              !!(autoFill.api as BaseApiObject)?.silent
            );

            this.lastSearchTerm =
              (result && getVariable(result, itemName)) ?? term;

            // 如果没有返回不应该处理
            if (!result) {
              return;
            }

            this.applyMapping(
              autoFill?.fillMapping ?? {'&': '$$'},
              result,
              false
            );
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    250,
    {
      trailing: true,
      leading: false
    }
  );

  syncOptionAutoFill(selectedOptions: Array<any>, skipIfExits = false) {
    const {autoFill, multiple, onBulkChange, data} = this.props;
    const formItem = this.props.formItem as IFormItemStore;
    // 参照录入｜自动填充
    if (autoFill?.hasOwnProperty('api')) {
      return;
    }

    if (
      onBulkChange &&
      autoFill &&
      !isEmpty(autoFill) &&
      formItem.filteredOptions.length
    ) {
      this.applyMapping(
        autoFill,
        multiple
          ? {
              items: selectedOptions.map(item =>
                createObject(
                  {
                    ...data,
                    ancestors: getTreeAncestors(
                      formItem.filteredOptions,
                      item,
                      true
                    )
                  },
                  item
                )
              )
            }
          : createObject(
              {
                ...data,
                ancestors: getTreeAncestors(
                  formItem.filteredOptions,
                  selectedOptions[0],
                  true
                )
              },
              selectedOptions[0]
            ),
        skipIfExits
      );
    }
  }

  /**
   * 应用映射函数，根据给定的映射关系，更新数据对象
   *
   * @param mapping 映射关系，类型为任意类型
   * @param ctx 上下文对象，类型为任意类型
   * @param skipIfExits 是否跳过已存在的属性，默认为 false
   */
  applyMapping(mapping: any, ctx: any, skipIfExits = false) {
    const {onBulkChange, data, formItem} = this.props;
    const toSync = dataMapping(mapping, ctx);

    const tmpData = {...data};
    const result = {...toSync};

    Object.keys(mapping).forEach(key => {
      if (key === '&') {
        return;
      }

      const keys = keyToPath(key);
      let value = getVariable(toSync, key);

      if (skipIfExits) {
        const originValue = getVariable(data, key);
        if (typeof originValue !== 'undefined') {
          value = originValue;
        }
      }

      setVariable(result, key, value);

      // 如果左边的 key 是一个路径
      // 这里不希望直接把原始对象都给覆盖没了
      // 而是保留原始的对象，只修改指定的属性
      if (keys.length > 1 && isPlainObject(tmpData[keys[0]])) {
        // 存在情况：依次更新同一子路径的多个key，eg: a.b.c1 和 a.b.c2，所以需要同步更新data
        setVariable(tmpData, key, value);
        result[keys[0]] = tmpData[keys[0]];
      }
    });

    // 是否忽略自己的设置
    // if (ignoreSelf && formItem?.name) {
    //   deleteVariable(result, formItem.name);
    // }

    onBulkChange!(result);
  }

  buildAutoFillSchema() {
    const {formItem, autoFill, translate: __} = this.props;
    if (!autoFill || (autoFill && !autoFill?.hasOwnProperty('api'))) {
      return;
    }
    const {
      api,
      mode,
      size,
      offset,
      position,
      placement,
      multiple,
      filter,
      columns,
      labelField,
      popOverContainer,
      popOverClassName,
      valueField,
      defaultSelection
    } = autoFill;
    const form = {
      type: 'form',
      // debug: true,
      title: '',
      className: 'suggestion-form',
      body: [
        {
          type: 'picker',
          embed: true,
          joinValues: false,
          strictMode: false,
          label: false,
          labelField,
          valueField: valueField || 'value',
          multiple,
          name: 'selectedItems',
          value: defaultSelection || [],
          options: [],
          required: true,
          source: api,
          pickerSchema: {
            type: 'crud',
            bodyClassName: 'mb-0',
            affixHeader: false,
            alwaysShowPagination: true,
            keepItemSelectionOnPageChange: true,
            headerToolbar: [],
            footerToolbar: [
              {
                type: 'pagination',
                align: 'left'
              },
              {
                type: 'bulkActions',
                align: 'right',
                className: 'ml-2'
              }
            ],
            multiple,
            filter,
            columns: columns || []
          }
        }
      ],
      actions: [
        {
          type: 'button',
          actionType: 'cancel',
          label: __('cancel')
        },
        {
          type: 'submit',
          actionType: 'submit',
          level: 'primary',
          label: __('confirm')
        }
      ]
    };

    if (mode === 'popOver') {
      return {
        popOverContainer,
        popOverClassName,
        placement: placement ?? position,
        offset,
        body: form
      };
    } else {
      return {
        type: mode,
        className: 'auto-fill-dialog',
        title: __('FormItem.autoFillSuggest'),
        size,
        body: {
          ...form,
          wrapWithPanel: false
        },
        actions: [
          {
            type: 'button',
            actionType: 'cancel',
            label: __('cancel')
          },
          {
            type: 'submit',
            actionType: 'submit',
            level: 'primary',
            label: __('confirm')
          }
        ]
      };
    }
  }

  // 参照录入popOver提交
  @autobind
  handlePopOverConfirm(values: any) {
    const {onBulkChange, autoFill} = this.props;
    if (!autoFill || (autoFill && !autoFill?.hasOwnProperty('api'))) {
      return;
    }

    this.updateAutoFillData(values.selectedItems);
    this.closePopOver();
  }

  @autobind
  handlePopOverAction(
    e: React.UIEvent<any>,
    action: ActionObject,
    data: object,
    throwErrors: boolean = false,
    delegate?: IScopedContext
  ) {
    const {onAction} = this.props;
    if (action.actionType === 'cancel') {
      this.closePopOver();
    } else if (onAction) {
      // 不识别的丢给上层去处理。
      return onAction(e, action, data, throwErrors, delegate);
    }
  }

  @autobind
  closePopOver() {
    this.props.formItem?.closePopOver();
  }

  @autobind
  async handleOpenDialog(schema: Schema, data: any) {
    const {formItem: model} = this.props;
    if (!model) {
      return;
    }

    return new Promise(resolve =>
      model.openDialog(schema, data, (confirmed: any, value: any) =>
        resolve(confirmed ? value : false)
      )
    );
  }

  @autobind
  handleDialogConfirm([values]: Array<any>) {
    const {formItem: model} = this.props;
    if (!model) {
      return;
    }

    model.closeDialog(true, values);
  }

  @autobind
  handleDialogClose(confirmed = false) {
    const {formItem: model} = this.props;
    if (!model) {
      return;
    }
    model.closeDialog(confirmed);
  }

  renderControl(): JSX.Element | null {
    const {
      // 这里解构，不可轻易删除，避免被rest传到子组件
      inputClassName,
      formItem: model,
      classnames: cx,
      children,
      type,
      renderControl,
      formItemConfig,
      sizeMutable,
      size,
      defaultSize,
      mobileUI,
      ...rest
    } = this.props;

    if (renderControl) {
      const controlSize = size || defaultSize;
      return renderControl({
        ...rest,
        onOpenDialog: this.handleOpenDialog,
        type,
        classnames: cx,
        formItem: model,
        className: cx(
          `Form-control`,
          {
            'is-inline': !!rest.inline && !mobileUI,
            'is-error': model && !model.valid,
            'is-full': size === 'full',
            [`Form-control--withSize Form-control--size${ucFirst(
              controlSize
            )}`]:
              sizeMutable !== false &&
              typeof controlSize === 'string' &&
              !!controlSize &&
              controlSize !== 'full'
          },
          model?.errClassNames,
          setThemeClassName({
            ...this.props,
            name: 'wrapperCustomStyle',
            id: rest.id,
            themeCss: rest.wrapperCustomStyle,
            extra: 'item'
          }),
          getItemInputClassName(this.props)
        )
      });
    }

    return null;
  }

  /**
   * 布局扩充点，可以自己扩充表单项的布局方式
   */
  static layoutRenderers: {
    [propsName: string]: (
      props: FormItemProps,
      renderControl: () => JSX.Element | null
    ) => JSX.Element;
  } = {
    horizontal: (props: FormItemProps, renderControl: () => JSX.Element) => {
      let {
        className,
        style,
        classnames: cx,
        description,
        descriptionClassName,
        captionClassName,
        desc,
        label,
        render,
        required,
        caption,
        remark,
        labelRemark,
        env,
        formItem: model,
        renderLabel,
        renderDescription,
        hint,
        data,
        showErrorMsg,
        mobileUI,
        translate: __,
        static: isStatic,
        staticClassName,
        id,
        wrapperCustomStyle,
        themeCss
      } = props;

      // 强制不渲染 label 的话
      if (renderLabel === false) {
        label = label === false ? false : '';
      }

      description = description || desc;
      const horizontal = props.horizontal || props.formHorizontal || {};
      const left = getWidthRate(horizontal.left);
      const right = getWidthRate(horizontal.right);
      const labelAlign =
        (props.labelAlign !== 'inherit' && props.labelAlign) ||
        props.formLabelAlign;
      const labelWidth = props.labelWidth || props.formLabelWidth;

      return (
        <div
          data-role="form-item"
          data-amis-name={props.name}
          className={cx(
            `Form-item Form-item--horizontal`,
            isStatic && staticClassName ? staticClassName : className,
            {
              'Form-item--horizontal-justify': horizontal.justify,
              [`is-error`]: model && !model.valid,
              [`is-required`]: required
            },
            model?.errClassNames,
            setThemeClassName({
              ...props,
              name: 'wrapperCustomStyle',
              id,
              themeCss: wrapperCustomStyle,
              extra: 'item'
            })
          )}
          style={style}
        >
          {label !== false ? (
            <label
              className={cx(
                `Form-label`,
                {
                  [`Form-itemColumn--${
                    typeof horizontal.leftFixed === 'string'
                      ? horizontal.leftFixed
                      : 'normal'
                  }`]: horizontal.leftFixed,
                  [`Form-itemColumn--${left}`]: !horizontal.leftFixed,
                  'Form-label--left': labelAlign === 'left',
                  'Form-label-noLabel': label === ''
                },
                getItemLabelClassName(props)
              )}
              style={labelWidth != null ? {width: labelWidth} : undefined}
            >
              <span>
                {label ? render('label', label) : null}
                {required && (label || labelRemark) ? (
                  <span className={cx(`Form-star`)}>*</span>
                ) : null}
                {labelRemark
                  ? render('label-remark', {
                      type: 'remark',
                      icon: labelRemark.icon || 'warning-mark',
                      tooltip: labelRemark,
                      mobileUI,
                      className: cx(`Form-labelRemark`),
                      container: props.popOverContainer || env.getModalContainer
                    })
                  : null}
              </span>
            </label>
          ) : null}

          <div
            className={cx(`Form-value`, {
              // [`Form-itemColumn--offset${getWidthRate(horizontal.offset)}`]: !label && label !== false,
              [`Form-itemColumn--${right}`]:
                !horizontal.leftFixed && !!right && right !== 12 - left
            })}
          >
            {renderControl()}

            {caption
              ? render('caption', caption, {
                  className: cx(`Form-caption`, captionClassName)
                })
              : null}

            {remark
              ? render('remark', {
                  type: 'remark',
                  icon: remark.icon || 'warning-mark',
                  tooltip: remark,
                  className: cx(`Form-remark`),
                  mobileUI,
                  container: props.popOverContainer || env.getModalContainer
                })
              : null}

            {hint && model && model.isFocused
              ? render('hint', hint, {
                  className: cx(`Form-hint`)
                })
              : null}

            {model &&
            !model.valid &&
            showErrorMsg !== false &&
            Array.isArray(model.errors) ? (
              <ul className={cx(`Form-feedback`)}>
                {model.errors.map((msg: string, key: number) => (
                  <li key={key}>{msg}</li>
                ))}
              </ul>
            ) : null}

            {renderDescription !== false && description
              ? render('description', description, {
                  className: cx(
                    `Form-description`,
                    descriptionClassName,
                    setThemeClassName({
                      ...props,
                      name: 'descriptionClassName',
                      id,
                      themeCss,
                      extra: 'item'
                    })
                  )
                })
              : null}
          </div>
        </div>
      );
    },

    normal: (props: FormItemProps, renderControl: () => JSX.Element) => {
      let {
        className,
        style,
        classnames: cx,
        desc,
        description,
        label,
        render,
        required,
        caption,
        remark,
        labelRemark,
        env,
        descriptionClassName,
        captionClassName,
        formItem: model,
        renderLabel,
        renderDescription,
        hint,
        data,
        showErrorMsg,
        mobileUI,
        translate: __,
        static: isStatic,
        staticClassName,
        themeCss,
        wrapperCustomStyle,
        id
      } = props;

      description = description || desc;

      return (
        <div
          data-role="form-item"
          data-amis-name={props.name}
          className={cx(
            `Form-item Form-item--normal`,
            isStatic && staticClassName ? staticClassName : className,
            {
              'is-error': model && !model.valid,
              [`is-required`]: required
            },
            model?.errClassNames,
            setThemeClassName({
              ...props,
              name: 'wrapperCustomStyle',
              id,
              themeCss: wrapperCustomStyle,
              extra: 'item'
            })
          )}
          style={style}
        >
          {label && renderLabel !== false ? (
            <label className={cx(`Form-label`, getItemLabelClassName(props))}>
              <span>
                {label ? render('label', label) : null}
                {required && (label || labelRemark) ? (
                  <span className={cx(`Form-star`)}>*</span>
                ) : null}
                {labelRemark
                  ? render('label-remark', {
                      type: 'remark',
                      icon: labelRemark.icon || 'warning-mark',
                      tooltip: labelRemark,
                      className: cx(`Form-lableRemark`),
                      mobileUI,
                      container: props.popOverContainer || env.getModalContainer
                    })
                  : null}
              </span>
            </label>
          ) : null}

          {mobileUI ? (
            <div className={cx('Form-item-controlBox')}>
              {renderControl()}

              {caption
                ? render('caption', caption, {
                    className: cx(`Form-caption`, captionClassName)
                  })
                : null}

              {remark
                ? render('remark', {
                    type: 'remark',
                    icon: remark.icon || 'warning-mark',
                    className: cx(`Form-remark`),
                    tooltip: remark,
                    mobileUI,
                    container: props.popOverContainer || env.getModalContainer
                  })
                : null}

              {hint && model && model.isFocused
                ? render('hint', hint, {
                    className: cx(`Form-hint`)
                  })
                : null}

              {model &&
              !model.valid &&
              showErrorMsg !== false &&
              Array.isArray(model.errors) ? (
                <ul className={cx(`Form-feedback`)}>
                  {model.errors.map((msg: string, key: number) => (
                    <li key={key}>{msg}</li>
                  ))}
                </ul>
              ) : null}

              {renderDescription !== false && description
                ? render('description', description, {
                    className: cx(
                      `Form-description`,
                      descriptionClassName,
                      setThemeClassName({
                        ...props,
                        name: 'descriptionClassName',
                        id,
                        themeCss,
                        extra: 'item'
                      })
                    )
                  })
                : null}
            </div>
          ) : (
            <>
              {renderControl()}

              {caption
                ? render('caption', caption, {
                    className: cx(`Form-caption`, captionClassName)
                  })
                : null}

              {remark
                ? render('remark', {
                    type: 'remark',
                    icon: remark.icon || 'warning-mark',
                    className: cx(`Form-remark`),
                    tooltip: remark,
                    mobileUI,
                    container: props.popOverContainer || env.getModalContainer
                  })
                : null}

              {hint && model && model.isFocused
                ? render('hint', hint, {
                    className: cx(`Form-hint`)
                  })
                : null}

              {model &&
              !model.valid &&
              showErrorMsg !== false &&
              Array.isArray(model.errors) ? (
                <ul className={cx(`Form-feedback`)}>
                  {model.errors.map((msg: string, key: number) => (
                    <li key={key}>{msg}</li>
                  ))}
                </ul>
              ) : null}
              {renderDescription !== false && description
                ? render('description', description, {
                    className: cx(
                      `Form-description`,
                      descriptionClassName,
                      setThemeClassName({
                        ...props,
                        name: 'descriptionClassName',
                        id,
                        themeCss,
                        extra: 'item'
                      })
                    )
                  })
                : null}
            </>
          )}
        </div>
      );
    },

    inline: (props: FormItemProps, renderControl: () => JSX.Element) => {
      let {
        className,
        style,
        classnames: cx,
        desc,
        description,
        label,
        render,
        required,
        caption,
        descriptionClassName,
        captionClassName,
        formItem: model,
        remark,
        labelRemark,
        env,
        hint,
        renderLabel,
        renderDescription,
        data,
        showErrorMsg,
        mobileUI,
        translate: __,
        static: isStatic,
        staticClassName,
        themeCss,
        wrapperCustomStyle,
        id
      } = props;
      const labelWidth = props.labelWidth || props.formLabelWidth;
      description = description || desc;

      return (
        <div
          data-role="form-item"
          data-amis-name={props.name}
          className={cx(
            `Form-item Form-item--inline`,
            isStatic && staticClassName ? staticClassName : className,
            {
              'is-error': model && !model.valid,
              [`is-required`]: required
            },
            model?.errClassNames,
            setThemeClassName({
              ...props,
              name: 'wrapperCustomStyle',
              id,
              themeCss: wrapperCustomStyle,
              extra: 'item'
            })
          )}
          style={style}
        >
          {label && renderLabel !== false ? (
            <label
              className={cx(`Form-label`, getItemLabelClassName(props))}
              style={labelWidth != null ? {width: labelWidth} : undefined}
            >
              <span>
                {label ? render('label', label) : label}
                {required && (label || labelRemark) ? (
                  <span className={cx(`Form-star`)}>*</span>
                ) : null}
                {labelRemark
                  ? render('label-remark', {
                      type: 'remark',
                      icon: labelRemark.icon || 'warning-mark',
                      tooltip: labelRemark,
                      className: cx(`Form-lableRemark`),
                      mobileUI,
                      container: props.popOverContainer || env.getModalContainer
                    })
                  : null}
              </span>
            </label>
          ) : null}

          <div className={cx(`Form-value`)}>
            {renderControl()}

            {caption
              ? render('caption', caption, {
                  className: cx(`Form-caption`, captionClassName)
                })
              : null}

            {remark
              ? render('remark', {
                  type: 'remark',
                  icon: remark.icon || 'warning-mark',
                  className: cx(`Form-remark`),
                  tooltip: remark,
                  mobileUI,
                  container: props.popOverContainer || env.getModalContainer
                })
              : null}

            {hint && model && model.isFocused
              ? render('hint', hint, {
                  className: cx(`Form-hint`)
                })
              : null}

            {model &&
            !model.valid &&
            showErrorMsg !== false &&
            Array.isArray(model.errors) ? (
              <ul className={cx(`Form-feedback`)}>
                {model.errors.map((msg: string, key: number) => (
                  <li key={key}>{msg}</li>
                ))}
              </ul>
            ) : null}

            {renderDescription !== false && description
              ? render('description', description, {
                  className: cx(
                    `Form-description`,
                    descriptionClassName,
                    setThemeClassName({
                      ...props,
                      name: 'descriptionClassName',
                      id,
                      themeCss,
                      extra: 'item'
                    })
                  )
                })
              : null}
          </div>
        </div>
      );
    },

    row: (props: FormItemProps, renderControl: () => JSX.Element) => {
      let {
        className,
        style,
        classnames: cx,
        desc,
        description,
        label,
        render,
        required,
        caption,
        remark,
        labelRemark,
        env,
        descriptionClassName,
        captionClassName,
        formItem: model,
        renderLabel,
        renderDescription,
        hint,
        data,
        showErrorMsg,
        mobileUI,
        translate: __,
        static: isStatic,
        staticClassName,
        wrapperCustomStyle,
        themeCss,
        id
      } = props;
      description = description || desc;
      const labelWidth = props.labelWidth || props.formLabelWidth;
      return (
        <div
          data-role="form-item"
          data-amis-name={props.name}
          className={cx(
            `Form-item Form-item--row`,
            isStatic && staticClassName ? staticClassName : className,
            {
              'is-error': model && !model.valid,
              [`is-required`]: required
            },
            model?.errClassNames,
            setThemeClassName({
              ...props,
              name: 'wrapperCustomStyle',
              id,
              themeCss: wrapperCustomStyle,
              extra: 'item'
            })
          )}
          style={style}
        >
          <div className={cx('Form-rowInner')}>
            {label && renderLabel !== false ? (
              <label
                className={cx(`Form-label`, getItemLabelClassName(props))}
                style={labelWidth != null ? {width: labelWidth} : undefined}
              >
                <span>
                  {render('label', label)}
                  {required && (label || labelRemark) ? (
                    <span className={cx(`Form-star`)}>*</span>
                  ) : null}
                  {labelRemark
                    ? render('label-remark', {
                        type: 'remark',
                        icon: labelRemark.icon || 'warning-mark',
                        tooltip: labelRemark,
                        className: cx(`Form-lableRemark`),
                        mobileUI,
                        container:
                          props.popOverContainer || env.getModalContainer
                      })
                    : null}
                </span>
              </label>
            ) : null}

            {renderControl()}

            {caption
              ? render('caption', caption, {
                  className: cx(`Form-caption`, captionClassName)
                })
              : null}

            {remark
              ? render('remark', {
                  type: 'remark',
                  icon: remark.icon || 'warning-mark',
                  className: cx(`Form-remark`),
                  tooltip: remark,
                  container: props.popOverContainer || env.getModalContainer
                })
              : null}
          </div>

          {hint && model && model.isFocused
            ? render('hint', hint, {
                className: cx(`Form-hint`)
              })
            : null}

          {model &&
          !model.valid &&
          showErrorMsg !== false &&
          Array.isArray(model.errors) ? (
            <ul className={cx('Form-feedback')}>
              {model.errors.map((msg: string, key: number) => (
                <li key={key}>{msg}</li>
              ))}
            </ul>
          ) : null}

          {description && renderDescription !== false
            ? render('description', description, {
                className: cx(
                  `Form-description`,
                  descriptionClassName,
                  setThemeClassName({
                    ...props,
                    name: 'descriptionClassName',
                    id,
                    themeCss,
                    extra: 'item'
                  })
                )
              })
            : null}
        </div>
      );
    },

    flex: (props: FormItemProps, renderControl: () => JSX.Element) => {
      let {
        className,
        style,
        classnames: cx,
        desc,
        description,
        label,
        render,
        required,
        caption,
        remark,
        labelRemark,
        env,
        descriptionClassName,
        captionClassName,
        formItem: model,
        renderLabel,
        renderDescription,
        hint,
        data,
        showErrorMsg,
        mobileUI,
        translate: __,
        static: isStatic,
        staticClassName,
        wrapperCustomStyle,
        themeCss,
        id
      } = props;

      let labelAlign =
        (props.labelAlign !== 'inherit' && props.labelAlign) ||
        props.formLabelAlign;
      const labelWidth = props.labelWidth || props.formLabelWidth;
      description = description || desc;
      return (
        <div
          data-role="form-item"
          data-amis-name={props.name}
          className={cx(
            `Form-item Form-item--flex`,
            isStatic && staticClassName ? staticClassName : className,
            {
              'is-error': model && !model.valid,
              [`is-required`]: required
            },
            model?.errClassNames,
            setThemeClassName({
              ...props,
              name: 'wrapperCustomStyle',
              id,
              themeCss: wrapperCustomStyle,
              extra: 'item'
            })
          )}
          style={style}
        >
          <div
            className={cx(
              'Form-flexInner',
              labelAlign && `Form-flexInner--label-${labelAlign}`
            )}
          >
            {label && renderLabel !== false ? (
              <label
                className={cx(`Form-label`, getItemLabelClassName(props))}
                style={
                  labelWidth != null
                    ? {width: labelAlign === 'top' ? '100%' : labelWidth}
                    : undefined
                }
              >
                <span>
                  {render('label', label)}
                  {required && (label || labelRemark) ? (
                    <span className={cx(`Form-star`)}>*</span>
                  ) : null}
                  {labelRemark
                    ? render('label-remark', {
                        type: 'remark',
                        icon: labelRemark.icon || 'warning-mark',
                        tooltip: labelRemark,
                        className: cx(`Form-lableRemark`),
                        mobileUI,
                        container:
                          props.popOverContainer || env.getModalContainer
                      })
                    : null}
                </span>
              </label>
            ) : null}

            <div className={cx(`Form-value`)}>
              {renderControl()}

              {caption
                ? render('caption', caption, {
                    className: cx(`Form-caption`, captionClassName)
                  })
                : null}

              {remark
                ? render('remark', {
                    type: 'remark',
                    icon: remark.icon || 'warning-mark',
                    className: cx(`Form-remark`),
                    tooltip: remark,
                    container: props.popOverContainer || env.getModalContainer
                  })
                : null}
              {hint && model && model.isFocused
                ? render('hint', hint, {
                    className: cx(`Form-hint`)
                  })
                : null}

              {model &&
              !model.valid &&
              showErrorMsg !== false &&
              Array.isArray(model.errors) ? (
                <ul className={cx('Form-feedback')}>
                  {model.errors.map((msg: string, key: number) => (
                    <li key={key}>{msg}</li>
                  ))}
                </ul>
              ) : null}

              {description && renderDescription !== false
                ? render('description', description, {
                    className: cx(
                      `Form-description`,
                      descriptionClassName,
                      setThemeClassName({
                        ...props,
                        name: 'descriptionClassName',
                        id,
                        themeCss,
                        extra: 'item'
                      })
                    )
                  })
                : null}
            </div>
          </div>
        </div>
      );
    }
  };

  render() {
    const {
      formMode,
      inputOnly,
      wrap,
      render,
      formItem: model,
      css,
      themeCss,
      id,
      wrapperCustomStyle,
      env,
      classnames: cx,
      popOverContainer,
      data
    } = this.props;
    const mode = this.props.mode || formMode;

    if (wrap === false || inputOnly) {
      return this.renderControl();
    }

    const renderLayout =
      FormItemWrap.layoutRenderers[mode] ||
      FormItemWrap.layoutRenderers['normal'];

    return (
      <>
        {renderLayout(this.props, this.renderControl.bind(this))}

        {model
          ? render(
              'modal',
              {
                type: 'dialog',
                ...model.dialogSchema
              },
              {
                show: model.dialogOpen,
                onClose: this.handleDialogClose,
                onConfirm: this.handleDialogConfirm,
                data: model.dialogData,
                formStore: undefined
              }
            )
          : null}

        {model ? (
          <Overlay
            container={popOverContainer || this.target}
            target={() => this.target}
            placement={model.popOverSchema?.placement || 'left-bottom-left-top'}
            show={model.popOverOpen}
          >
            <PopOver
              className={cx(
                `Autofill-popOver`,
                model.popOverSchema?.popOverClassName
              )}
              style={{
                minWidth: this.target ? this.target.offsetWidth : undefined
              }}
              offset={model.popOverSchema?.offset}
              onHide={this.closePopOver}
            >
              {render('popOver-auto-fill-form', model.popOverSchema?.body, {
                // data: model.popOverData,
                onAction: this.handlePopOverAction,
                onSubmit: this.handlePopOverConfirm
              })}
            </PopOver>
          </Overlay>
        ) : null}
        <CustomStyle
          {...this.props}
          config={{
            themeCss: themeCss || css,
            classNames: [
              {
                key: 'labelClassName',
                weights: {
                  default: {
                    suf: `.${cx('Form-label')}`,
                    parent: `.${cx('Form-item')}`
                  }
                }
              },
              {
                key: 'descriptionClassName'
              }
            ],
            wrapperCustomStyle,
            id: id && id + '-item'
          }}
          env={env}
        />
      </>
    );
  }
}

// 白名单形式，只有这些属性发生变化，才会往下更新。
// 除非配置  strictMode
export const detectProps = [
  'formPristine', // 这个千万不能干掉。
  'formInited',
  'addable',
  'addButtonClassName',
  'addButtonText',
  'addOn',
  'btnClassName',
  'btnLabel',
  'style',
  'btnDisabled',
  'className',
  'clearable',
  'columns',
  'columnsCount',
  'controls',
  'desc',
  'description',
  'disabled',
  'static',
  'staticClassName',
  'staticLabelClassName',
  'staticInputClassName',
  'draggable',
  'editable',
  'editButtonClassName',
  'formHorizontal',
  'formMode',
  'hideRoot',
  'horizontal',
  'icon',
  'inline',
  'inputClassName',
  'label',
  'labelClassName',
  'labelField',
  'language',
  'level',
  'max',
  'maxRows',
  'min',
  'minRows',
  'multiLine',
  'multiple',
  'option',
  'placeholder',
  'removable',
  'required',
  'remark',
  'hint',
  'rows',
  'searchable',
  'showCompressOptions',
  'size',
  'step',
  'showInput',
  'unit',
  'value',
  'diffValue',
  'borderMode',
  'items',
  'showCounter',
  'minLength',
  'maxLength',
  'embed',
  'displayMode',
  'revealPassword',
  'loading',
  'themeCss',
  'formLabelAlign',
  'formLabelWidth',
  'formHorizontal',
  'labelAlign',
  'colSize'
];

export function asFormItem(config: Omit<FormItemConfig, 'component'>) {
  return (Control: FormControlComponent) => {
    const supportRef =
      Control.prototype instanceof React.Component ||
      (Control as any).$$typeof === Symbol.for('react.forward_ref');

    // 兼容老的 FormItem 用法。
    if (config.validate && !Control.prototype.validate) {
      const fn = config.validate;
      Control.prototype.validate = function () {
        const host = {
          input: this
        };

        return fn.apply(host, arguments);
      };
    } else if (config.validate) {
      console.error(
        'FormItem配置中的 validate 将不起作用，因为类的成员函数中已经定义了 validate 方法，将优先使用类里面的实现。'
      );
    }

    if (config.storeType) {
      Control = HocStoreFactory({
        storeType: config.storeType,
        extendsData: config.extendsData
      })(observer(Control));
      delete config.storeType;
    }

    return wrapControl(
      config,
      hoistNonReactStatic(
        class extends FormItemWrap {
          static defaultProps: any = {
            initAutoFill: 'fillIfNotSet',
            className: '',
            renderLabel: config.renderLabel,
            renderDescription: config.renderDescription,
            sizeMutable: config.sizeMutable,
            wrap: config.wrap,
            showErrorMsg: config.showErrorMsg,
            ...Control.defaultProps
          };
          static propsList: any = [
            'value',
            'defaultValue',
            'onChange',
            'setPrinstineValue',
            'readOnly',
            'strictMode',
            ...((Control as any).propsList || [])
          ];

          static displayName: string = `FormItem${
            config.type ? `(${config.type})` : ''
          }`;
          static ComposedComponent = Control;

          ref: any;

          constructor(props: FormControlProps) {
            super(props);
            this.refFn = this.refFn.bind(this);
            this.getData = this.getData.bind(this);

            const {validations, formItem: model} = props;

            // 组件注册的时候可能默认指定验证器类型
            if (model && !validations && config.validations) {
              model.config({
                rules: config.validations
              });
            }
          }

          shouldComponentUpdate(nextProps: FormControlProps) {
            if (
              config.shouldComponentUpdate?.(this.props, nextProps) ||
              nextProps.strictMode === false ||
              config.strictMode === false
            ) {
              return true;
            }

            // 把可能会影响视图的白名单弄出来，减少重新渲染次数。
            if (
              anyChanged(
                detectProps.concat(config.detectProps || []),
                this.props,
                nextProps
              )
            ) {
              return true;
            }

            return false;
          }

          getWrappedInstance() {
            return this.ref;
          }

          refFn(ref: any) {
            this.ref = ref;
          }

          getData() {
            return this.props.data;
          }

          renderControl() {
            const {
              // 这里解构，不可轻易删除，避免被rest传到子组件
              inputClassName,
              formItem: model,
              classnames: cx,
              children,
              type,
              size,
              defaultSize,
              mobileUI,
              ...rest
            } = this.props;

            const isRuleSize =
              size && ['xs', 'sm', 'md', 'lg', 'full'].includes(size);

            const controlSize = isRuleSize ? size : defaultSize;

            return (
              <>
                <Control
                  {...rest}
                  // 因为 formItem 内部可能不会更新到最新的 data，所以暴露个方法可以获取到最新的
                  // 获取不到最新的因为做了限制，只有表单项目 name 关联的数值变化才更新
                  getData={this.getData}
                  mobileUI={mobileUI}
                  onOpenDialog={this.handleOpenDialog}
                  size={config.sizeMutable !== false ? undefined : size}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                  type={type}
                  classnames={cx}
                  ref={supportRef ? this.refFn : undefined}
                  forwardedRef={supportRef ? undefined : this.refFn}
                  formItem={model}
                  style={{
                    width: !isRuleSize && size ? size : undefined
                  }}
                  className={cx(
                    `Form-control`,
                    {
                      'is-inline': !!rest.inline && !mobileUI,
                      'is-error': model && !model.valid,
                      'is-full': size === 'full',
                      'is-thin': config.thin,
                      [`Form-control--withSize Form-control--size${ucFirst(
                        controlSize
                      )}`]:
                        config.sizeMutable !== false &&
                        typeof controlSize === 'string' &&
                        !!controlSize &&
                        controlSize !== 'full'
                    },
                    model?.errClassNames,
                    getItemInputClassName(this.props)
                  )}
                ></Control>
              </>
            );
          }
        },
        Control
      ) as any
    );
  };
}

export function registerFormItem(config: FormItemConfig): RendererConfig {
  let Control = asFormItem(config)(config.component);

  return registerRenderer({
    ...config,
    weight: typeof config.weight !== 'undefined' ? config.weight : -100, // 优先级高点
    component: Control as any,
    isFormItem: true
  });
}

export function FormItem(config: FormItemBasicConfig) {
  return function (component: FormControlComponent): any {
    const renderer = registerFormItem({
      ...config,
      component
    });

    return renderer.component as any;
  };
}

export function getFormItemByName(name: string) {
  return renderersMap[name];
}

export default FormItem;
