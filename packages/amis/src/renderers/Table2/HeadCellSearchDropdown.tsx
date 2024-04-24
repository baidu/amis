import React from 'react';
import {findDOMNode} from 'react-dom';
import {observer} from 'mobx-react';
import {
  RendererProps,
  ActionObject,
  setVariable,
  createObject,
  ClassNamesFn,
  ITableStore2
} from 'amis-core';
import {Icon, HeadCellDropDown} from 'amis-ui';
import type {FilterDropdownProps} from 'amis-ui/lib/components/table/HeadCellDropDown';

export interface QuickSearchConfig {
  type?: string;
  controls?: any;
  tabs?: any;
  fieldSet?: any;
  [propName: string]: any;
}

export interface HeadCellSearchProps extends RendererProps {
  name: string;
  searchable: boolean | QuickSearchConfig;
  onSearch?: Function; // (values: object) => void;
  onAction?: Function;
  sortable?: boolean;
  label?: string;
  popOverContainer?: any;
  classnames: ClassNamesFn;
  classPrefix: string;
  store: ITableStore2;
}

export class HeadCellSearchDropDown extends React.Component<
  HeadCellSearchProps,
  any
> {
  formItems: Array<string> = [];
  constructor(props: HeadCellSearchProps) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAction = this.handleAction.bind(this);
  }

  buildSchema() {
    const {
      searchable,
      sortable,
      name,
      label,
      translate: __,
      testIdBuilder
    } = this.props;

    let schema: any;

    if (searchable === true) {
      schema = {
        title: '',
        controls: [
          {
            type: 'text',
            name,
            placeholder: label,
            clearable: true,
            testid: testIdBuilder?.getChild(name)?.getTestIdValue()
          }
        ]
      };
    } else if (searchable) {
      if (searchable.controls || searchable.tabs || searchable.fieldSet) {
        schema = {
          title: '',
          ...searchable,
          controls: Array.isArray(searchable.controls)
            ? searchable.controls.concat()
            : undefined
        };
      } else if (searchable?.type === 'form') {
        schema = searchable;
      } else {
        schema = {
          title: '',
          className: searchable.formClassName,
          controls: [
            {
              type: searchable.type || 'text',
              name: searchable.name || name,
              testid: testIdBuilder
                ?.getChild(searchable.name || name)
                ?.getTestIdValue(),
              placeholder: label,
              ...searchable
            }
          ]
        };
      }
    }

    if (schema && schema.controls && sortable) {
      schema.controls.unshift(
        {
          type: 'hidden',
          name: 'orderBy',
          value: name
        },
        {
          type: 'button-group',
          name: 'order',
          label: __('sort'),
          options: [
            {
              label: __('asc'),
              value: 'asc'
            },
            {
              label: __('desc'),
              value: 'desc'
            }
          ]
        }
      );
    }

    if (schema) {
      // 如果schema是直接配置的{type: 'form', body: []}
      const formItems: Array<string> = [];
      (schema.controls || schema.body || []).forEach(
        (item: any) =>
          item.name &&
          item.name !== 'orderBy' &&
          item.name !== 'order' &&
          formItems.push(item.name)
      );

      this.formItems = formItems;
      schema = {
        ...schema,
        type: 'form',
        wrapperComponent: 'div',
        wrapWithPanel: true,
        title: false,
        testid: testIdBuilder?.getChild('form')?.getTestIdValue(),
        actions: [
          {
            type: 'button',
            label: __('reset'),
            actionType: 'clear-and-submit',
            testid: testIdBuilder?.getChild('btn-reset')?.getTestIdValue()
          },

          {
            type: 'button',
            label: __('cancel'),
            actionType: 'cancel',
            testid: testIdBuilder?.getChild('btn-cancel')?.getTestIdValue()
          },

          {
            label: __('search'),
            type: 'submit',
            primary: true,
            testid: testIdBuilder?.getChild('btn-search')?.getTestIdValue()
          }
        ]
      };
    }

    return schema || 'error';
  }

  async handleAction(
    e: any,
    action: ActionObject,
    ctx: object,
    confirm: Function
  ) {
    const {onAction, data, dispatchEvent, name} = this.props;

    if (action.actionType === 'cancel' || action.actionType === 'close') {
      confirm();
      return;
    }

    if (action.actionType === 'reset') {
      confirm();
      this.handleReset();
      return;
    }

    const values = {...data};
    this.formItems.forEach(key => setVariable(values, key, undefined));

    const rendererEvent = await dispatchEvent(
      'columnSearch',
      createObject(data, {
        searchName: name,
        searchValue: values
      })
    );

    if (rendererEvent?.prevented) {
      return;
    }

    onAction && onAction(e, action, ctx);
  }

  async handleReset() {
    const {onSearch, data, name} = this.props;
    const values = {...data};

    this.formItems.forEach(key => setVariable(values, key, undefined));

    if (values.orderBy === name) {
      values.orderBy = '';
      values.order = 'asc';
    }

    onSearch && (await onSearch(name, values));

    onSearch && onSearch(values);
  }

  async handleSubmit(values: any, confirm: Function) {
    const {onSearch, name} = this.props;

    if (values.order) {
      values = {
        ...values,
        orderBy: name
      };
    }

    onSearch && (await onSearch(name, values));

    confirm();
  }

  isActive() {
    const {data, name, orderBy} = this.props;
    return (
      (orderBy && orderBy === name) || this.formItems.some(key => data?.[key])
    );
  }

  render() {
    const {
      render,
      name,
      data,
      searchable,
      order,
      orderBy,
      popOverContainer,
      classPrefix: ns,
      classnames: cx,
      testIdBuilder
    } = this.props;

    const formSchema = this.buildSchema();
    const isActive = this.isActive();

    return (
      <HeadCellDropDown
        className={`${ns}TableCell-searchBtn`}
        layerClassName={cx(
          `${ns}TableCell-searchPopOver`,
          (searchable as any).className
        )}
        active={isActive}
        filterIcon={
          <Icon
            icon="search"
            className="icon"
            iconContent="table-search-icon"
            testIdBuilder={testIdBuilder?.getChild('search-icon')}
          />
        }
        popOverContainer={
          popOverContainer ? popOverContainer : () => findDOMNode(this)
        }
        filterDropdown={({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters
        }: FilterDropdownProps) => {
          return render('quick-search-form', formSchema, {
            data: {
              ...data,
              orderBy,
              order: orderBy && orderBy === name ? order : ''
            },
            onSubmit: (values: object) => this.handleSubmit(values, confirm),
            onAction: (e: any, action: ActionObject, ctx: object) => {
              this.handleAction(e, action, ctx, confirm);
            }
          }) as JSX.Element;
        }}
        testIdBuilder={testIdBuilder}
      ></HeadCellDropDown>
    );
  }
}

export default observer((props: HeadCellSearchProps) => {
  const store = props.store;

  return (
    <HeadCellSearchDropDown
      {...props}
      data={store.query}
      orderBy={store.orderBy}
      order={store.order}
    />
  );
});
