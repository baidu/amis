import React from 'react';
import {findDOMNode} from 'react-dom';

import {RendererProps} from '../../factory';
import {Action} from '../../types';
import {Icon} from '../../components/icons';
import {setVariable} from '../../utils/helper';
import {ITableStore} from '../../store/table-v2';
import HeadCellDropDown from '../../components/table/HeadCellDropDown';

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
  classPrefix: string;
  onFilter?: (values: object) => void;
  onAction?: Function;
  store: ITableStore;
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
    const {searchable, sortable, name, label, translate: __} = this.props;

    let schema: any;

    if (searchable === true) {
      schema = {
        title: '',
        controls: [
          {
            type: 'text',
            name,
            placeholder: label,
            clearable: true
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
      } else {
        schema = {
          title: '',
          className: searchable.formClassName,
          controls: [
            {
              type: searchable.type || 'text',
              name: searchable.name || name,
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
      const formItems: Array<string> = [];
      schema.controls?.forEach(
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
        actions: [
          {
            type: 'button',
            label: __('reset'),
            actionType: 'clear-and-submit'
          },

          {
            type: 'button',
            label: __('cancel'),
            actionType: 'cancel'
          },

          {
            label: __('search'),
            type: 'submit',
            primary: true
          }
        ]
      };
    }

    return schema || 'error';
  }

  handleAction(e: any, action: Action, ctx: object, confirm: Function) {
    const {onAction} = this.props;

    if (action.actionType === 'cancel' || action.actionType === 'close') {
      confirm();
      return;
    }

    if (action.actionType === 'reset') {
      confirm();
      this.handleReset();
      return;
    }

    onAction && onAction(e, action, ctx);
  }

  handleReset() {
    const {onFilter, data, name, store} = this.props;
    const values = {...data};
    this.formItems.forEach(key => setVariable(values, key, undefined));

    if (values.orderBy === name) {
      values.orderBy = '';
      values.order = 'asc';
    }

    store.updateQuery(values);

    onFilter && onFilter(values);
  }

  handleSubmit(values: any, confirm: Function) {
    const {onFilter, name, store} = this.props;

    if (values.order) {
      values = {
        ...values,
        orderBy: name
      };
    }

    store.updateQuery(values);

    onFilter && onFilter(values);

    confirm();
  }

  isActive() {
    const {data, name, orderBy} = this.props;

    return (orderBy && orderBy === name) || this.formItems.some(key => data?.[key]);
  }

  render() {
    const {
      render,
      name,
      data,
      searchable,
      store,
      orderBy,
      popOverContainer,
      classPrefix: ns,
      classnames: cx
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
        filterIcon={<Icon icon="search" className="icon" />}
        popOverContainer={popOverContainer ? popOverContainer : () => findDOMNode(this)}
        filterDropdown={({setSelectedKeys, selectedKeys, confirm, clearFilters}) => {
          return render('quick-search-form', formSchema, {
            data: {
              ...data,
              orderBy,
              order: orderBy && orderBy === name ? (store as ITableStore).order : ''
            },
            onSubmit: (values: object) => this.handleSubmit(values, confirm),
            onAction: (e: any, action: Action, ctx: object) => {
              this.handleAction(e, action, ctx, confirm);
            }
          }) as JSX.Element;
        }}>
      </HeadCellDropDown>
    );
  }
}
