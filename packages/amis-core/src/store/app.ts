import {Instance, SnapshotIn, types} from 'mobx-state-tree';
import {RendererEnv} from '../factory';
import {NavigationObject} from '../types';
import {
  createObject,
  filterTree,
  findTree,
  guid,
  mapTree
} from '../utils/helper';
import {ServiceStore} from './service';

export const AppStore = ServiceStore.named('AppStore')
  .props({
    pages: types.frozen(),
    activePage: types.frozen(),
    folded: false,
    offScreen: false
  })
  .views(self => ({
    get navigations(): Array<NavigationObject> {
      if (Array.isArray(self.pages)) {
        return mapTree(self.pages, item => {
          let visible = item.visible;

          if (
            visible !== false &&
            item.path &&
            !~item.path.indexOf('http') &&
            ~item.path.indexOf(':')
          ) {
            visible = false;
          }

          return {
            label: item.label,
            icon: item.icon,
            path: item.path,
            children: item.children,
            className: item.className,
            visible
          };
        });
      }

      return [
        {
          label: self.__('App.navigation'),
          children: []
        }
      ];
    },
    get bcn() {
      return self.activePage?.bcn || [];
    },

    get pageData() {
      return createObject(self.data, {
        params: self.activePage?.params || {}
      });
    }
  }))
  .actions(self => ({
    toggleFolded() {
      self.folded = !self.folded;
    },
    toggleOffScreen() {
      self.offScreen = !self.offScreen;
    },

    setPages(pages: any) {
      if (pages && !Array.isArray(pages)) {
        pages = [pages];
      } else if (!Array.isArray(pages)) {
        return;
      }

      pages = mapTree(pages, (item, index, level, paths) => {
        let path = item.link || item.url;

        if (item.schema || item.schemaApi) {
          path =
            item.url ||
            `/${paths
              .map(item => item.index)
              .concat(index)
              .map(index => `page-${index + 1}`)
              .join('/')}`;

          if (path && path[0] !== '/') {
            let parentPath = '/';
            let index = paths.length;
            while (index > 0) {
              const item = paths[index - 1];

              if (item?.path) {
                parentPath = item.path + '/';
                break;
              }
              index--;
            }

            path = parentPath + path;
          }
        }

        return {
          ...item,
          index,
          id: item.id || guid(),
          label: item.label,
          icon: item.icon,
          path
        };
      });
      self.pages = pages;
    },

    rewrite(to: string, env: RendererEnv) {
      let page = findTree(self.pages, item => {
        if (item.path === to) {
          return true;
        }
        return false;
      });

      if (page) {
        this.setActivePage(page, env);
      }
    },

    setActivePage(
      page: any,
      env: RendererEnv & {
        showFullBreadcrumbPath?: boolean;
        showBreadcrumbHomePath?: boolean;
      },
      params?: any
    ) {
      // 同一个页面直接返回。
      if (self.activePage?.id === page.id) {
        return;
      }

      let bcn: Array<any> = [];

      findTree(self.pages, (item, index, level, paths) => {
        if (item.id === page.id) {
          bcn = paths.filter(item => item.path && item.label);
          if (env.showFullBreadcrumbPath) {
            bcn = paths.filter(item => item.label);
          }
          bcn.push({
            ...item,
            path: ''
          });
          self.__;
          if (env.showBreadcrumbHomePath && bcn[0].path !== '/') {
            bcn.unshift({
              label: self.__('App.home'),
              path: '/'
            });
          }
          return true;
        }
        return false;
      });

      self.activePage = {
        ...page,
        params: params || {},
        bcn
      };

      if (page.label) {
        document.title = page.label;
      }

      if (page.schema) {
        self.schema = page.schema;
        self.schemaKey = '' + Date.now();
      } else if (page.schemaApi) {
        self.schema = null;
        self.fetchSchema(page.schemaApi, self.activePage, {method: 'get'});
      } else if (page.redirect) {
        env.jumpTo(page.redirect);
        return;
      } else if (page.rewrite) {
        this.rewrite(page.rewrite, env);
      } else {
        self.schema = null;
        self.schemaKey = '';
      }
    },

    updateActivePage(env: RendererEnv) {
      if (!Array.isArray(self.pages)) {
        return;
      }
      let matched: any;

      let page = findTree(self.pages, item => {
        if (item.path) {
          matched = env.isCurrentUrl(item.path, item);

          if (matched) {
            return true;
          }
        }
        return false;
      });

      if (page) {
        this.setActivePage(
          page,
          env,
          typeof matched === 'object' ? matched.params : undefined
        );
      } else {
        const page = findTree(self.pages, item => item.isDefaultPage);

        if (page) {
          this.setActivePage(page, env);
        } else {
          self.activePage = null;
        }
      }
    }
  }));

export type IAppStore = Instance<typeof AppStore>;
export type SAppStore = SnapshotIn<typeof AppStore>;
