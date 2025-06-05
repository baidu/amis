import React from 'react';
import omit from 'lodash/omit';
import debounce from 'lodash/debounce';
import cx from 'classnames';
import {matchSorter} from 'match-sorter';
import {SpinnerExtraProps, Tree as TreeSelector} from 'amis-ui';
import {value2array} from 'amis-ui/lib/components/Select';
import {
  Option,
  OptionsControl,
  OptionsControlProps,
  autobind,
  createObject,
  ActionObject,
  isPureVariable,
  resolveVariableAndFilter,
  resolveEventData,
  findTreeIndex,
  hasAbility,
  findTree,
  isEffectiveApi,
  BaseApiObject,
  getVariable,
  setThemeClassName,
  CustomStyle
} from 'amis-core';
import {Spinner, SearchBox} from 'amis-ui';
import {FormOptionsSchema, SchemaApi, SchemaCollection} from '../../Schema';
import {supportStatic} from './StaticHoc';
import type {ItemRenderStates} from 'amis-ui/lib/components/Selection';

type NodeBehaviorType = 'unfold' | 'check';

/**
 * Tree 下拉选择框。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/tree
 */
export interface TreeControlSchema extends FormOptionsSchema {
  type: 'input-tree';

  /**
   * 是否隐藏顶级
   */
  hideRoot?: boolean;

  /**
   * 顶级选项的名称
   */
  rootLabel?: string;

  /**
   * 顶级选项的值
   */
  rootValue?: any;

  /**
   * 显示图标
   */
  showIcon?: boolean;

  /**
   * ui级联关系，true代表级联选中，false代表不级联，默认为true
   */
  autoCheckChildren?: boolean;

  /**
   * 该属性代表数据级联关系，autoCheckChildren为true时生效，默认为false，具体数据级联关系如下：
   * 1.casacde为false，ui行为为级联选中子节点，子节点禁用；值只包含父节点的值
   * 2.cascade为false，withChildren为true，ui行为为级联选中子节点，子节点禁用；值包含父子节点的值
   * 3.cascade为true，ui行为级联选中子节点，子节点可反选，值包含父子节点的值，此时withChildren属性失效
   * 4.cascade不论为true还是false，onlyChildren为true，ui行为级联选中子节点，子节点可反选，值只包含子节点的值
   */
  cascade?: boolean;

  /**
   * 节点行为配置，默认为选中
   */
  nodeBehavior?: NodeBehaviorType[];

  /**
   * 子节点取消时自动取消父节点的值，默认为false
   */
  autoCancelParent?: boolean;

  /**
   * 选父级的时候是否把子节点的值也包含在内。
   */
  withChildren?: boolean;

  /**
   * 选父级的时候，是否只把子节点的值包含在内
   */
  onlyChildren?: boolean;

  /**
   * 单选时，只运行选择叶子节点
   */
  onlyLeaf?: boolean;

  /**
   * 顶级节点是否可以创建子节点
   */
  rootCreatable?: boolean;

  /**
   * 是否开启节点路径模式
   */
  enableNodePath?: boolean;

  /**
   * 开启节点路径模式后，节点路径的分隔符
   */
  pathSeparator?: string;

  /**
   * 是否显示展开线
   */
  showOutline?: boolean;

  /**
   * 懒加载接口
   */
  deferApi?: SchemaApi;

  /**
   * 需要高亮的字符串
   */
  highlightTxt?: string;

  /**
   * 是否为选项添加默认的Icon，默认值为true
   */
  enableDefaultIcon?: boolean;

  /**
   * 是否开启搜索
   */
  searchable?: boolean;

  /**
   * 搜索 API
   */
  searchApi?: SchemaApi;

  /**
   * 自定义节点操作栏区域
   */
  itemActions?: SchemaCollection;

  /**
   * 搜索框的配置
   */
  searchConfig?: {
    /**
     * 搜索框外层CSS样式类
     */
    className?: string;
    /**
     * 占位符
     */
    placeholder?: string;

    /**
     * 是否为 Mini 样式。
     */
    mini?: boolean;

    /**
     * 是否为加强样式
     */
    enhance?: boolean;

    /**
     * 是否可清除
     */
    clearable?: boolean;

    /**
     * 是否立马搜索。
     */
    searchImediately?: boolean;

    /**
     * 搜索框是否吸顶
     */
    sticky?: boolean;
  };

  /**
   * tree 组件层类名
   */
  treeClassName?: string;

  /**
   * 高度自动增长？
   */
  heightAuto?: boolean;
}

