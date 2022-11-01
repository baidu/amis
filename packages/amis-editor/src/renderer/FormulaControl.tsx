/**
 * @file 表达式控件
 */

import React from 'react';
import debounce from 'lodash/debounce';
import uniqBy from 'lodash/uniqBy';
import isNumber from 'lodash/isNumber';
import isBoolean from 'lodash/isBoolean';
import isPlainObject from 'lodash/isPlainObject';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import isEqual from 'lodash/isEqual';
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
import {PickerContainer, relativeValueRe} from 'amis';
import {FormulaEditor} from 'amis-ui/lib/components/formula/Editor';

import {autobind} from 'amis-editor-core';

import type {
  VariableItem,
  FuncGroup
} from 'amis-ui/lib/components/formula/Editor';
import {dataMapping, FormControlProps} from 'amis-core';
import type {BaseEventContext} from 'amis-editor-core';
import {EditorManager} from 'amis-editor-core';

export enum FormulaDateType {
  NotDate, // 不是时间类
  IsDate, // 日期时间类
  IsRange // 日期时间范围类
}

export interface FormulaControlProps extends FormControlProps {
  manager?: EditorManager;

  /**
   * 用于提示的变量集合，默认为空
   */
  variables?: Array<VariableItem>;

  /**
   * 变量展现模式，可选值：'tabs' ｜ 'tree'
   */
  variableMode?: 'tabs' | 'tree';

  /**
   * 函数集合，默认不需要传，即  amis-formula 里面那个函数
   * 如果有扩充，则需要传。
   */
  functions: Array<FuncGroup>;

  /**
   * 顶部标题，默认为表达式
   */
  header: string;

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
   * 备注: 可用于设置指定组件类型编辑默认值
   */
  rendererSchema?: any; // SchemaObject | undefined;

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
  valueType?: string;

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
}

interface FormulaControlState {
  /** 变量数据 */
  variables: any;

  variableMode?: 'tree' | 'tabs';
}

export default class FormulaControl extends React.Component<
  FormulaControlProps,
  FormulaControlState
