import React from 'react';
import inRange from 'lodash/inRange';
import {
  OptionsControl,
  createObject,
  autobind,
  hasAbility,
  columnsSplit,
  flattenTreeWithLeafNodes,
  getVariable,
  CustomStyle,
  setThemeClassName,
  formateCheckThemeCss
} from 'amis-core';
import type {ActionObject, Api, OptionsControlProps, Option} from 'amis-core';
import {Checkbox, Icon, Spinner} from 'amis-ui';
import {FormOptionsSchema} from '../../Schema';
import {supportStatic} from './StaticHoc';
import type {TestIdBuilder} from 'amis-core';
import debounce from 'lodash/debounce';

/**
 * 复选框
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/checkboxes
 */
export interface CheckboxesControlSchema extends FormOptionsSchema {
  type: 'checkboxes';

  /**
   * 是否开启全选功能
   */
  checkAll?: boolean;

  /**
   * 是否默认全选
   */
  defaultCheckAll?: boolean;

  /**
   * 全选/不选文案
   */
  checkAllText?: string;
  /**
   * 每行显示多少个
   */
  columnsCount?: number | number[];

  /**
   * 自定义选项展示
   */
  menuTpl?: string;
  testIdBuilder?: TestIdBuilder;
}

export interface CheckboxesProps
  extends OptionsControlProps,
    Omit<
      CheckboxesControlSchema,
      | 'options'
      | 'type'
      | 'className'
      | 'descriptionClassName'
      | 'inputClassName'
    > {
  placeholder?: any;
  itemClassName?: string;
  columnsCount?: number | number[];
  labelClassName?: string;
  onAdd?: () => void;
  addApi?: Api;
  creatable: boolean;
  createBtnLabel: string;
  editable?: boolean;
  removable?: boolean;
  optionType?: 'default' | 'button';
  menuTpl?: string;
}

export default class CheckboxesControl extends React.Component<
  CheckboxesProps,
  any