export interface TreeProps
  extends OptionsControlProps,
    Omit<
      TreeControlSchema,
      | 'type'
      | 'options'
      | 'className'
      | 'inputClassName'
      | 'descriptionClassName'
      | 'deferApi'
    >,
    SpinnerExtraProps {
  enableNodePath?: boolean;
  pathSeparator?: string;
  mobileUI?: boolean;
}

interface TreeState {
  filteredOptions: Option[];
  keyword: string;
  allowSearch: boolean;
}

export default class TreeControl extends React.Component<TreeProps, TreeState> {
  static defaultProps: Partial<TreeProps> = {
    placeholder: 'placeholder.noData',
    multiple: false,
    rootLabel: 'Tree.root',
    rootValue: '',
    showIcon: true,
    enableNodePath: false,
    pathSeparator: '/'
  };
  treeRef: any;

  constructor(props: TreeProps) {
    super(props);
    this.state = {
      keyword: '',
      filteredOptions: this.props.options ?? [],
      allowSearch: false
    };
    this.handleSearch = debounce(this.handleSearch.bind(this), 250, {
      trailing: true,
      leading: false
    });
  }

  componentDidUpdate(prevProps: TreeProps) {
    const props = this.props;
    const keyword = this.state.keyword;

    if (
      prevProps.options !== props.options ||
      prevProps.searchable !== props.searchable
    ) {
      const {options, searchable} = props;

      this.setState({
        filteredOptions:
          searchable && keyword ? this.filterOptions(options, keyword) : options
      });
    }
  }

  reload(subpath?: string, query?: any) {
    const reload = this.props.reloadOptions;
    reload && reload(subpath, query);
  }

  doAction(action: ActionObject, data: any, throwErrors: boolean) {
    const actionType = action?.actionType as string;
    const {resetValue, onChange, formStore, store, name} = this.props;

    if (actionType === 'clear') {
      onChange?.('');
    } else if (actionType === 'reset') {
      const pristineVal =
        getVariable(formStore?.pristine ?? store?.pristine, name) ?? resetValue;
      onChange?.(pristineVal ?? '');
    } else if (action.actionType === 'expand') {
      this.treeRef.syncUnFolded(this.props, action.args?.openLevel);
    } else if (action.actionType === 'collapse') {
      this.treeRef.syncUnFolded(this.props, action.args?.closeLevel || 0);
    } else if (action.actionType === 'add') {
      this.addItemFromAction(action.args?.item, action.args?.parentValue);
    } else if (action.actionType === 'edit') {
      this.editItemFromAction(action.args?.item, action.args?.originValue);
    } else if (action.actionType === 'delete') {
      this.deleteItemFromAction(action.args?.value);
    } else if (action.actionType === 'reload') {
      this.reload();
    } else if (actionType === 'search') {
      this.setState({
        allowSearch: !!action.args?.keyword
      });
      this.handleSearch(action.args?.keyword);
    }
  }

  /**
   * @deprecated 不推荐使用，没考虑 jointValues false，没考虑多选
   * @param options
   * @param value
   * @returns
   */
  resolveOption(options: Array<Option>, value: any) {
    return findTree(options, item => {
      const valueAbility = this.props.valueField || 'value';
      const itemValue = hasAbility(item, valueAbility)
        ? item[valueAbility]
        : '';
      return itemValue === value;
    });
  }

  @autobind
  addItemFromAction(item: Option, parentValue?: any) {
    const {onAdd, options, valueField} = this.props;
    const idxes =
      findTreeIndex(options, item => {
        const valueAbility = valueField || 'value';
        const value = hasAbility(item, valueAbility) ? item[valueAbility] : '';
        return value === parentValue;
      }) || [];
    onAdd && onAdd(idxes.concat(0), item, true);
  }

  @autobind
  editItemFromAction(item: Option, originValue: any) {
    const {onEdit, options} = this.props;
    const editItem = this.resolveOption(options, originValue);
    onEdit && editItem && onEdit({...item, originValue}, editItem, true);
  }

  @autobind
  deleteItemFromAction(value: any) {
    const {onDelete, options} = this.props;
    const deleteItem = this.resolveOption(options, value);
    onDelete && deleteItem && onDelete(deleteItem);
  }

  filterOptions(options: Array<Option>, keywords: string): Array<Option> {
    const {labelField, valueField} = this.props;

    return options.map(option => {
      option = {
        ...option
      };
      option.visible = !!matchSorter([option], keywords, {
        keys: [labelField || 'label', valueField || 'value'],
        threshold: matchSorter.rankings.CONTAINS
      }).length;

      if (!option.visible && option.children) {
        option.children = this.filterOptions(option.children, keywords);
        const visibleCount = option.children.filter(
          item => item.visible
        ).length;
        option.visible = !!visibleCount;
      }

      option.visible && (option.collapsed = false);
      return option;
    });
  }

