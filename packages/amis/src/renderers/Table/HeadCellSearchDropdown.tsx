import React from 'react';
import {RendererProps} from 'amis-core';
import {ActionObject} from 'amis-core';
import {Icon} from 'amis-ui';
import {Overlay} from 'amis-core';
import {PopOver} from 'amis-core';
import {setVariable, createObject} from 'amis-core';
import type {TestIdBuilder} from 'amis-core';

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
  testIdBuilder?: TestIdBuilder;
}

export function HeadCellSearchDropDown({
  searchable,
  name,
  label,
  onQuery,
  data,
  dispatchEvent,
  onAction,
  classnames: cx,
  translate: __,
  classPrefix: ns,
  popOverContainer,
  render,
  testIdBuilder
}: HeadCellSearchProps) {
  const ref = React.createRef<HTMLElement>();
  const [formSchema, formItems] = React.useMemo(() => {
    let schema: any;
    const formItems: Array<string> = [];

    if (searchable === true) {
      schema = {
        title: '',
        body: [
          {
            type: 'input-text',
            name,
            placeholder: label,
            clearable: true
          }
        ]
      };
    } else if (searchable) {
      if (
        !searchable.type &&
        (searchable.body || searchable.tabs || searchable.fieldSet)
      ) {
        // todo 删除此处代码，这些都是不推荐的用法
        schema = {
          title: '',
          ...searchable,
          body: Array.isArray(searchable.body)
            ? searchable.body.concat()
            : undefined
        };
      } else {
        schema = {
          title: '',
          className: searchable.formClassName,
          body: [
            {
              type: searchable.type || 'input-text',
              name: searchable.name || name,
              placeholder: label,
              ...searchable
            }
          ]
        };
      }
    }

    function findFormItems(schema: any) {
      Array.isArray(schema.body) &&
        schema.body.forEach((item: any) => {
          item.name && formItems.push(item.name);
          item.extraName &&
            typeof item.extraName === 'string' &&
            formItems.push(item.extraName);
          findFormItems(item);
        });
    }

    if (schema) {
      // schema有可能配置为{type: 'form', body[]} 所以真正的formItem需要到form的body里去找
      findFormItems(schema);
      schema = {
        ...schema,
        type: 'form',
        wrapperComponent: 'div',
        canAccessSuperData: false,
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

    return [schema || 'error', formItems];
  }, [searchable, name, label]);

  const [isOpened, setIsOpened] = React.useState(false);
  const open = React.useCallback(() => setIsOpened(true), []);
  const close = React.useCallback(() => setIsOpened(false), []);
  const handleSubmit = React.useCallback(async (values: any) => {
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

    close();
    onQuery(values);
  }, []);

  const handleAction = React.useCallback(
    (e: any, action: ActionObject, ctx: object) => {
      if (action.actionType === 'cancel' || action.actionType === 'close') {
        close();
        return;
      }

      if (action.actionType === 'reset') {
        close();
        handleReset();
        return;
      }

      onAction && onAction(e, action, ctx);
    },
    []
  );

  const handleReset = React.useCallback(() => {
    const values = {...data};
    // todo 这里不精准，如果表单项有容器嵌套，这里将不正确
    formItems.forEach(key => setVariable(values, key, undefined));

    onQuery(values);
  }, [data]);

  const isActive = React.useMemo(() => {
    // todo 这里不精准，如果表单项有容器嵌套，这里将不正确
    return formItems.some(key => data?.[key]);
  }, [data]);

  return (
    <span
      ref={ref}
      className={cx(
        `${ns}TableCell-searchBtn`,
        isActive ? 'is-active' : '',
        isOpened ? 'is-opened' : ''
      )}
      {...testIdBuilder?.getTestId()}
    >
      <span onClick={open}>
        <Icon icon="search" className="icon" />
      </span>
      {isOpened ? (
        <Overlay
          container={popOverContainer || (() => ref.current)}
          placement="left-bottom-left-top right-bottom-right-top"
          target={popOverContainer ? () => ref.current?.parentNode : null}
          show
        >
          <PopOver
            classPrefix={ns}
            onHide={close}
            className={cx(
              `${ns}TableCell-searchPopOver`,
              (searchable as any).className
            )}
            overlay
          >
            {
              render('quick-search-form', formSchema, {
                popOverContainer,
                data: data,
                onSubmit: handleSubmit,
                onAction: handleAction
              }) as JSX.Element
            }
          </PopOver>
        </Overlay>
      ) : null}
    </span>
  );
}
