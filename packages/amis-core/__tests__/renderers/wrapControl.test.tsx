/*
 * @author: ranqirong
 * @date: 2024-10-10
 * @description:
 */
import React from 'react';
import {wrapControl} from '../../src/renderers/wrapControl';
import {render, screen} from '@testing-library/react';
import {RootStoreContext} from '../../src/WithRootStore';
import {RendererStore} from '../../src/store/index';
import {FormItemProps} from '../../src/renderers/Item';

const renderComponent = (WrappedComponent: any, props: any) => {
  const store = RendererStore.create({});
  return render(
    <RootStoreContext.Provider value={store}>
      <WrappedComponent rootStore={{}} $schema={{}} {...props} />
    </RootStoreContext.Provider>
  );
};

describe('constructor', () => {
  it('如果传入有defaultProps包含name属性，则创建FormItemStore', () => {
    const OriginComponent = (props: FormItemProps) => {
      // 用于断言formItem已被注册
      return <div>{props.formItem?.storeType}</div>;
    };
    OriginComponent.defaultProps = {
      name: 'test'
    };
    const WrappedComponent = wrapControl({}, OriginComponent as any);

    renderComponent(WrappedComponent, {$schema: {}});
    expect(screen.getByText('FormItemStore')).toBeInTheDocument();
  });

  it('如果$schema中包含name属性，则创建FormItemStore', () => {
    const OriginComponent = (props: FormItemProps) => {
      // 用于断言formItem已被注册
      return <div>{props.formItem?.storeType}</div>;
    };
    const WrappedComponent = wrapControl({}, OriginComponent as any);

    renderComponent(WrappedComponent, {$schema: {name: 'test'}});
    expect(screen.getByText('FormItemStore')).toBeInTheDocument();
  });

  it('如果$schema和defaultProps中都不包含name属性，则不创建FormItemStore', () => {
    const OriginComponent = (props: FormItemProps) => {
      // 用于断言formItem已被注册
      return <div>{props.formItem?.storeType}</div>;
    };
    const WrappedComponent = wrapControl({}, OriginComponent as any);

    renderComponent(WrappedComponent, {$schema: {}});
    expect(screen.queryByText('FormItemStore')).not.toBeInTheDocument();
  });
});
