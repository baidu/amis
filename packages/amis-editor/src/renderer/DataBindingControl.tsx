import {
  Icon,
  InputBox,
  SchemaVariableListPicker,
  FormItem,
  SearchBox,
  CollapseGroup,
  PickerContainer,
  Collapse,
  Checkbox,
  Spinner
} from 'amis';
import {
  FormControlProps,
  generateIcon,
  Renderer,
  RendererProps
} from 'amis-core';
import {debounce, remove} from 'lodash';
import React from 'react';
import {
  EditorManager,
  EditorNodeType,
  autobind,
  DSField,
  DSFieldGroup
} from 'amis-editor-core';
import {matchSorter} from 'match-sorter';
import {SchemaCollection} from 'amis/lib/Schema';
import {default as cx} from 'classnames';

export interface DataBindingProps extends FormControlProps {
  node: EditorNodeType;
  manager: EditorManager;
  onBindingChange?: (
    value: DSField,
    onBulkChange: (value: any) => void
  ) => void;
}

export interface DataBindingState {
  loading: boolean;
  hint: string | void;
  schema?: SchemaCollection;
}

// 所有的内容组件都必须继承这个，用来做内容选择面板
export interface DataBindingPanelProps extends RendererProps {
  onSelect: (value: any) => void;
  isSelected?: (value: any) => boolean;
}

export class DataBindingControl extends React.Component<
  DataBindingProps,
  DataBindingState
> {
  constructor(props: DataBindingProps) {
    super(props);
    this.state = {
      loading: false,
      hint: undefined
    };
  }

  @autobind
  handleConfirm(result: DSField) {
    const {manager, data, onChange, onBulkChange, onBindingChange} = this.props;

    if (result?.value) {
      onChange(result.value);
      onBulkChange && onBindingChange?.(result, onBulkChange);
      manager.config?.dataBindingChange?.(result.value, data, manager);
    }
  }

  @autobind
  async handlePickerOpen() {
    const {manager, node} = this.props;

    this.setState({
      loading: true,
      schema: undefined
    });

    let schema;
    try {
      schema = await manager.getAvailableContextFields(node);
    } catch (e) {
      this.setState({
        loading: false,
        hint: '加载可用字段失败，请联系管理员！'
      });
      return;
    }

    this.setState({
      loading: false,
      hint: schema ? undefined : '暂无可绑定字段',
      schema: schema ?? undefined
    });
  }

  render() {
    const {
      className,
      classnames: cx,
      value: result,
      onChange,
      multiple,
      disabled,
      render
    } = this.props;

    const {schema, loading, hint} = this.state;
    return (
      <PickerContainer
        onPickerOpen={this.handlePickerOpen}
        className={className}
        title="绑定字段"
        bodyRender={({value, isOpened, onChange}) => {
          if (!isOpened) {
            return null;
          }

          if (loading) {
            return (
              <Spinner
                show
                icon="reload"
                spinnerClassName="ae-DataBindingList-spinner"
              />
            );
          }

          if (hint) {
            return <p className="ae-DataBindingList-hint">{hint}</p>;
          }

          return render('content', schema!, {
            onSelect: onChange,
            value: value ? value.value : result
          });
        }}
        value={result}
        onConfirm={this.handleConfirm}
      >
        {({onClick}: {onClick: (e: React.MouseEvent) => void}) => {
          return (
            <InputBox
              className="ae-InputVariable"
              clearable={false}
              value={result}
              onChange={onChange}
              disabled={disabled}
            >
              <span
                onClick={async e => {
                  onClick(e);
                }}
              >
                <Icon icon="info" className="icon cursor-pointer" />
              </span>
            </InputBox>
          );
        }}
      </PickerContainer>
    );
  }
}

@FormItem({
  type: 'ae-DataBindingControl'
})
export class DataBindingControlRenderer extends DataBindingControl {}

export interface SimpleDataBindingProps extends DataBindingPanelProps {
  fields: DSFieldGroup[];
}

export interface SimpleDataBindingState {
  filteredFields: DSFieldGroup[];
}

export class SimpleDataBindingControl extends React.Component<
  SimpleDataBindingProps,
  SimpleDataBindingState
> {
  constructor(props: SimpleDataBindingProps) {
    super(props);
    this.handleSearchDebounced = debounce(this.handleSearch, 250, {
      trailing: true,
      leading: false
    });
    this.state = {
      filteredFields: props.fields
    };
  }

  handleSearchDebounced;

  @autobind
  async handleSearch(keywords: string) {
    this.setState({
      filteredFields: matchSorter(this.props.fields, keywords, {
        keys: ['label', 'value', 'children']
      })
    });
  }

  @autobind
  handleSelect() {}

  render() {
    const {className, value, onSelect, isSelected} = this.props;

    const {filteredFields} = this.state;
    return (
      <div className={cx('ae-DataBindingList', className)}>
        <div className={cx('ae-DataBindingList-searchBox')}>
          <SearchBox
            mini={false}
            placeholder={'输入名称搜索'}
            onSearch={this.handleSearchDebounced}
          />
        </div>

        <div className={cx('ae-DataBindingList-body')}>
          <CollapseGroup
            className={cx('ae-DataBindingList-collapseGroup')}
            defaultActiveKey={filteredFields.map(
              item => item.value || item.label
            )}
            expandIcon={
              generateIcon(cx, 'fa fa-chevron-right expandIcon', 'Icon')!
            }
            expandIconPosition="right"
            // accordion={true}
          >
            {filteredFields.map((item, index) => (
              <Collapse
                className={cx('ae-DataBindingList-collapse')}
                headingClassName={cx('ae-DataBindingList-collapse-title')}
                bodyClassName={cx('ae-DataBindingList-collapse-body')}
                propKey={item.value || item.label}
                key={item.value || item.label}
                header={<span>{item.label}</span>}
              >
                {Array.isArray(item.children) && item.children.length > 0 ? (
                  item.children.map((childItem: DSField) => {
                    const checked = isSelected
                      ? isSelected(childItem)
                      : childItem.value === value;
                    return (
                      <div
                        className={cx('ae-DataBindingList-item', {
                          'is-active': checked
                        })}
                        onClick={() => onSelect(childItem)}
                        key={childItem.value}
                      >
                        {childItem.label}
                      </div>
                    );
                  })
                ) : (
                  <p className={cx('ae-DataBindingList-hint')}>暂无可用字段</p>
                )}
              </Collapse>
            ))}
          </CollapseGroup>
        </div>
      </div>
    );
  }
}

@Renderer({
  type: 'ae-SimpleDataBindingPanel'
})
export class SimpleDataBindingControlRenderer extends SimpleDataBindingControl {}
