import React from 'react';
import PropTypes from 'prop-types';
import {Renderer, RendererProps} from '../../factory';
import BasicService, {ServiceProps, ServiceSchema} from '../Service';
import {Schema, Payload} from '../../types';
import Scoped, {ScopedContext, IScopedContext} from '../../Scoped';
import {observer} from 'mobx-react';
import {ServiceStore, IServiceStore} from '../../store/service';
import {IFormStore} from '../../store/form';
import {isObject} from '../../utils/helper';
import {FormBaseControl, FormControlSchema} from './Item';

/**
 * Sevice
 * 文档：https://baidu.gitee.io/amis/docs/components/form/sevice
 */
export interface ServiceControlSchema extends FormBaseControl, ServiceSchema {
  type: 'service';

  /**
   * 表单项集合
   */
  controls?: Array<FormControlSchema>;

  /**
   * @deprecated 请用类型 tabs
   */
  tabs?: any;

  /**
   * @deprecated 请用类型 fieldSet
   */
  fieldSet?: any;
}

@Renderer({
  test: /(^|\/)form\/(.*)\/service$/,
  weight: -100,
  storeType: ServiceStore.name,
  storeExtendsData: false,
  name: 'service-control'
})
export class ServiceRenderer extends BasicService {
  static propsList: Array<string> = ['onChange'];
  static contextType = ScopedContext;

  componentWillMount() {
    const scoped = this.context as IScopedContext;
    scoped.registerComponent(this);
  }

  componentDidMount() {
    const {formInited, addHook} = this.props;
    this.mounted = true;

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

  afterDataFetch(payload: Payload) {
    const formStore: IFormStore = this.props.formStore;
    const onChange = this.props.onChange;

    // 有可能有很多层 serivce，这里需要注意。
    if (formStore && this.isFormMode()) {
      const keys = isObject(payload?.data) ? Object.keys(payload.data) : [];

      if (keys.length) {
        formStore.setValues(payload.data);
        onChange(payload.data[keys[0]], keys[0]);
      }
    }

    return super.afterDataFetch(payload);
  }

  // schema 接口可能会返回数据，需要把它同步到表单上，否则会没用。
  afterSchemaFetch(schema: any) {
    const formStore: IFormStore = this.props.formStore;
    const onChange = this.props.onChange;

    // 有可能有很多层 serivce，这里需要注意。
    if (formStore && this.isFormMode()) {
      const keys = isObject(schema?.data) ? Object.keys(schema.data) : [];

      if (keys.length) {
        formStore.setValues(schema.data);
        onChange(schema.data[keys[0]], keys[0]);
      }
    }

    return super.afterSchemaFetch(schema);
  }

  isFormMode() {
    const {
      store,
      body: schema,
      controls,
      tabs,
      feildSet,
      renderFormItems,
      classnames: cx
    } = this.props;

    const finnalSchema = store.schema ||
      schema || {
        controls,
        tabs,
        feildSet
      };

    return (
      finnalSchema &&
      !finnalSchema.type &&
      (finnalSchema.controls || finnalSchema.tabs || finnalSchema.feildSet) &&
      renderFormItems
    );
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
      classnames: cx
    } = this.props;

    if (this.isFormMode()) {
      const finnalSchema = store.schema ||
        schema || {
          controls,
          tabs,
          feildSet
        };

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