> {
  static defaultProps = {
    columnsCount: 1,
    multiple: true,
    placeholder: 'placeholder.noOption',
    creatable: false,
    inline: true,
    createBtnLabel: 'Select.createLabel',
    optionType: 'default'
  };

  checkboxRef: React.RefObject<HTMLDivElement> = React.createRef();
  checkboxRefObserver: ResizeObserver;
  childRefs: Array<any> = [];

  doAction(action: ActionObject, data: object, throwErrors: boolean) {
    const {resetValue, onChange, formStore, store, name} = this.props;
    const actionType = action?.actionType as string;

    if (actionType === 'clear') {
      onChange('');
    } else if (actionType === 'reset') {
      const pristineVal =
        getVariable(formStore?.pristine ?? store?.pristine, name) ?? resetValue;
      onChange(pristineVal ?? '');
    }
  }

  reload(subpath?: string, query?: any) {
    const reload = this.props.reloadOptions;
    reload && reload(subpath, query);
  }

  @autobind
  handleAddClick() {
    const {onAdd} = this.props;
    onAdd && onAdd();
  }

  @autobind
  handleEditClick(e: Event, item: any) {
    const {onEdit} = this.props;
    e.preventDefault();
    e.stopPropagation();
    onEdit && onEdit(item);
  }

  @autobind
  handleDeleteClick(e: Event, item: any) {
    const {onDelete} = this.props;
    e.preventDefault();
    e.stopPropagation();
    onDelete && onDelete(item);
  }

  componentDidMount() {
    this.updateBorderStyle();
    const updateBorderStyleFn = debounce(this.updateBorderStyle, 100);
    if (this.checkboxRef.current) {
      // 监听容器宽度变化，更新边框样式
      this.checkboxRefObserver = new ResizeObserver(updateBorderStyleFn);
      this.checkboxRefObserver.observe(this.checkboxRef.current);
    }
  }

  componentWillUnmount() {
    this.checkboxRefObserver?.disconnect();
  }

  @autobind
  updateBorderStyle() {
    if (this.props.optionType !== 'button') {
      return;
    }
    if (!this.childRefs.length) {
      return;
    }
    const children = this.childRefs.map(item => item?.ref);
    let lastOffsetTop = children[0].labelRef.current.offsetTop;
    const options = [];
    const len = children.length;
    options[0] = 'first';
    let lastLineStart = 0;
    for (let i = 1; i < len; i++) {
      const item = children[i];
      // 如果当前元素的 offsetTop 与上一个元素的 offsetTop 不同，则说明是新的一行
      const currentOffsetTop = item.labelRef.current.offsetTop;
      options[i] = '';
      if (currentOffsetTop !== lastOffsetTop) {
        options[i] = 'first';
        options[i - 1] += ' last';
        lastLineStart = i;
        lastOffsetTop = currentOffsetTop;
      }
    }
    options[len - 1] += ' last';
    options.forEach((option, index) => {
      if (index >= lastLineStart) {
        option += ' last-line';
      }
      children[index].setClassName(option);
    });
  }

  renderGroup(option: Option, index: number) {
    const {classnames: cx, labelField} = this.props;

    if (!option.children?.length) {
      return null;
    }

    const children = option.children.map((option, index) =>
      this.renderItem(option, index)
    );

    const body = this.columnsSplit(children);

    return (
      <div
        key={'group-' + index}
        className={cx('CheckboxesControl-group', option.className)}
      >
        <label
          className={cx('CheckboxesControl-groupLabel', option.labelClassName)}
        >
          {option[labelField || 'label']}
        </label>

        {body}
      </div>
    );
  }
  @autobind
  addChildRefs(el: any) {
    el && this.childRefs.push(el);
  }

  renderItem(option: Option, index: number) {
    if (option.children?.length) {
      return this.renderGroup(option, index);
    }

    const {
      render,
      itemClassName,
      onToggle,
      selectedOptions,
      disabled,
      inline,
      labelClassName,
      labelField,
      removable,
      editable,
      translate: __,
      optionType,
      menuTpl,
      data,
      testIdBuilder
    } = this.props;
    const labelText = String(option[labelField || 'label']);
    const optionLabelClassName = option['labelClassName'];
    const itemTestIdBuilder = testIdBuilder?.getChild(
      'item-' + labelText || index
    );

    return (
      <Checkbox
        className={itemClassName}
        key={index}
        onChange={() => onToggle(option)}
        checked={!!~selectedOptions.indexOf(option)}
        disabled={disabled || option.disabled}
        inline={inline}
        labelClassName={optionLabelClassName || labelClassName}
        description={option.description}
        optionType={optionType}
        testIdBuilder={itemTestIdBuilder}
        ref={this.addChildRefs}
      >
        {menuTpl
          ? render(`checkboxes/${index}`, menuTpl, {
              data: createObject(data, option)
            })
          : labelText}
        {removable && hasAbility(option, 'removable') ? (
          <a data-tooltip={__('Select.clear')} data-position="left">
            <Icon
              icon="minus"
              className="icon"
              onClick={(e: any) => this.handleDeleteClick(e, option)}
            />
          </a>
        ) : null}
        {editable && hasAbility(option, 'editable') ? (
          <a data-tooltip="编辑" data-position="left">
            <Icon
              icon="pencil"
              className="icon"
              onClick={(e: any) => this.handleEditClick(e, option)}
            />
          </a>
        ) : null}
      </Checkbox>
    );
  }

  columnsSplit(body: React.ReactNode[]) {
    const {columnsCount, classnames: cx} = this.props;

    const result: Array<any> = [];
    let tmp: Array<React.ReactPortal> = [];
    body.forEach((node: React.ReactPortal) => {
      // 如果有分组，组内单独分列
      if (node && node.key && String(node.key).startsWith('group')) {
        // 夹杂在分组间的无分组选项，分别成块
        if (tmp.length) {
          result.push(columnsSplit(tmp, cx, columnsCount));
          tmp = [];
        }

        result.push(node);
      } else {
        tmp.push(node);
      }
    });
    // 收尾
    tmp.length && result.push(columnsSplit(tmp, cx, columnsCount));

    return result;
  }

  @supportStatic()
  render() {
    const {
      className,
      style,
      disabled,
      placeholder,
      options,
      inline,
      columnsCount,
      selectedOptions,
      onToggle,
      onToggleAll,
      checkAll,
      checkAllText,
      classnames: cx,
      itemClassName,
      labelClassName,
      creatable,
      addApi,
      createBtnLabel,
      translate: __,
      optionType,
      loading,
      loadingConfig,
      themeCss,
      id,
      env,
      classPrefix: ns
    } = this.props;

    let body: Array<React.ReactNode> = [];

    if (options && options.length) {
      body = options.map((option, key) => this.renderItem(option, key));
    }

    if (checkAll && body.length && optionType === 'default') {
      body.unshift(
        <Checkbox
          key="checkall"
          className={itemClassName}
          onChange={onToggleAll}
          checked={!!selectedOptions.length}
          partial={inRange(
            selectedOptions.length,
            0,
            flattenTreeWithLeafNodes(options).length
          )}
          disabled={disabled}
          inline={inline}
          labelClassName={labelClassName}
        >
          {checkAllText ?? __('Checkboxes.selectAll')}
        </Checkbox>
      );
    }

    body = this.columnsSplit(body);

    const css = formateCheckThemeCss(themeCss, 'checkboxes');

    return (
      <div
        className={cx(
          `CheckboxesControl`,
          className,
          setThemeClassName({
            ...this.props,
            name: [
              'checkboxesControlClassName',
              'checkboxesControlCheckedClassName',
              'checkboxesClassName',
              'checkboxesCheckedClassName',
              'checkboxesInnerClassName',
              'checkboxesShowClassName'
            ],
            id,
            themeCss: css
          })
        )}
        ref={this.checkboxRef}
      >
        {body && body.length ? (
          body
        ) : loading ? null : (
          <span className={`Form-placeholder`}>{__(placeholder)}</span>
        )}

        {loading ? (
          <Spinner
            show
            icon="reload"
            size="sm"
            spinnerClassName={cx('Checkboxes-spinner')}
            loadingConfig={loadingConfig}
          />
        ) : null}

        {(creatable || addApi) && !disabled ? (
          <a className={cx('Checkboxes-addBtn')} onClick={this.handleAddClick}>
            <Icon icon="plus" className="icon" />
            {__(createBtnLabel)}
          </a>
        ) : null}
        <CustomStyle
          {...this.props}
          config={{
            themeCss: css,
            classNames: [
              {
                key: 'checkboxesControlClassName',
                weights: {
                  default: {
                    inner: `.${ns}Checkbox:not(.checked):not(.disabled)`
                  },
                  hover: {
                    suf: ` .${ns}Checkbox:not(.disabled):not(.checked)`
                  },
                  disabled: {
                    inner: `.${ns}Checkbox.disabled:not(.checked)`
                  }
                }
              },
              {
                key: 'checkboxesControlCheckedClassName',
                weights: {
                  default: {
                    inner: `.${ns}Checkbox.checked:not(.disabled)`
                  },
                  hover: {
                    suf: ` .${ns}Checkbox.checked:not(.disabled)`
                  },
                  disabled: {
                    inner: `.${ns}Checkbox.checked.disabled`
                  }
                }
              },
              {
                key: 'checkboxesClassName',
                weights: {
                  default: {
                    inner: `.${ns}Checkbox:not(.checked):not(.disabled) > i`
                  },
                  hover: {
                    suf: ` .${ns}Checkbox:not(.disabled):not(.checked)`,
                    inner: '> i'
                  },
                  disabled: {
                    inner: `.${ns}Checkbox.disabled:not(.checked) > i`
                  }
                }
              },
              {
                key: 'checkboxesCheckedClassName',
                weights: {
                  default: {
                    inner: `.${ns}Checkbox:not(.disabled) > i`
                  },
                  hover: {
                    suf: ` .${ns}Checkbox:not(.disabled)`,
                    inner: '> i'
                  },
                  disabled: {
                    inner: `.${ns}Checkbox.disabled > i`
                  }
                }
              },
              {
                key: 'checkboxesInnerClassName',
                weights: {
                  default: {
                    inner: `.${ns}Checkbox:not(.disabled) > i .icon`
                  },
                  hover: {
                    suf: ` .${ns}Checkbox:not(.disabled)`,
                    inner: '> i .icon'
                  },
                  disabled: {
                    inner: `.${ns}Checkbox.disabled > i .icon`
                  }
                }
              },
              {
                key: 'checkboxesShowClassName',
                weights: {
                  default: {
                    inner: `.${ns}Checkbox > i`
                  }
                }
              }
            ],
            id: id
          }}
          env={env}
        />
      </div>
    );
  }
}

@OptionsControl({
  type: 'checkboxes',
  sizeMutable: false,
  thin: true
})
export class CheckboxesControlRenderer extends CheckboxesControl {}
