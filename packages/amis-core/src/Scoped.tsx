/**
 * @file 用来创建一个域，在这个域里面会把里面的运行时实例注册进来，方便组件之间的通信。
 * @author fex
 */

import React from 'react';
import find from 'lodash/find';
import values from 'lodash/values';
import hoistNonReactStatic from 'hoist-non-react-statics';
import {dataMapping, registerFunction} from './utils/tpl-builtin';
import {RendererEnv, RendererProps} from './factory';
import {
  autobind,
  qsstringify,
  qsparse,
  eachTree,
  findTree,
  TreeItem,
  parseQuery,
  getVariable
} from './utils/helper';
import {RendererData, ActionObject} from './types';
import {isPureVariable} from './utils/isPureVariable';
import {createObject, createRendererEvent, filter, memoParse} from './utils';
import {ListenerAction, runActions} from './actions';

/**
 * target 里面可能包含 ?xxx=xxx，这种情况下，需要把 ?xxx=xxx 保留下来，然后对前面的部分进行 filter
 * 因为后面会对 query 部分做不一样的处理。会保留原始的值。而不是会转成字符串。
 * @param target
 * @param data
 * @returns
 */
export function filterTarget(target: string, data: Record<string, any>) {
  const idx = target.indexOf('?');

  if (~idx) {
    return filter(target.slice(0, idx), data) + target.slice(idx);
  }

  return filter(target, data, '| raw');
}

/**
 * 分割目标，如果里面有表达式，不要跟表达式里面的逗号冲突。
 * @param target
 * @returns
 */
export function splitTarget(target: string): Array<string> {
  try {
    const ast = memoParse(target);
    const pos: Array<number> = [];
    ast.body.forEach((item: any) => {
      // 不要处理表达式里面的东西。
      if (item.type === 'raw') {
        const parts = (item.value as string).split(',');
        if (parts.length > 1) {
          parts.pop();
          let start = item.start.index;
          parts.forEach(part => {
            pos.push(start + part.length);
            start += part.length + 1;
          });
        }
      }
    });
    if (pos.length) {
      let parts: Array<string> = [];

      pos.reduceRight((arr: Array<string>, index) => {
        arr.unshift(target.slice(index + 1)?.trim());
        target = target.slice(0, index);
        return arr;
      }, parts);
      parts.unshift(target);

      return parts;
    }
  } catch (e) {}
  return [target];
}

export interface ScopedComponentType extends React.Component<RendererProps> {
  focus?: () => void;
  doAction?: (
    action: ActionObject,
    data: RendererData,
    throwErrors?: boolean,
    args?: any
  ) => void;
  receive?: (values: RendererData, subPath?: string, replace?: boolean) => void;
  reload?: (
    subpath?: string,
    query?: any,
    ctx?: RendererData,
    silent?: boolean,
    replace?: boolean,
    args?: any
  ) => void;
  context: any;
  setData?: (value?: object, replace?: boolean, index?: number) => void;
}

export interface IScopedContext {
  rendererType?: string;
  component?: ScopedComponentType;
  parent?: AliasIScopedContext;
  children?: AliasIScopedContext[];
  registerComponent: (component: ScopedComponentType) => void;
  unRegisterComponent: (component: ScopedComponentType) => void;
  getComponentByName: (name: string) => ScopedComponentType;
  getComponentById: (id: string) => ScopedComponentType | undefined;
  getComponentByIdUnderCurrentScope: (
    id: string,
    ignoreScope?: IScopedContext
  ) => ScopedComponentType | undefined;
  getComponents: () => Array<ScopedComponentType>;
  reload: (target: string, ctx: RendererData) => void | Promise<void>;
  send: (target: string, ctx: RendererData) => void;
  close: (target: string) => void;
  closeById: (target: string) => void;
  getComponentsByRefPath: (
    session: string,
    path: string
  ) => ScopedComponentType[];
  doAction: (actions: ListenerAction | ListenerAction[], ctx: any) => void;
}
type AliasIScopedContext = IScopedContext;

const rootScopedContext = createScopedTools('');
export const ScopedContext = React.createContext(rootScopedContext);