> {
  static defaultProps: Partial<FormulaControlProps> = {
    simple: false,
    DateTimeType: FormulaDateType.NotDate
  };
  isUnmount: boolean;

  constructor(props: FormulaControlProps) {
    super(props);
    this.state = {
      variables: this.normalizeVariables(props.variables), // 备注: 待沟通
      variableMode: 'tabs'
    };
  }

  componentDidMount(): void {
    this.getVariables();
  }

  componentDidUpdate(prevProps: FormulaControlProps) {
    // 优先使用props中的变量数据
    this.getVariables();
    if (this.props.data !== prevProps.data) {
      this.setState({
        variables: dataMapping(this.props.variables, this.props.data)
      });
    }
  }

  componentWillUnmount() {
    this.isUnmount = true;
  }

  // 组件默认值设置交互中未使用
  normalizeVariables(variables: any) {
    if (!variables) {
      return [];
    }

    if (
      variables &&
      variables.some((item: any) => isExpression(item.children))
    ) {
      variables = dataMapping(variables, this.props.data);
    }

    const {context} = this.props;
    // 自身字段
    const field = this.props?.data?.name;
    const ancestorField = context?.node?.ancestorField;

    return uniqBy(
      [
        ...(Array.isArray(variables) ? variables : []),
        ...(ancestorField
          ? ancestorField.map((item: any) => ({
              label: item,
              value: `this.${item}`
            }))
          : []),
        ...(field ? [{label: field, value: `this.${field}`}] : [])
      ],
      'value'
    );
  }

  // 设置 variables
  getVariables() {
    if (!this.props.variables) {
      // 从amis数据域中取变量数据
      this.resolveVariablesFromScope().then(variables => {
        if (Array.isArray(variables)) {
          const vars = variables.filter(item => item.children?.length);
          if (!this.isUnmount && !isEqual(vars, this.state.variables)) {
            this.setState({
              variables: vars
            });
          }
        }
      });
    }
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

  // 判断是否是期望类型
  @autobind
  isExpectType(value: any): boolean {
    if (value === null || value === undefined) {
      return true; // 数值为空不进行类型识别
    }
    const {rendererSchema} = this.props;
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

  async resolveVariablesFromScope() {
    const {node, manager} = this.props.formProps || this.props;
    await manager?.getContextSchemas(node);
    const dataPropsAsOptions = manager?.dataSchema?.getDataPropsAsOptions();

    if (dataPropsAsOptions) {
      return dataPropsAsOptions.map((item: any) => ({
        selectMode: 'tree',
        ...item
      }));
    }
    return [];
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
      const start_end = str?.split(',');
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
      str.indexOf('}') === str.length - 1 &&
      str.slice(0, 2) === '${' &&
      str.slice(-1) === '}'
    ) {
      // 非最外层内容还存在表达式情况
      if (isExpression(str.slice(2, -1))) {
        return str;
      }
      return str.slice(2, -1);
    }
    return str;
  }

  @autobind
  handleConfirm(value: any) {
    const val = !value
      ? undefined
      : isExpression(value) || this.hasDateShortcutkey(value)
      ? value
      : `\${${value}}`;
    this.props?.onChange?.(val);
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
    const {data, name} = this.props;

    let curRendererSchema: any = null;
    if (rendererSchema) {
      curRendererSchema = Object.assign({}, rendererSchema, data, {
        type: rendererSchema.type ?? data.type
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
        'value'
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
      } else if (!curRendererSchema.placeholder) {
        curRendererSchema.placeholder = '请输入静态值';
      }

      // 设置popOverContainer
      curRendererSchema.popOverContainer = window.document.body;
    }

    return curRendererSchema;
  }

  @autobind
  renderFormulaValue(item: any) {
    const html = {__html: item.html};
    // bca-disable-next-line
    return <span dangerouslySetInnerHTML={html}></span>;
  }

  @autobind
  getContextData() {
    // 当前数据域
    return (
      this.props.data?.__super?.__props__?.data ||
      this.props.manager?.amisStore ||
      {}
    );
  }

  render() {
    const {
      className,
      label,
      value,
      header,
      variables,
      placeholder,
      simple,
      rendererSchema,
      rendererWrapper,
      manager,
      useExternalFormData = false,
      render,
      ...rest
    } = this.props;

    // 自身字段
    const selfName = this.props?.data?.name;

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
    const isTypeError = !this.isExpectType(value);

    const isError = isLoop || isTypeError;

    const highlightValue = isExpression(value)
      ? FormulaEditor.highlightValue(value, this.state.variables)
      : value;

    // 公式表达式弹窗内容过滤
    const filterValue = isExpression(value)
      ? this.transExpr(value)
      : this.hasDateShortcutkey(value)
      ? value
      : undefined;

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
              placeholder={placeholder}
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
        {!simple && (isExpr || this.hasDateShortcutkey(value)) && (
          <TooltipWrapper
            trigger="hover"
            placement="top"
            style={{fontSize: '12px'}}
            tooltip={{
              tooltipTheme: 'dark',
              mouseLeaveDelay: 20,
              content: value
            }}
          >
            <div className="ae-editor-FormulaControl-tooltipBox">
              <ResultBox
                className={cx(
                  'ae-editor-FormulaControl-ResultBox',
                  isError ? 'is-error' : ''
                )}
                allowInput={false}
                clearable={true}
                value={value}
                result={{html: '已配置'}}
                itemRender={this.renderFormulaValue}
                onChange={this.handleInputChange}
                onResultChange={() => {
                  this.handleInputChange(undefined);
                }}
              />
            </div>
          </TooltipWrapper>
        )}
        <PickerContainer
          showTitle={false}
          bodyRender={({
            value,
            onChange
          }: {
            onChange: (value: any) => void;
            value: any;
          }) => {
            return (
              <FormulaEditor
                {...rest}
                evalMode={true}
                variableMode={rest.variableMode ?? this.state.variableMode}
                variables={this.state.variables}
                header={header || '新表达式语法'}
                value={filterValue}
                onChange={onChange}
                selfVariableName={selfName}
              />
            );
          }}
          value={value}
          onConfirm={this.handleConfirm}
          size="md"
        >
          {({onClick}: {onClick: (e: React.MouseEvent) => void}) => (
            <Button
              size="sm"
              tooltip={{
                enterable: false,
                content: '点击配置表达式',
                placement: 'left',
                mouseLeaveDelay: 0
              }}
              onClick={onClick}
              // active={simple && value} // 不需要，避免 hover 时无任何反馈效果
            >
              <Icon
                icon="function"
                className={cx('ae-editor-FormulaControl-icon', 'icon', {
                  ['is-filled']: !!value
                })}
              />
            </Button>
          )}
        </PickerContainer>
        {isError && (
          <div className="desc-msg error-msg">
            {isLoop ? '当前表达式异常（存在循环引用）' : '数值类型不匹配'}
          </div>
        )}
      </div>
    );
  }
}

@FormItem({
  type: 'ae-formulaControl'
})
export class FormulaControlRenderer extends FormulaControl {}