  @autobind
  async handleChange(value: any) {
    const {
      onChange,
      searchable,
      options,
      dispatchEvent,
      multiple,
      delimiter,
      valueField,
      selectedOptions: originSelectedItems,
      joinValues,
      extractValue
    } = this.props;
    const {filteredOptions, allowSearch} = this.state;
    const items = searchable || allowSearch ? filteredOptions : options;

    const selectedItems = value2array(value, {
      multiple,
      delimiter,
      valueField,
      options: filteredOptions
    });
    const item = multiple ? null : selectedItems[0];

    // 如果是搜索模式，有可能已经选择的值被过滤掉了，如果值发生了变化
    // 不应该让原来选中的值丢失
    // https://github.com/baidu/amis/issues/9946
    if (multiple && (searchable || allowSearch) && originSelectedItems.length) {
      originSelectedItems.forEach(origin => {
        const exists = findTree(
          filteredOptions,
          item => item[valueField || 'value'] === origin[valueField || 'value']
        );
        if (!exists) {
          selectedItems.push(origin);
        }
      });
      value = selectedItems.map(item =>
        extractValue || joinValues ? item[valueField || 'value'] : item
      );
      if (joinValues) {
        value = value.join(delimiter || ',');
      }
    }

    const rendererEvent = await dispatchEvent(
      'change',
      resolveEventData(this.props, {
        value,
        item,
        items,
        selectedItems
      })
    );

    if (rendererEvent?.prevented) {
      return;
    }

    onChange && onChange(value);
  }

  @autobind
  async handleNodeClick(item: any) {
    const {dispatchEvent, data} = this.props;

    const rendererEvent = await dispatchEvent(
      'itemClick',
      createObject(data, {item})
    );

    if (rendererEvent?.prevented) {
      return;
    }
  }

  async handleSearch(keyword: string) {
    const {searchApi, options, env, data, translate: __} = this.props;

    let filterOptions: Array<Option> = [];

    if (isEffectiveApi(searchApi)) {
      try {
        const payload = await env.fetcher(
          searchApi,
          createObject(data, {term: keyword})
        );

        if (!payload.ok) {
          throw new Error(__(payload.msg || 'networkError'));
        }

        const result =
          payload.data.options || payload.data.items || payload.data;
        if (!Array.isArray(result)) {
          throw new Error(__('Tree.invalidArray'));
        }

        filterOptions = result;
      } catch (e) {
        if (!env.isCancel(e)) {
          !(searchApi as BaseApiObject).silent &&
            env.notify('error', e.message);
        }
      }
    } else if (keyword) {
      filterOptions = this.filterOptions(options, keyword);
    }

    this.setState({
      keyword,
      filteredOptions: keyword ? filterOptions : options
    });
  }

  @autobind
  domRef(ref: any) {
    this.treeRef = ref;
  }

  validate(): any {
    const {value, minLength, maxLength, delimiter} = this.props;

    let curValue = Array.isArray(value)
      ? value
      : (value ? String(value) : '').split(delimiter || ',');
    if (minLength && curValue.length < minLength) {
      return `已选择数量低于设定的最小个数${minLength}，请选择更多的选项。`;
    } else if (maxLength && curValue.length > maxLength) {
      return `已选择数量超出设定的最大个数${maxLength}，请取消选择超出的选项。`;
    }
  }

  @autobind
  renderOptionItem(option: Option, states: ItemRenderStates) {
    const {menuTpl, render, data} = this.props;

    return render(`option/${states.index}`, menuTpl, {
      data: createObject(createObject(data, {...states}), option)
    });
  }

  @autobind
  renderItemActions(option: Option, states: any) {
    const {itemActions, data, render} = this.props;

    return render(`action/${states.index}`, itemActions || '', {
      data: createObject(createObject(data, {...states}), option)
    });
  }

  @autobind
  renderSearch() {
    const {classPrefix: ns, searchConfig, mobileUI, testIdBuilder} = this.props;
    return (
      <SearchBox
        className={cx(`${ns}TreeControl-searchbox`, searchConfig?.className, {
          'is-sticky': searchConfig?.sticky
        })}
        mini={false}
        clearable={true}
        {...omit(searchConfig, 'className', 'sticky')}
        onSearch={this.handleSearch}
        mobileUI={mobileUI}
        testIdBuilder={testIdBuilder?.getChild('search')}
      />
    );
  }