function createScopedTools(
  path?: string,
  parent?: AliasIScopedContext,
  env?: RendererEnv,
  rendererType?: string
): IScopedContext {
  const components: Array<ScopedComponentType> = [];
  const self: IScopedContext = {
    rendererType,
    component: undefined,
    parent,
    registerComponent(component: ScopedComponentType) {
      // 不要把自己注册在自己的 Scoped 上，自己的 Scoped 是给子节点们注册的。
      if (component.props.$path === path && parent) {
        self.component = component;
        return parent.registerComponent(component);
      }

      if (!~components.indexOf(component)) {
        components.push(component);
      }
    },

    unRegisterComponent(component: ScopedComponentType) {
      // 自己本身实际上注册在父级 Scoped 上。
      if (component.props.$path === path && parent) {
        // 如果是自己，尝试把自己从父级 Scoped 上移除，否则在某些场景下会导致父级的 children 一直增长。
        const idx = parent.children!.indexOf(self);
        ~idx && parent.children!.splice(idx, 1);
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
            const result: ScopedComponentType = scope.getComponentByName(name);
            return result && idx < len - 1 ? result.context : result;
          }

          return null;
        }, this);
      }

      const resolved = find(
        components,
        component =>
          filter(component.props.name, component.props.data) === name ||
          component.props.id === name
      );
      return resolved || (parent && parent.getComponentByName(name));
    },

    getComponentByIdUnderCurrentScope(
      id: string,
      ignoreScope?: IScopedContext
    ) {
      let component = undefined;
      findTree(
        [this],
        (item: TreeItem) =>
          item !== ignoreScope &&
          item.getComponents().find((cmpt: ScopedComponentType) => {
            if (filter(cmpt.props.id, cmpt.props.data) === id) {
              component = cmpt;
              return true;
            }
            return false;
          })
      ) as ScopedComponentType | undefined;

      return component;
    },

    getComponentById(id: string) {
      let root: AliasIScopedContext = this;
      let ignoreScope: AliasIScopedContext | undefined = undefined;

      // 找到顶端scoped
      while (root) {
        // 优先从当前scope查找
        // 直接跑到顶层查找，对于有历史标签一次渲染多个页面的情况，会有问题
        const component = root.getComponentByIdUnderCurrentScope(
          id,
          ignoreScope
        );

        if (component) {
          return component;
        }

        if (!root.parent || root.parent === rootScopedContext) {
          break;
        }

        ignoreScope = root;
        root = root.parent;
      }

      return undefined;
    },

    /**
     * 基于绑定的变量名称查找组件
     * 支持形如${xxx}的格式
     *
     * @param session store的session, 默认为全局的
     * @param path 变量路径, 包含命名空间
     */
    getComponentsByRefPath(
      session: string,
      path: string
    ): ScopedComponentType[] {
      if (!path || typeof path !== 'string') {
        return [];
      }

      const cmptMaps: Record<string, ScopedComponentType> = {};
      let root: AliasIScopedContext = this;

      while (root.parent) {
        root = root.parent;
      }

      eachTree([root], (item: TreeItem) => {
        const scopedCmptList: ScopedComponentType[] =
          item.getComponents() || [];

        if (Array.isArray(scopedCmptList)) {
          for (const cmpt of scopedCmptList) {
            const pathKey = cmpt?.props?.$path ?? 'unknown';
            const schema = cmpt?.props?.$schema ?? {};
            const cmptSession = cmpt?.props.env?.session ?? 'global';

            /** 仅查找当前session的组件 */
            if (cmptMaps[pathKey] || session !== cmptSession) {
              continue;
            }

            /** 非Scoped组件, 查找其所属的父容器 */
            if (cmpt?.setData && typeof cmpt.setData === 'function') {
              cmptMaps[pathKey] = cmpt;
              continue;
            }

            /** 查找Scoped组件中的引用 */
            for (const key of Object.keys(schema)) {
              const expression = schema[key];

              if (
                typeof expression === 'string' &&
                isPureVariable(expression)
              ) {
                /** 考虑到数据映射函数的情况，将宿主变量提取出来 */
                const host = expression
                  .substring(2, expression.length - 1)
                  .split('|')[0];

                if (host && host === path) {
                  cmptMaps[pathKey] = cmpt;
                  break;
                }
              }
            }
          }
        }
      });

      return values(cmptMaps);
    },

    getComponents() {
      return components.concat();
    },

    reload(target: string | Array<string>, ctx: any) {
      const scoped = this;

      let targets = typeof target === 'string' ? splitTarget(target) : target;
      targets.forEach(name => {
        const idx2 = name.indexOf('?');
        let query = null;

        if (~idx2) {
          const queryObj = qsparse(
            name
              .substring(idx2 + 1)
              .replace(
                /\$\{(.*?)\}/,
                (_, match) => '${' + encodeURIComponent(match) + '}'
              )
          );
          query = dataMapping(queryObj, ctx);
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
          const component =
            scoped.getComponentByName(name) || scoped.getComponentById(name);
          component &&
            component.reload &&
            component.reload(subPath, query, ctx);
        }
      });
    },

    send(receive: string | Array<string>, values: object) {
      const scoped = this;
      let receives =
        typeof receive === 'string' ? splitTarget(receive) : receive;

      // todo 没找到做提示！
      receives.forEach(name => {
        const askIdx = name.indexOf('?');
        if (~askIdx) {
          const query = name.substring(askIdx + 1);
          const queryObj = qsparse(
            query.replace(
              /\$\{(.*?)\}/,
              (_, match) => '${' + encodeURIComponent(match) + '}'
            )
          );

          name = name.substring(0, askIdx);
          values = dataMapping(queryObj, values);
        }

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
            ...parseQuery(location),
            ...values
          };
          const link = location.pathname + '?' + qsstringify(query);
          env.updateLocation(link, true);
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
        splitTarget(target)
          .map(name => scoped.getComponentByName(name))
          .filter(component => component && component.props.show)
          .forEach(closeDialog);
      }
    },

    /**
     * 关闭指定id的弹窗
     * @param id
     */
    closeById(id: string) {
      const scoped = this;
      const component: any = scoped.getComponentById(id);
      if (component && component.props.show) {
        closeDialog(component);
      }
    },

    async doAction(actions: ListenerAction | ListenerAction[], ctx: any) {
      const renderer = this.getComponents()[0]; // 直接拿最顶层
      const rendererEvent = createRendererEvent('embed', {
        env,
        nativeEvent: undefined,
        data: createObject(renderer.props.data, ctx),
        scoped: this
      });

      await runActions(actions, renderer, rendererEvent);

      if (rendererEvent.prevented) {
        return;
      }
    }
  };

  registerFunction(
    'GETRENDERERDATA',
    (componentId: string, path?: string, scoped: any = self) => {
      const component = scoped.getComponentById(componentId);
      const data = component?.getData?.();
      if (path) {
        const variable = getVariable(data, path);
        return variable;
      }
      return data;
    }
  );

  registerFunction(
    'GETRENDERERPROP',
    (componentId: string, path?: string, scoped: any = self) => {
      const component = scoped.getComponentById(componentId);
      const props = component?.props;
      if (path) {
        const variable = getVariable(props, path);
        return variable;
      }
      return props;
    }
  );

  if (!parent) {
    return self;
  }

  !parent.children && (parent.children = []);

  // 把孩子带上
  parent.children!.push(self);

  return self;
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
  ComposedComponent: React.ComponentType<T>,
  rendererType?: string
): React.ComponentType<
  T & {
    scopeRef?: (ref: any) => void;
  }
> & {
  ComposedComponent: React.ComponentType<T>;
} {
  type ScopedProps = T & {
    scopeRef?: (ref: any) => void;
  };
  class ScopedComponent extends React.Component<ScopedProps> {
    static displayName = `Scoped(${
      ComposedComponent.displayName || ComposedComponent.name
    })`;
    static contextType = ScopedContext;
    static ComposedComponent = ComposedComponent;
    ref: any;
    scoped?: IScopedContext;

    constructor(props: ScopedProps, context: IScopedContext) {
      super(props);

      this.scoped = createScopedTools(
        this.props.$path,
        context,
        this.props.env,
        rendererType
      );

      const scopeRef = props.scopeRef;
      scopeRef && scopeRef(this.scoped);
    }

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

    componentWillUnmount() {
      const scopeRef = this.props.scopeRef;
      scopeRef && scopeRef(null);
      delete this.scoped;
    }

    render() {
      const {scopeRef, ...rest} = this.props;

      return (
        <ScopedContext.Provider value={this.scoped!}>
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
