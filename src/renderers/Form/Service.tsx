import React from 'react';
import PropTypes from 'prop-types';
import {Renderer, RendererProps} from '../../factory';
import BasicService, {ServiceProps} from '../Service';
import {Schema} from '../../types';
import Scoped, {ScopedContext, IScopedContext} from '../../Scoped';
import {observer} from 'mobx-react';
import {ServiceStore, IServiceStore} from '../../store/service';

@Renderer({
  test: /(^|\/)form\/(.*)\/service$/,
  weight: -100,
  storeType: ServiceStore.name,
  storeExtendsData: false,
  name: 'service-control'
})
export class ServiceRenderer extends BasicService {
  static contextType = ScopedContext;

  componentWillMount() {
    const scoped = this.context as IScopedContext;
    scoped.registerComponent(this);
  }

  componentDidMount() {
    const {formInited, addHook} = this.props;

    // form层级下的所有service应该都会走这里
    // 但是传入props有可能是undefined，所以做个处理
    if (formInited !== false) {
      super.componentDidMount();
    } else {
      addHook && addHook(this.initFetch, 'init');
    }
  }

  componentDidUpdate(prevProps: ServiceProps) {
    const {formInited} = this.props;
    if (formInited !== false) {
      super.componentDidUpdate(prevProps);
    }
  }

  componentWillUnmount() {
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this);

    const removeHook = this.props.removeHook;
    removeHook && removeHook(this.initFetch, 'init');
    super.componentWillUnmount();
  }

  renderBody(): JSX.Element {
    const {
      render,
      store,
      body: schema,
      controls,
      tabs,
      feildSet,
      renderFormItems,
      formMode,
      $path,
      classnames: cx
    } = this.props;

    const finnalSchema = store.schema ||
      schema || {
      controls,
      tabs,
      feildSet
    };
    if (
      finnalSchema &&
      !finnalSchema.type &&
      (finnalSchema.controls || finnalSchema.tabs || finnalSchema.feildSet) &&
      renderFormItems
    ) {
      return (
        <div
          key={store.schemaKey || 'forms'}
          className={cx(`Form--${formMode || 'normal'}`)}
        >
          {renderFormItems(finnalSchema, 'controls', {
            store,
            data: store.data,
            render
          })}
        </div>
      );
    }

    return super.renderBody();
  }
}
