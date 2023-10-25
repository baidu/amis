/**
 * @file 表达式控件
 */

import React from 'react';
import isNumber from 'lodash/isNumber';
import isBoolean from 'lodash/isBoolean';
import isPlainObject from 'lodash/isPlainObject';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import omit from 'lodash/omit';
import cx from 'classnames';
import {
  FormItem,
  Button,
  InputBox,
  Icon,
  ResultBox,
  TooltipWrapper
} from 'amis';
import {FormulaExec, isExpression} from 'amis';
import {FormulaEditor} from 'amis-ui';

import FormulaPicker, {
  CustomFormulaPickerProps
} from './textarea-formula/FormulaPicker';
import {JSONPipeOut, autobind, translateSchema} from 'amis-editor-core';

import type {
  VariableItem,
  FuncGroup
} from 'amis-ui/lib/components/formula/Editor';
import {FormControlProps} from 'amis-core';
import type {BaseEventContext} from 'amis-editor-core';
import {EditorManager} from 'amis-editor-core';
import {reaction} from 'mobx';
import {getVariables} from 'amis-editor-core';

export enum FormulaDateType {
  NotDate, // 不是时间类
  IsDate, // 日期时间类
  IsRange // 日期时间范围类
}

export function renderFormulaValue(item: any) {
  const html = {__html: typeof item === 'string' ? item : item?.html};
  // bca-disable-next-line
  return <span dangerouslySetInnerHTML={html}></span>;
}

export interface FormulaControlProps extends FormControlProps {
  manager?: EditorManager;

  /**
   * 用于提示的变量集合，默认为空
   */
  variables?: Array<VariableItem> | Function;

  /**
   * 配合 variables 使用
   * 当 props.variables 存在时， 是否再从 amis数据域中取变量集合，默认 false;
   */
  requiredDataPropsVariables?: boolean;

  /**
   * 变量展现模式，可选值：'tabs' ｜ 'tree', 默认 tabs
   */
  variableMode?: 'tabs' | 'tree';

  /**
   * 函数集合，默认不需要传，即  amis-formula 里面那个函数
   * 如果有扩充，则需要传。
   */
  functions: Array<FuncGroup>;

  /**
   * 弹窗顶部标题，默认为 "表达式"
   */
  header: string;

  /**
   * 静态输入框的占位提示内容，可用于默认静态输入框 & 自定义自定义渲染器 中
   */
  placeholder: string;

  /**
   * 编辑器上下文数据，用于获取字段所在Form的其他字段
   */
  context: BaseEventContext;

  /**
   * simple 简易模式
   * 备注: 为 true 时，仅显示 公式编辑器 icon 按钮
   */
  simple?: boolean;

  /**
   * 自定义渲染器:
   * 备注: 可用于设置指定组件类型编辑默认值，支持回调函数，但不支持异步获取
   */
  rendererSchema?: any; // SchemaObject | (schema: Schema) => Schema | undefined;

  /**
   * 自定义渲染器 是否需要浅色边框包裹，默认不包裹
   */
  rendererWrapper?: boolean;

  /**
   * 是否需要剔除属性
   */
  needDeleteProps?: Array<string>;

  /**
   * 期望的value类型，可用于校验公式运算结果类型是否匹配
   * 备注1: 当前支持识别的类型有 int、boolean、date、object、array、string；
   * 备注2: 开关组件可以设置 true 和 false 对应的值，如果设置了就不是普通的 boolean 类型；
   * 备注3: 默认都是字符串类型；
   */
  // valueType?: string;

  /**
   * 不在表单项上触发时，传入想要获取变量的 表单props 获取对应变量
   */
  formProps?: any;

  /**
   * 是否使用外部的Form数据
   */
  useExternalFormData?: boolean;

  /**
   * 是否是日期类组件使用formulaControl
   * 日期类 值 使用表达式时，支持 now、+1day、-2weeks、+1hours、+2years等这种相对值写法，不会最外层包裹 ${}
   * 日期类 跨度值 使用表达式时，支持 1day、2weeks、1hours、2years等这种相对值写法，不会最外层包裹 ${}
   * 默认为 FormulaDateType.NotDate
   */
  DateTimeType?: FormulaDateType;

