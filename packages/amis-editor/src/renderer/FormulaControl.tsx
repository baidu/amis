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
import {FormItem, Button, InputBox, Icon, ResultBox} from 'amis';
import {FormulaExec, isExpression} from 'amis';
import {PickerContainer} from 'amis';
import {FormulaEditor} from 'amis-ui/lib/components/formula/Editor';

import {autobind} from 'amis-editor-core';

import type {
  VariableItem,
  FuncGroup
} from 'amis-ui/lib/components/formula/Editor';
import {dataMapping, FormControlProps} from 'amis-core';
import type {BaseEventContext} from 'amis-editor-core';
import {EditorManager} from 'amis-editor-core';

export interface FormulaControlProps extends FormControlProps {
  /**
   * evalMode 即直接就是表达式，否则
   * 需要 ${这里面才是表达式}
   * 默认为 true，即默认不会将表达式用 ${} 包裹
   */
  evalMode?: boolean;

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
}

interface FormulaControlState {
  /** 变量数据 */
  variables: any;

  variableMode?: 'tree' | 'tabs';

  evalMode?: boolean;
}

export default class FormulaControl extends React.Component<
  FormulaControlProps,
  FormulaControlState
> {
  static defaultProps: Partial<FormulaControlProps> = {
    simple: false
  };
  isUnmount: boolean;

  constructor(props: FormulaControlProps) {
    super(props);
    this.state = {
      variables: this.normalizeVariables(props.variables), // 备注: 待沟通
      variableMode: 'tabs',
      evalMode: true
    };
  }

  componentDidUpdate(prevProps: FormulaControlProps) {
    // 优先使用props中的变量数据
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

    const {context, evalMode} = this.props;
    // 自身字段
    const field = this.props?.data?.name;
    const ancestorField = context?.node?.ancestorField;

    return uniqBy(
      [
        ...(Array.isArray(variables) ? variables : []),
        ...(ancestorField
          ? ancestorField.map((item: any) => ({
              label: item,
              value: evalMode ? `this.${item}` : item
            }))
          : []),
        ...(field ? [{label: field, value: `this.${field}`}] : [])
      ],
      'value'
    );
  }

  /**
   * 将 ${xx}（非 \${xx}）替换成 \${xx}
   * 备注: 手动编辑时，自动处理掉 ${xx}，避免识别成 公式表达式
   */
  @autobind
  replaceExpression(expression: any): any {
    if (expression && isString(expression) && isExpression(expression)) {
      return expression.replace(/(^|[^\\])\$\{/g, '\\${');
    }
    return expression;
  }

  // 根据 name 值 判断当前表达式是否 存在循环引用问题
  @autobind
  isLoopExpression(expression: any, selfName: string): boolean {
    if (!expression || !selfName || !isString(expression)) {
      return false;
    }
    const variables = FormulaExec.collect(expression);
    return variables.some((variable: string) => variable === selfName);
  }

  // 判断是否是期望类型
  @autobind
  isExpectType(value: any): boolean {
    if (value === null || value === undefined) {
      return true; // 数值为空不进行类型识别
    }
    const expectType = this.props.valueType;

    if (expectType === null || expectType === undefined) {
      return true; // expectType为空，则不进行类型识别
    }

    // 当前数据域
    const curData = this.getContextData();

    if (
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
    return dataPropsAsOptions || [];
  }

  @autobind
  handleConfirm(value: any) {
    this.props?.onChange?.(value);
  }

  handleSimpleInputChange = debounce(
    (value: any) => {
      const curValue = this.replaceExpression(value);
      this.props?.onChange?.(curValue);
    },
    250,
    {
      trailing: true,
      leading: false
    }
  );

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
        type: rendererSchema.type ?? data.type,
        value: this.props.value ?? rendererSchema.value ?? data.value
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

      // 避免没有清空icon
      if (
        curRendererSchema.clearable !== undefined &&
        !curRendererSchema.clearable
      ) {
        curRendererSchema.clearable = true;
      }

      // 设置统一的占位提示
      if (curRendererSchema.type === 'select') {
        curRendererSchema.placeholder = '请选择默认值';
      } else {
        curRendererSchema.placeholder = '请输入静态默认值';
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
      evalMode,
      rendererSchema,
      rendererWrapper,
      manager,
      useExternalFormData = false,
      render,
      ...rest
    } = this.props;

    const labelText = typeof label === 'string' ? label : '';
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
      ? FormulaEditor.highlightValue(
          value,
          this.state.variables,
          evalMode ?? this.state.evalMode
        )
      : value;

    return (
      <div
        className={cx(
          'ae-editor-FormulaControl',
          isError ? 'is-has-tooltip' : '',
          className
        )}
      >
        {!simple && !rendererSchema && !isExpr && (
          <InputBox
            className="ae-editor-FormulaControl-input"
            value={value}
            clearable={true}
            placeholder={placeholder}
            onChange={this.handleSimpleInputChange}
          />
        )}
        {!simple && rendererSchema && !isExpr && (
          <div
            className={cx(
              'ae-editor-FormulaControl-custom-renderer',
              rendererWrapper ? 'border-wrapper' : ''
            )}
          >
            {render('left', this.filterCustomRendererProps(rendererSchema), {
              inputOnly: true,
              value: value,
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
        {!simple && isExpr && (
          <ResultBox
            className={cx(
              'ae-editor-FormulaControl-ResultBox',
              isError ? 'is-error' : ''
            )}
            allowInput={false}
            clearable={true}
            value={value}
            result={highlightValue}
            itemRender={this.renderFormulaValue}
            onChange={this.handleInputChange}
            onResultChange={() => {
              this.handleInputChange(undefined);
            }}
          />
        )}
        <PickerContainer
          showTitle={false}
          bodyRender={({onClose, value, onChange}) => {
            return (
              <FormulaEditor
                {...rest}
                evalMode={evalMode ?? this.state.evalMode}
                variableMode={rest.variableMode ?? this.state.variableMode}
                variables={this.state.variables}
                header={header || labelText}
                value={isString(value) ? value : undefined}
                onChange={onChange}
                selfVariableName={selfName}
              />
            );
          }}
          value={value}
          onConfirm={this.handleConfirm}
          size="md"
        >
          {({onClick, isOpened}) => (
            <Button
              size="sm"
              tooltip={'点击配置表达式'}
              tooltipPlacement="left"
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
        {isExpr && !isError && (
          <div className="desc-msg info-msg" title={value}>
            {value}
          </div>
        )}
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
