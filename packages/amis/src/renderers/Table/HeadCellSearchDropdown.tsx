import React from 'react';
import {RendererProps} from '../../factory';
import {Action} from '../../types';
import {Icon} from '../../components/icons';
import Overlay from '../../components/Overlay';
import {findDOMNode} from 'react-dom';
import PopOver from '../../components/PopOver';
import {ITableStore} from '../../store/table';
import {setVariable} from '../../utils/helper';

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
  onQuery: (values: object) => void;
}

export class HeadCellSearchDropDown extends React.Component<
  HeadCellSearchProps,
  any
> {
  state = {
    isOpened: false
  };

  formItems: Array<string> = [];
  constructor(props: HeadCellSearchProps) {
    super(props);

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
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
          name: 'orderDir',
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
          item.name !== 'orderDir' &&
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

  handleClickOutside() {
    this.close();
  }

  open() {
    this.setState({
      isOpened: true
    });
  }

  close() {
    this.setState({
      isOpened: false
    });
  }

  handleAction(e: any, action: Action, ctx: object) {
    const {onAction} = this.props;

    if (action.actionType === 'cancel' || action.actionType === 'close') {
      this.close();
      return;
    }

    if (action.actionType === 'reset') {
      this.close();
      this.handleReset();
      return;
    }

    onAction && onAction(e, action, ctx);
  }

  handleReset() {
    const {onQuery, data, name} = this.props;
    const values = {...data};
    this.formItems.forEach(key => setVariable(values, key, undefined));

    if (values.orderBy === name) {
      values.orderBy = '';
      values.orderDir = 'asc';
    }
    onQuery(values);
  }

  handleSubmit(values: any) {
    const {onQuery, name} = this.props;

    this.close();

    if (values.orderDir) {
      values = {
        ...values,
        orderBy: name
      };
    }

    onQuery(values);
  }

  isActive() {
    const {data, name, orderBy} = this.props;

    return orderBy === name || this.formItems.some(key => data?.[key]);
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
      <span
        className={cx(`${ns}TableCell-searchBtn`, isActive ? 'is-active' : '')}
      >
        <span onClick={this.open}>
          <Icon icon="search" className="icon" />
        </span>
        {this.state.isOpened ? (
          <Overlay
            container={popOverContainer || (() => findDOMNode(this))}
            placement="left-bottom-left-top right-bottom-right-top"
            target={
              popOverContainer ? () => findDOMNode(this)!.parentNode : null
            }
            show
          >
            <PopOver
              classPrefix={ns}
              onHide={this.close}
              className={cx(
                `${ns}TableCell-searchPopOver`,
                (searchable as any).className
              )}
              overlay
            >
              {
                render('quick-search-form', formSchema, {
                  data: {
                    ...data,
                    orderBy: orderBy,
                    orderDir:
                      orderBy === name ? (store as ITableStore).orderDir : ''
                  },
                  onSubmit: this.handleSubmit,
                  onAction: this.handleAction
                }) as JSX.Element
              }
            </PopOver>
          </Overlay>
        ) : null}
      </span>
    );
  }
}