  /**
   * 自定义fx面板
   */
  customFormulaPicker?: React.FC<CustomFormulaPickerProps>;
}

interface FormulaControlState {
  /** 变量数据 */
  variables: any;

  variableMode?: 'tree' | 'tabs';

  formulaPickerOpen: boolean;

  loading: boolean;
}

export default class FormulaControl extends React.Component<
  FormulaControlProps,
  FormulaControlState
> {
  static defaultProps: Partial<FormulaControlProps> = {
    simple: false,
    rendererWrapper: false,
    DateTimeType: FormulaDateType.NotDate,
    requiredDataPropsVariables: false
  };
  isUnmount: boolean;
  unReaction: any;
  appLocale: string;
  appCorpusData: any;

  constructor(props: FormulaControlProps) {
    super(props);
    this.state = {
      variables: [],
      variableMode: 'tree',
      formulaPickerOpen: false,
      loading: false
    };
  }

  async componentDidMount() {
    const editorStore = (window as any).editorStore;
    this.appLocale = editorStore?.appLocale;
    this.appCorpusData = editorStore?.appCorpusData;
    this.unReaction = reaction(
      () => editorStore?.appLocaleState,
      async () => {
        this.appLocale = editorStore?.appLocale;
        this.appCorpusData = editorStore?.appCorpusData;
      }
    );
  }

  componentWillUnmount() {
    this.isUnmount = true;
    this.unReaction?.();
  }

  /**
   * 将 ${xx}（非 \${xx}）替换成 \${xx}
   * 备注: 手动编辑时，自动处理掉 ${xx}，避免识别成 公式表达式
   */
  @autobind
  outReplaceExpression(expression: any): any {
    if (expression && isString(expression) && isExpression(expression)) {
      return expression.replace(/(^|[^\\])\$\{/g, '\\${');
    }
    return expression;
  }

  @autobind
  inReplaceExpression(expression: any): any {
    if (expression && isString(expression)) {
      return expression.replace(/\\\$\{/g, '${');
    }
    return expression;
  }

  // 根据 name 值 判断当前表达式是否 存在循环引用问题
  @autobind
  isLoopExpression(expression: any, selfName: string): boolean {
    if (!expression || !selfName || !isString(expression)) {
      return false;
    }
    let variables = [];
    try {
      variables = FormulaExec.collect(expression);
    } catch (e) {}
    return variables.some((variable: string) => variable === selfName);
  }

  /**
   * 获取rendererSchema的值
   * @returns
   */
  @autobind
  getRendererSchemaFromProps(rendererSchema?: any) {
    if (!rendererSchema) {
      rendererSchema = this.props.rendererSchema;
    }

    if (typeof rendererSchema === 'function') {
      const schema = this.props.data ? {...this.props.data} : undefined;
      return rendererSchema(schema);
    } else {
      return rendererSchema;
    }
  }

  // 判断是否是期望类型
  @autobind
  isExpectType(value: any): boolean {
    if (value === null || value === undefined) {
      return true; // 数值为空不进行类型识别
    }

    const rendererSchema = this.getRendererSchemaFromProps();
    const expectType = this.props.valueType;

    if (expectType === null || expectType === undefined) {
      return true; // expectType为空，则不进行类型识别
    }

    // 当前数据域
    const curData = this.getContextData();

    if (
      rendererSchema.type === 'switch' &&
      (rendererSchema.trueValue !== undefined ||
        rendererSchema.falseValue !== undefined)
    ) {
      // 开关类型组件单独处理
      return (
        rendererSchema.trueValue === value ||
        rendererSchema.falseValue === value
      );
    } else if (
      (expectType === 'number' && isNumber(value)) ||
      (expectType === 'boolean' && isBoolean(value)) ||
      (expectType === 'object' && isPlainObject(value)) ||
      (expectType === 'array' && isArray(value))
    ) {
      return true;
    } else if (isString(value)) {
      if (isExpression(value)) {
        // 根据公式运算结果判断类型
        const formulaValue = FormulaExec.formula(value, curData);
        if (
          (expectType === 'number' && isNumber(formulaValue)) ||
          (expectType === 'boolean' && isBoolean(formulaValue)) ||
          (expectType === 'object' && isPlainObject(formulaValue)) ||
          (expectType === 'array' && isArray(formulaValue)) ||
          (expectType === 'string' && isString(formulaValue))
        ) {
          return true;
        }
      } else if (expectType === 'string') {
        // 非公式字符串
        return true;
      }
    }
    return false;
  }

  matchDate(str: string): boolean {
    const matchDate =
      /^(.+)?(\+|-)(\d+)(minute|min|hour|day|week|month|year|weekday|second|millisecond)s?$/i;
    const m = matchDate.exec(str);
    return m ? (m[1] ? this.matchDate(m[1]) : true) : false;
  }

  matchDateRange(str: string): boolean {
    if (/^(now|today)$/.test(str)) {
      return true;
    }
    return this.matchDate(str);
  }

  // 日期类组件 & 是否存在快捷键判断
  @autobind
  hasDateShortcutkey(str: string): boolean {
    const {DateTimeType} = this.props;

    if (DateTimeType === FormulaDateType.IsDate) {
      if (/^(now|today)$/.test(str)) {
        return true;
      }
      return this.matchDate(str);
    } else if (DateTimeType === FormulaDateType.IsRange) {
      const start_end = str?.split?.(',');
      if (start_end && start_end.length === 2) {
        return (
          this.matchDateRange(start_end[0].trim()) &&
          this.matchDateRange(start_end[1].trim())
        );
      }
    }
    // 非日期类组件使用，也直接false
    // if (DateTimeType === FormulaDateType.NotDate) {
    //   return false;
    // }
    return false;
  }

  @autobind
  transExpr(str: string) {
    if (
      typeof str === 'string' &&
      str?.slice(0, 2) === '${' &&
      str?.slice(-1) === '}'
    ) {
      // 非最外层内容还存在表达式情况
      if (isExpression(str.slice(2, -1))) {
        return str;
      }
      if (str.lastIndexOf('${') > str.indexOf('}') && str.indexOf('}') > -1) {
        return str;
      }
      return str.slice(2, -1);
    }
    return str;
  }

  @autobind
  handleConfirm(value: any) {
    value = value.replace(/\r\n|\r|\n/g, ' ');
    const val = !value
      ? undefined
      : isExpression(value) || this.hasDateShortcutkey(value)
      ? value
      : `\${${value}}`;
    this.props?.onChange?.(val);

    this.closeFormulaPicker();
  }

  /**
   * 公式编辑器打开完成一些异步任务的加载
   */
  @autobind
  async beforeFormulaEditorOpen() {
    const {node, manager, data} = this.props;
    const onFormulaEditorOpen = manager?.config?.onFormulaEditorOpen;

    this.setState({loading: true});

    try {
      if (
        manager &&
        onFormulaEditorOpen &&
        typeof onFormulaEditorOpen === 'function'
      ) {
        const res = await onFormulaEditorOpen(node, manager, data);

        if (res !== false) {
          const variables = await getVariables(this);
          this.setState({variables});
        }
      } else {
        const variables = await getVariables(this);
        this.setState({variables});
      }
    } catch (error) {
      console.error('[amis-editor] onFormulaEditorOpen failed: ', error?.stack);
    }

    this.setState({loading: false});
  }

  @autobind
  async handleFormulaClick() {
    try {
      await this.beforeFormulaEditorOpen();
    } catch (error) {}

    this.setState({
      formulaPickerOpen: true
    });
  }

  @autobind
  closeFormulaPicker() {
    this.setState({formulaPickerOpen: false});
  }

  handleSimpleInputChange = (value: any) => {
    const curValue = this.outReplaceExpression(value);
    this.props?.onChange?.(curValue);
  };

  handleInputChange = (value: any) => {
    this.props?.onChange?.(value);
  };

  // 剔除掉一些用不上的属性
  @autobind
  filterCustomRendererProps(rendererSchema: any) {
    const {data, name, placeholder} = this.props;

    let curRendererSchema: any = null;
    if (rendererSchema) {
      curRendererSchema = Object.assign({}, rendererSchema, {
        type: rendererSchema.type ?? data.type,
        // 目前表单项 wrapControl 还必须依赖一个 name
        // 所以这里先随便取个名字，这里渲染的时候应该是 value 控制，而不是关联 name
        name: 'FORMULA_CONTROL_PLACEHOLDER'
      });

      // 默认要剔除的字段
      const deleteProps = [
        'label',
        'id',
        '$$id',
        'className',
        'style',
        'readOnly',
        'horizontal',
        'size',
        'remark',
        'labelRemark',
        'static',
        'staticOn',
        'hidden',
        'hiddenOn',
        'visible',
        'visibleOn',
        'disabled',
        'disabledOn',
        'required',
        'requiredOn',
        'className',
        'labelClassName',
        'labelAlign',
        'inputClassName',
        'description',
        'autoUpdate',
        'prefix',
        'suffix',
        'unitOptions',
        'keyboard',
        'kilobitSeparator',
        'value',
        'inputControlClassName',
        'css',
        'validateApi',
        'themeCss',
        'onEvent',
        'embed'
      ];

      // 当前组件要剔除的字段
      if (this.props.needDeleteProps) {
        deleteProps.push(...this.props.needDeleteProps);
      }
      if (name && name === 'min') {
        // 避免min影响自身默认值设置
        deleteProps.push('min');
      }
      if (name && name === 'max') {
        // 避免max影响自身默认值设置
        deleteProps.push('max');
      }
      curRendererSchema = omit(curRendererSchema, deleteProps);

      // 设置可清空
      curRendererSchema.clearable = true;

      // 设置统一的占位提示
      if (curRendererSchema.type === 'select') {
        !curRendererSchema.placeholder &&
          (curRendererSchema.placeholder = '请选择静态值');
        curRendererSchema.inputClassName =
          'ae-editor-FormulaControl-select-style';
      } else if (placeholder) {
        curRendererSchema.placeholder = placeholder;
      } else {
        curRendererSchema.placeholder = '请输入静态值';
      }
    }

    JSONPipeOut(curRendererSchema);

    // 对 schema 进行国际化翻译
    if (this.appLocale && this.appCorpusData) {
      return translateSchema(curRendererSchema, this.appCorpusData);
    }

    return curRendererSchema;
  }

  @autobind
  getContextData() {
    let curContextData = this.props.data?.__super?.__props__?.data;

    if (!curContextData) {
      const curComp = this.props.node?.getComponent();
      if (curComp?.props?.data) {
        curContextData = curComp.props.data;
      }
    }
    // 当前数据域
    return curContextData;
  }

  render() {
    const {
      className,
      label,
      value,
      header,
      placeholder,
      simple,
      rendererWrapper,
      manager,
      useExternalFormData = false,
      customFormulaPicker,
      clearable = true,
      render,
      ...rest
    } = this.props;
    const {formulaPickerOpen, variables, variableMode, loading} = this.state;
    const rendererSchema = this.getRendererSchemaFromProps();

    // 判断是否含有公式表达式
    const isExpr = isExpression(value);

    // 判断当前是否有循环引用，备注：非精准识别，待优化
    let isLoop = false;
    if (isExpr && rendererSchema?.name) {
      isLoop = rendererSchema?.name
        ? this.isLoopExpression(value, rendererSchema?.name)
        : false;
    }

    // 判断是否含有公式表达式
    // const isTypeError = !this.isExpectType(value);
    const exprValue = this.transExpr(value);

    const isError = isLoop;

    const FormulaPickerCmp = customFormulaPicker ?? FormulaPicker;

    const highlightValue = isExpression(value)
      ? FormulaEditor.highlightValue(exprValue, variables) || {
          html: exprValue
        }
      : value;

    // 公式表达式弹窗内容过滤
    const filterValue = isExpression(value)
      ? exprValue
      : this.hasDateShortcutkey(value)
      ? value
      : undefined;

    // 值 是表达式或日期快捷
    const isFx = !simple && (isExpr || this.hasDateShortcutkey(value));

    return (
      <div
        className={cx(
          'ae-editor-FormulaControl',
          isError ? 'is-has-tooltip' : '',
          className
        )}
      >
        {/* 非简单模式 & 非表达式 & 非日期快捷 & 无自定义渲染 */}
        {!simple &&
          !isExpr &&
          !this.hasDateShortcutkey(value) &&
          !rendererSchema && (
            <InputBox
              className="ae-editor-FormulaControl-input"
              value={this.inReplaceExpression(value)}
              clearable={true}
              placeholder={placeholder ?? '请输入静态值'}
              onChange={this.handleSimpleInputChange}
            />
          )}
        {/* 非简单模式 & 非表达式 & 非日期快捷 & 自定义渲染 */}
        {!simple &&
          !isExpr &&
          !this.hasDateShortcutkey(value) &&
          rendererSchema && (
            <div
              className={cx(
                'ae-editor-FormulaControl-custom-renderer',
                rendererWrapper ? 'border-wrapper' : ''
              )}
            >
              {render('inner', this.filterCustomRendererProps(rendererSchema), {
                inputOnly: true,
                value: this.inReplaceExpression(value),
                data: useExternalFormData
                  ? {
                      ...this.props.data
                    }
                  : {},
                onChange: this.handleSimpleInputChange,
                manager: manager
              })}
            </div>
          )}
        {/* 非简单模式 &（表达式 或 日期快捷）*/}
        {isFx && (
          <TooltipWrapper
            trigger="hover"
            placement="top"
            style={{fontSize: '12px'}}
            tooltip={{
              tooltipTheme: 'dark',
              mouseLeaveDelay: 20,
              content: exprValue,
              children: () => renderFormulaValue(highlightValue)
            }}
          >
            <div className="ae-editor-FormulaControl-tooltipBox">
              <div
                className="ae-editor-FormulaControl-ResultBox-wrapper"
                onClick={this.handleFormulaClick}
              >
                <ResultBox
                  className={cx(
                    'ae-editor-FormulaControl-ResultBox',
                    isError ? 'is-error' : ''
                  )}
                  allowInput={false}
                  value={value}
                  result={{
                    html: this.hasDateShortcutkey(value)
                      ? value
                      : highlightValue?.html
                  }}
                  itemRender={renderFormulaValue}
                  onChange={this.handleInputChange}
                  onResultChange={() => {
                    this.handleInputChange(undefined);
                  }}
                />
              </div>
              {value && (
                <Icon
                  icon="input-clear"
                  className="input-clear-icon"
                  onClick={() => this.handleInputChange('')}
                />
              )}
            </div>
          </TooltipWrapper>
        )}
        <Button
          className="ae-editor-FormulaControl-button"
          size="sm"
          tooltip={{
            enterable: false,
            content: '点击配置表达式',
            tooltipTheme: 'dark',
            placement: 'left',
            mouseLeaveDelay: 0
          }}
          onClick={this.handleFormulaClick}
          loading={loading}
        >
          <Icon
            icon="input-fx"
            className={cx('ae-editor-FormulaControl-icon', 'icon', {
              ['is-filled']: !!isFx
            })}
          />
        </Button>
        {isError && (
          <div className="desc-msg error-msg">
            {isLoop ? '当前表达式异常（存在循环引用）' : '数值类型不匹配'}
          </div>
        )}

        {formulaPickerOpen ? (
          <FormulaPickerCmp
            {...this.props}
            value={filterValue}
            initable={true}
            header={header}
            variables={variables}
            variableMode={rest.variableMode ?? variableMode}
            evalMode={true}
            onClose={this.closeFormulaPicker}
            onConfirm={this.handleConfirm}
          />
        ) : null}
      </div>
    );
  }
}

@FormItem({
  type: 'ae-formulaControl',
  detectProps: ['rendererSchema']
})
export class FormulaControlRenderer extends FormulaControl {}
