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
import {FormControlProps, generateIcon} from 'amis-core';
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

export interface DataBindingProps extends FormControlProps {
  node: EditorNodeType;
  manager: EditorManager;
  samePredicate?: (a: any, b: any) => boolean;
  onBindingChange?: (
    value: DSField,
    onBulkChange: (value: any) => void
  ) => void;
}

export interface DataBindingState {
  filteredFields: DSFieldGroup[];
  sourceFields: DSFieldGroup[];
  loading: boolean;
  hint: string | void;
}

export class DataBindingControl extends React.Component<
  DataBindingProps,
  DataBindingState
> {
  constructor(props: DataBindingProps) {
    super(props);
    this.handleSearchDebounced = debounce(this.handleSearch, 250, {
      trailing: true,
      leading: false
    });
    this.state = {
      filteredFields: [],
      sourceFields: [],
      loading: false,
      hint: undefined
    };
  }

  handleSearchDebounced;

  @autobind
  handleConfirm(result: {label: string; value: string}) {
    const {manager, data, onChange, onBulkChange, onBindingChange} = this.props;

    if (result?.value) {
      onChange(result.value);
      onBulkChange && onBindingChange?.(result, onBulkChange);
      manager.config?.dataBindingChange?.(result.value, data, manager);
    }
  }

  @autobind
  handlePickerOpen() {
    const {manager, node} = this.props;

    // 如果node没变化，就不再重复加载
    if (this.state.sourceFields.length) {
      return;
    }

    this.setState({
      sourceFields: [],
      filteredFields: [],
      loading: true
    });

    manager
      .getAvailableContextFields(node)
      .then(groupedFields => {
        this.setState({
          sourceFields: groupedFields || [],
          filteredFields: groupedFields || [],
          loading: false,
          hint: groupedFields ? undefined : '暂无可绑定字段'
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
          hint: '加载可用字段失败，请联系管理员！'
        });
      });
  }

  @autobind
  async handleSearch(keywords: string) {
    this.setState({
      filteredFields: matchSorter(this.state.sourceFields, keywords, {
        keys: ['label', 'value', 'children']
      })
    });
  }

  @autobind
  handleSelect() {}

  render() {
    const {
      className,
      classnames: cx,
      value,
      onChange,
      samePredicate = (a, b) => a.value === b.value,
      multiple,
      disabled
    } = this.props;

    const {filteredFields, loading, hint} = this.state;
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
                spinnerClassName={cx('ae-DataBindingList-spinner')}
              />
            );
          }

          if (hint) {
            return <p className={cx('ae-DataBindingList-hint')}>{hint}</p>;
          }

          return (
            <div className={cx('ae-DataBindingList')}>
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
                  defaultActiveKey={filteredFields.map(item => item.value!)}
                  expandIcon={
                    generateIcon(
                      cx,
                      'fa fa-chevron-right ae-DataBindingList-expandIcon',
                      'Icon'
                    )!
                  }
                  expandIconPosition="right"
                  // accordion={true}
                >
                  {filteredFields.map(item => (
                    <Collapse
                      className={cx('ae-DataBindingList-collapse')}
                      headingClassName={cx('ae-DataBindingList-collapse-title')}
                      bodyClassName={cx('ae-DataBindingList-collapse-body')}
                      propKey={item.value}
                      key={item.value}
                      header={item.label}
                    >
                      {Array.isArray(item.children) &&
                      item.children.length > 0 ? (
                        item.children.map((childItem: DSField) => {
                          if (multiple) {
                            const checked = !!value.find((i: any) =>
                              samePredicate(i, childItem)
                            );
                            return (
                              <div
                                key={childItem.value}
                                className={cx('ae-DataBindingList-item')}
                                onClick={() =>
                                  onChange(
                                    checked
                                      ? value.concat(childItem)
                                      : remove(value, childItem)
                                  )
                                }
                              >
                                <Checkbox value={checked}>
                                  {childItem.label}
                                </Checkbox>
                              </div>
                            );
                          }

                          return (
                            <div
                              className={cx('ae-DataBindingList-item', {
                                'is-active':
                                  value && childItem.value === value.value
                              })}
                              onClick={() => onChange(childItem)}
                              key={childItem.value}
                            >
                              {childItem.label}
                            </div>
                          );
                        })
                      ) : (
                        <p className={cx('ae-DataBindingList-hint')}>
                          暂无可用字段
                        </p>
                      )}
                    </Collapse>
                  ))}
                </CollapseGroup>
              </div>
            </div>
          );
        }}
        value={value}
        onConfirm={this.handleConfirm}
      >
        {({onClick}: {onClick: (e: React.MouseEvent) => void}) => {
          return (
            <InputBox
              className="ae-InputVariable"
              clearable={false}
              value={value}
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
