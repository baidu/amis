import React from 'react';
import PropTypes from 'prop-types';
import {Renderer, RendererProps} from '../../factory';
import BasicService from '../Service';
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

  componentWillUnmount() {
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this);
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
