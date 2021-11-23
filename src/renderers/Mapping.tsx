import React from 'react';
import {Renderer, RendererEnv, RendererProps} from '../factory';
import {ServiceStore, IServiceStore} from '../store/service';
import {Api, SchemaNode, PlainObject, Payload} from '../types';
import {filter} from '../utils/tpl';
import cx from 'classnames';
import {
  BaseSchema,
  SchemaApi,
  SchemaTokenizeableString,
  SchemaTpl
} from '../Schema';
import {withStore} from '../components/WithStore';
import {flow, Instance, types} from 'mobx-state-tree';
import {getPropValue, getVariable, guid, isObject} from '../utils/helper';
import {StoreNode} from '../store/node';
import isPlainObject from 'lodash/isPlainObject';
import {isPureVariable, resolveVariableAndFilter} from '../utils/tpl-builtin';
import {
  buildApi,
  isApiOutdated,
  isEffectiveApi,
  normalizeApi,
  normalizeApiResponseData
} from '../utils/api';

/**
 * Mapping 映射展示控件。
 * 文档：https://baidu.gitee.io/amis/docs/components/mapping
 */
export interface MappingSchema extends BaseSchema {
  /**
   * 指定为映射展示控件
   */
  type: 'map' | 'mapping';

  /**
   * 关联字段名。
   */
  name?: string;

  /**
   * 配置映射规则，值可以使用模板语法。当 key 为 * 时表示 else，也就是说值没有映射到任何规则时用 * 对应的值展示。
   */
  map?: {
    [propName: string]: SchemaTpl;
  };

  /**
   * 如果想远程拉取字典，请配置 source 为接口。
   */
  source?: SchemaApi | SchemaTokenizeableString;

  /**
   * 占位符
   */
  placeholder?: string;
}

export const Store = StoreNode.named('MappingStore')
  .props({
    fetching: false,
    errorMsg: '',
    map: types.frozen<{
      [propName: string]: any;
    }>({})
  })
  .actions(self => {
    const load: (env: RendererEnv, api: Api, data: any) => Promise<any> = flow(
      function* (env, api, data) {
        try {
          self.fetching = true;
          const ret: Payload = yield env.fetcher(api, data);

          if (ret.ok) {
            const data = normalizeApiResponseData(ret.data);
            (self as any).setMap(data);
          } else {
            throw new Error(ret.msg || 'fetch error');
          }
        } catch (e) {
          self.errorMsg = e.message;
        } finally {
          self.fetching = false;
        }
      }
    );

    return {
      load,
      setMap(options: any) {
        if (isObject(options)) {
          self.map = {
            ...options
          };
        }
      }
    };
  });

export type IStore = Instance<typeof Store>;

export interface MappingProps
  extends Omit<RendererProps, 'store'>,
    Omit<MappingSchema, 'type' | 'className'> {
  store: IStore;
}

export const MappingField = withStore(props =>
  Store.create(
    {
      id: guid(),
      storeType: Store.name
    },
    props.env
  )
)(
  class extends React.Component<MappingProps, object> {
    static defaultProps: Partial<MappingProps> = {
      placeholder: '-',
      map: {
        '*': '通配值'
      }
    };

    constructor(props: MappingProps) {
      super(props);

      props.store.syncProps(props, undefined, ['map']);
    }

    componentDidMount() {
      const {store, source, data} = this.props;

      this.reload();
    }

    componentDidUpdate(prevProps: MappingProps) {
      const props = this.props;
      const {store, source, data} = this.props;

      store.syncProps(props, prevProps, ['map']);

      if (isPureVariable(source)) {
        const prev = resolveVariableAndFilter(
          prevProps.source as string,
          prevProps.data,
          '| raw'
        );
        const curr = resolveVariableAndFilter(source as string, data, '| raw');

        if (prev !== curr) {
          store.setMap(curr);
        }
      } else if (
        isApiOutdated(
          prevProps.source,
          props.source,
          prevProps.data,
          props.data
        )
      ) {
        this.reload();
      }
    }

    reload() {
      const {source, data, env} = this.props;
      const store = this.props.store;
      if (isPureVariable(source)) {
        store.setMap(resolveVariableAndFilter(source, data, '| raw'));
      } else if (isEffectiveApi(source, data)) {
        const api = normalizeApi(source, 'get');
        api.cache = api.cache ?? 30 * 1000;
        store.load(env, api, data);
      }
    }

    renderSingleValue(key: any, reactKey?: number) {
      const {
        className,
        placeholder,
        render,
        classnames: cx,
        name,
        data,
        store
      } = this.props;
      let viewValue: React.ReactNode = (
        <span className="text-muted">{placeholder}</span>
      );
      const map = store.map;
      let value: any = undefined;
      // trim 一下，干掉一些空白字符。
      key = typeof key === 'string' ? key.trim() : key;
      if (
        typeof key !== 'undefined' &&
        map &&
        (value =
          map[key] ??
          (key === true && map['1']
            ? map['1']
            : key === false && map['0']
            ? map['0']
            : map['*'])) !== undefined
      ) {
        viewValue = render('tpl', value);
      }

      return (
        <span key={`map-${reactKey}`} className={cx('MappingField', className)}>
          {viewValue}
        </span>
      );
    }

    render() {
      const mapKey = getPropValue(this.props);
      if (Array.isArray(mapKey)) {
        return (
          <span>
            {mapKey.map((singleKey: string, index: number) =>
              this.renderSingleValue(singleKey, index)
            )}
          </span>
        );
      } else {
        return this.renderSingleValue(mapKey, 0);
      }
    }
  }
);

@Renderer({
  test: /(^|\/)(?:map|mapping)$/,
  name: 'mapping'
})
export class MappingFieldRenderer extends React.Component<RendererProps> {
  render() {
    return <MappingField {...this.props} />;
  }
}
