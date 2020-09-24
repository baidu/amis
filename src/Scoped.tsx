/**
 * @file 用来创建一个域，在这个域里面会把里面的运行时实例注册进来，方便组件之间的通信。
 * @author fex
 */

import React from 'react';
import find from 'lodash/find';
import PropTypes from 'prop-types';
import hoistNonReactStatic from 'hoist-non-react-statics';
import qs from 'qs';
import {dataMapping} from './utils/tpl-builtin';
import {RendererEnv, RendererProps} from './factory';
import {noop, autobind, qsstringify} from './utils/helper';
import {RendererData, Action} from './types';

export interface ScopedComponentType extends React.Component<RendererProps> {
  focus?: () => void;
  doAction?: (
    action: Action,
    data: RendererData,
    throwErrors?: boolean
  ) => void;
  receive?: (values: RendererData, subPath?: string) => void;
  reload?: (
    subPath?: string,
    query?: RendererData | null,
    ctx?: RendererData
  ) => void;
  context: any;
}

export interface IScopedContext {
  parent?: AliasIScopedContext;
  registerComponent: (component: ScopedComponentType) => void;
  unRegisterComponent: (component: ScopedComponentType) => void;
  getComponentByName: (name: string) => ScopedComponentType;
  getComponents: () => Array<ScopedComponentType>;
  reload: (target: string, ctx: RendererData) => void;
  send: (target: string, ctx: RendererData) => void;
  close: (target: string) => void;
}
type AliasIScopedContext = IScopedContext;
export const ScopedContext = React.createContext(createScopedTools(''));

function createScopedTools(
  path?: string,
  parent?: AliasIScopedContext,
  env?: RendererEnv
): IScopedContext {
  const components: Array<ScopedComponentType> = [];

  return {
    parent,
    registerComponent(component: ScopedComponentType) {
      // 不要把自己注册在自己的 Scoped 上，自己的 Scoped 是给孩子们注册的。
      if (component.props.$path === path && parent) {
        return parent.registerComponent(component);
      }

      if (!~components.indexOf(component)) {
        components.push(component);
      }
    },

    unRegisterComponent(component: ScopedComponentType) {
      // 自己本身实际上注册在父级 Scoped 上。
      if (component.props.$path === path && parent) {
        return parent.unRegisterComponent(component);
      }

      const idx = components.indexOf(component);

      if (~idx) {
        components.splice(idx, 1);
      }
    },

    getComponentByName(name: string) {
      if (~name.indexOf('.')) {
        const paths = name.split('.');
        const len = paths.length;

        return paths.reduce((scope, name, idx) => {
          if (scope && scope.getComponentByName) {
            const result = scope.getComponentByName(name);
            return result && idx < len - 1 ? result.context : result;
          }

          return null;
        }, this);
      }

      const resolved = find(
        components,
        component =>
          component.props.name === name || component.props.id === name
      );
      return resolved || (parent && parent.getComponentByName(name));
    },

    getComponents() {
      return components.concat();
    },

    reload(target: string, ctx: any) {
      const scoped = this;

      let targets =
        typeof target === 'string' ? target.split(/\s*,\s*/) : target;
      targets.forEach(name => {
        const idx2 = name.indexOf('?');
        let query = null;

        if (~idx2) {
          query = dataMapping(qs.parse(name.substring(idx2 + 1)), ctx);
          name = name.substring(0, idx2);
        }

        const idx = name.indexOf('.');
        let subPath = '';

        if (~idx) {
          subPath = name.substring(1 + idx);
          name = name.substring(0, idx);
        }

        if (name === 'window') {
          if (query) {
            const link = location.pathname + '?' + qsstringify(query);
            env ? env.updateLocation(link, true) : location.replace(link);
          } else {
            location.reload();
          }
        } else {
          const component = scoped.getComponentByName(name);
          component &&
            component.reload &&
            component.reload(subPath, query, ctx);
        }
      });
    },

    send(receive: string, values: object) {
      const scoped = this;
      let receives =
        typeof receive === 'string' ? receive.split(/\s*,\s*/) : receive;

      // todo 没找到做提示！
      receives.forEach(name => {
        const idx = name.indexOf('.');
        let subPath = '';

        if (~idx) {
          subPath = name.substring(1 + idx);
          name = name.substring(0, idx);
        }

        const component = scoped.getComponentByName(name);

        if (component && component.receive) {
          component.receive(values, subPath);
        } else if (name === 'window' && env && env.updateLocation) {
          const query = {
            ...(location.search ? qs.parse(location.search.substring(1)) : {}),
            ...values
          };
          const link = location.pathname + '?' + qsstringify(query);
          env.updateLocation(link);
        }
      });
    },

    /**
     * 主要是用来关闭指定弹框的
     *
     * @param target 目标 name
     */
    close(target: string | boolean) {
      const scoped = this;

      if (typeof target === 'string') {
        // 过滤已经关掉的，当用户 close 配置多个弹框 name 时会出现这种情况
        target
          .split(/\s*,\s*/)
          .map(name => scoped.getComponentByName(name))
          .filter(component => component && component.props.show)
          .forEach(closeDialog);
      }
    }
  };
}

function closeDialog(component: ScopedComponentType) {
  (component.context as IScopedContext)
    .getComponents()
    .filter(
      item =>
        item &&
        (item.props.type === 'dialog' || item.props.type === 'drawer') &&
        item.props.show
    )
    .forEach(closeDialog);
  component.props.onClose && component.props.onClose();
}

export function HocScoped<
  T extends {
    $path?: string;
    env: RendererEnv;
  }
>(
  ComposedComponent: React.ComponentType<T>
): React.ComponentType<
  T & {
    scopeRef?: (ref: any) => void;
  }
> & {
  ComposedComponent: React.ComponentType<T>;
} {
  class ScopedComponent extends React.Component<
    T & {
      scopeRef?: (ref: any) => void;
    }
  > {
    static displayName = `Scoped(${
      ComposedComponent.displayName || ComposedComponent.name
    })`;
    static contextType = ScopedContext;
    static ComposedComponent = ComposedComponent;
    ref: any;

    getWrappedInstance() {
      return this.ref;
    }

    @autobind
    childRef(ref: any) {
      while (ref && ref.getWrappedInstance) {
        ref = ref.getWrappedInstance();
      }

      this.ref = ref;
    }

    scoped = createScopedTools(this.props.$path, this.context, this.props.env);

    componentWillMount() {
      const scopeRef = this.props.scopeRef;
      scopeRef && scopeRef(this.scoped);
    }

    componentWillUnmount() {
      const scopeRef = this.props.scopeRef;
      scopeRef && scopeRef(null);
    }

    render() {
      const {scopeRef, ...rest} = this.props;

      return (
        <ScopedContext.Provider value={this.scoped}>
          <ComposedComponent
            {
              ...(rest as any) /* todo */
            }
            ref={this.childRef}
          />
        </ScopedContext.Provider>
      );
    }
  }

  hoistNonReactStatic(ScopedComponent, ComposedComponent);
  return ScopedComponent;
}

export default HocScoped;
