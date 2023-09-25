import {
  IColumn,
  ITableStore,
  RendererProps,
  createObject,
  padArr
} from 'amis-core';
import {Icon} from 'amis-ui';
import {observer} from 'mobx-react';
import React from 'react';

export interface AutoFilterFormProps extends RendererProps {
  searchFormExpanded: boolean;
  autoGenerateFilter: any;
  activedSearchableColumns: Array<IColumn>;
  searchableColumns: Array<IColumn>;
  columnsNum: number;
  onItemToggleExpanded?: (column: IColumn, value: any) => void;
  onToggleExpanded?: () => void;
  query?: any;

  popOverContainer?: any;
  onSearchableFromReset?: any;
  onSearchableFromSubmit?: any;
  onSearchableFromInit?: any;
}

export function AutoFilterForm({
  autoGenerateFilter,
  searchFormExpanded,
  activedSearchableColumns,
  searchableColumns,
  onItemToggleExpanded,
  onToggleExpanded,
  classnames: cx,
  translate: __,
  render,
  data,
  onSearchableFromReset,
  onSearchableFromSubmit,
  onSearchableFromInit,
  popOverContainer
}: AutoFilterFormProps) {
  const schema = React.useMemo(() => {
    const {columnsNum, showBtnToolbar} =
      typeof autoGenerateFilter === 'boolean'
        ? {
            columnsNum: 3,
            showBtnToolbar: true
          }
        : autoGenerateFilter;

    const body: Array<any> = padArr(activedSearchableColumns, columnsNum).map(
      group => ({
        type: 'group',
        body: group.map((column: any) => ({
          ...(column.searchable === true
            ? {
                type: 'input-text',
                name: column.name,
                label: column.label
              }
            : {
                type: 'input-text',
                name: column.name,
                ...column.searchable
              }),
          name: column.searchable?.name ?? column.name,
          label: column.searchable?.label ?? column.label
        }))
      })
    );

    let showExpander = searchableColumns.length >= columnsNum;

    // todo 以后做动画
    if (!searchFormExpanded && body.length) {
      body.splice(1, body.length - 1);
      body[0].body.splice(columnsNum - 1, body[0].body.length - columnsNum + 1);
    }

    let lastGroup = body[body.length - 1];
    if (
      !Array.isArray(lastGroup?.body) ||
      lastGroup.body.length >= columnsNum
    ) {
      lastGroup = {
        type: 'group',
        body: []
      };
      body.push(lastGroup);
    }

    let count = Math.max(columnsNum - lastGroup.body.length - 1);
    while (count-- > 0) {
      lastGroup.body.push({
        type: 'tpl',
        tpl: ''
      });
    }
    lastGroup.body.push({
      type: 'container',
      className: 'ButtonToolbar text-right block',
      wrapperBody: false,
      body: [
        {
          type: 'dropdown-button',
          label: __('Table.searchFields'),
          className: cx('Table-searchableForm-dropdown', 'mr-2'),
          level: 'link',
          trigger: 'click',
          size: 'sm',
          align: 'right',
          visible: showBtnToolbar,
          buttons: searchableColumns.map(column => {
            return {
              type: 'checkbox',
              label: false,
              className: cx('Table-searchableForm-checkbox'),
              inputClassName: cx('Table-searchableForm-checkbox-inner'),
              name: `${
                column.searchable.strategy === 'jsonql' ? '' : '__search_'
              }${column.searchable?.name ?? column.name}`,
              option: column.searchable?.label ?? column.label,
              value: column.enableSearch,
              badge: {
                offset: [-10, 5],
                visibleOn: `${
                  column.toggable && !column.toggled && column.enableSearch
                }`
              },
              onChange: (value: boolean) =>
                onItemToggleExpanded?.(column, value)
            };
          })
        },

        {
          type: 'submit',
          label: __('search'),
          level: 'primary',
          className: 'w-18'
        },
        {
          type: 'reset',
          label: __('reset'),
          className: 'w-18'
        },

        showExpander
          ? {
              children: () => (
                <a
                  className={cx(
                    'Table-SFToggler',
                    searchFormExpanded ? 'is-expanded' : ''
                  )}
                  onClick={onToggleExpanded}
                >
                  {__(searchFormExpanded ? 'collapse' : 'expand')}
                  <span className={cx('Table-SFToggler-arrow')}>
                    <Icon icon="right-arrow-bold" className="icon" />
                  </span>
                </a>
              )
            }
          : null
      ].filter(item => item)
    });

    return {
      type: 'form',
      api: null,
      title: '',
      mode: 'horizontal',
      submitText: __('search'),
      body: body,
      actions: [],
      canAccessSuperData: false
    };
  }, [
    autoGenerateFilter,
    activedSearchableColumns,
    searchableColumns,
    searchFormExpanded
  ]);

  return render('searchable-form', schema, {
    key: 'searchable-form',
    panelClassName: cx('Table-searchableForm'),
    actionsClassName: cx('Table-searchableForm-footer'),
    onReset: onSearchableFromReset,
    onSubmit: onSearchableFromSubmit,
    onInit: onSearchableFromInit,
    formStore: undefined,
    data,
    popOverContainer
  });
}

export default observer(
  ({
    store,
    query,
    data,
    ...rest
  }: Omit<
    AutoFilterFormProps,
    | 'activedSearchableColumns'
    | 'searchableColumns'
    | 'searchFormExpanded'
    | 'onItemToggleExpanded'
    | 'onToggleExpanded'
  > & {
    store: ITableStore;
    query: any;
  }) => {
    const onItemToggleExpanded = React.useCallback(
      (column: IColumn, value: any) => {
        column.setEnableSearch(value);
        store.setSearchFormExpanded(true);
      },
      []
    );

    const onToggleExpanded = React.useCallback(() => {
      store.toggleSearchFormExpanded();
    }, []);

    const ctx = React.useMemo(
      () => (query ? createObject(data, query) : data),
      [query, data]
    );

    return (
      <AutoFilterForm
        {...(rest as any)}
        activedSearchableColumns={store.activedSearchableColumns}
        searchableColumns={store.searchableColumns}
        searchFormExpanded={store.searchFormExpanded}
        onItemToggleExpanded={onItemToggleExpanded}
        onToggleExpanded={onToggleExpanded}
        data={ctx}
      />
    );
  }
);