  @supportStatic()
  render() {
    const {
      className,
      treeContainerClassName,
      classPrefix: ns,
      value,
      enableNodePath,
      pathSeparator = '/',
      disabled,
      joinValues,
      extractValue,
      delimiter,
      placeholder,
      options,
      multiple,
      valueField,
      initiallyOpen,
      unfoldedLevel,
      withChildren,
      onlyChildren,
      onlyLeaf,
      loading,
      hideRoot,
      rootLabel,
      autoCheckChildren,
      autoCancelParent,
      cascade,
      rootValue,
      showIcon,
      showRadio,
      showOutline,
      onAdd,
      creatable,
      createTip,
      addControls,
      onEdit,
      editable,
      editTip,
      editControls,
      removable,
      removeTip,
      onDelete,
      rootCreatable,
      rootCreateTip,
      labelField,
      iconField,
      deferField,
      nodePath,
      deferLoad,
      expandTreeOptions,
      translate: __,
      data,
      virtualThreshold,
      loadingConfig,
      menuTpl,
      enableDefaultIcon,
      searchable,
      searchConfig = {},
      heightAuto,
      mobileUI,
      testIdBuilder,
      nodeBehavior,
      itemActions,
      id,
      wrapperCustomStyle,
      themeCss,
      env,
      treeClassName
    } = this.props;
    let {highlightTxt} = this.props;
    const {filteredOptions, keyword, allowSearch} = this.state;

    if (isPureVariable(highlightTxt)) {
      highlightTxt = resolveVariableAndFilter(highlightTxt, data);
    }

    const TreeCmpt = (
      <TreeSelector
        className={treeClassName}
        classPrefix={ns}
        onRef={this.domRef}
        labelField={labelField}
        valueField={valueField}
        iconField={iconField}
        deferField={deferField}
        disabled={disabled}
        onChange={this.handleChange}
        onHandleNodeClick={this.handleNodeClick}
        joinValues={joinValues}
        extractValue={extractValue}
        delimiter={delimiter}
        placeholder={__(placeholder)}
        options={searchable || allowSearch ? filteredOptions : options}
        highlightTxt={searchable || allowSearch ? keyword : highlightTxt}
        multiple={multiple}
        initiallyOpen={initiallyOpen}
        unfoldedLevel={unfoldedLevel}
        withChildren={withChildren}
        onlyChildren={onlyChildren}
        onlyLeaf={onlyLeaf}
        hideRoot={hideRoot}
        rootLabel={__(rootLabel)}
        rootValue={rootValue}
        showIcon={showIcon}
        showRadio={showRadio}
        showOutline={showOutline}
        autoCheckChildren={autoCheckChildren}
        autoCancelParent={autoCancelParent}
        cascade={cascade}
        foldedField="collapsed"
        value={value || ''}
        nodePath={nodePath}
        enableNodePath={enableNodePath}
        pathSeparator={pathSeparator}
        selfDisabledAffectChildren={false}
        onAdd={onAdd}
        creatable={creatable}
        createTip={createTip}
        rootCreatable={rootCreatable}
        rootCreateTip={rootCreateTip}
        onEdit={onEdit}
        editable={editable}
        editTip={editTip}
        removable={removable}
        removeTip={removeTip}
        onDelete={onDelete}
        bultinCUD={!addControls && !editControls}
        onDeferLoad={deferLoad}
        onExpandTree={expandTreeOptions}
        virtualThreshold={virtualThreshold}
        itemRender={menuTpl ? this.renderOptionItem : undefined}
        enableDefaultIcon={enableDefaultIcon}
        mobileUI={mobileUI}
        nodeBehavior={nodeBehavior}
        itemActionsRender={itemActions ? this.renderItemActions : undefined}
        actionClassName={cx(
          setThemeClassName({
            ...this.props,
            name: 'actionControlClassName',
            id,
            themeCss
          })
        )}
        testIdBuilder={testIdBuilder?.getChild('tree')}
      />
    );

    return (
      <>
        <div
          className={cx(`${ns}TreeControl`, className, treeContainerClassName, {
            'is-sticky': searchable && searchConfig?.sticky,
            'h-auto': heightAuto
          })}
          {...testIdBuilder?.getChild('control').getTestId()}
        >
          {loading ? null : searchable ? (
            <>
              {this.renderSearch()}
              {TreeCmpt}
            </>
          ) : (
            TreeCmpt
          )}
          <Spinner
            size="sm"
            key="info"
            show={loading}
            loadingConfig={loadingConfig}
          />
        </div>
        <CustomStyle
          {...this.props}
          config={{
            wrapperCustomStyle,
            id,
            themeCss,
            classNames: [
              {
                key: 'actionControlClassName'
              }
            ]
          }}
          env={env}
        />
      </>
    );
  }
}

@OptionsControl({
  type: 'input-tree'
})
export class TreeControlRenderer extends TreeControl {}
