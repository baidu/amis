import {SnapshotIn, types} from 'mobx-state-tree';
import {Navigation} from '../components/AsideNav';
import {RendererEnv} from '../factory';
import {filterTree, findTree, guid, mapTree} from '../utils/helper';
import {ServiceStore} from './service';

export const AppStore = ServiceStore.named('AppStore')
  .props({
    pages: types.frozen(),
    activePage: types.frozen(),
    folded: false,
    offScreen: false
  })
  .views(self => ({
    get navigations(): Array<Navigation> {
      if (Array.isArray(self.pages)) {
        return mapTree(self.pages, (item, index, level, paths) => {
          return {
            label: item.label,
            icon: item.icon,
            path: item.path,
            children: item.children,
            visible: item.visible
          };
        });
      }

      return [
        {
          label: '导航',
          children: [
            {
              label: '暂无页面'
            }
          ]
        }
      ];
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
      let bcns: any;
      let page = findTree(self.pages, (item, index, level, paths) => {
        if (item.path === to) {
          bcns = paths;
          return true;
        }
        return false;
      });

      if (page) {
        this.setActivePage(page, bcns, env);
      }
    },

    setActivePage(page: any, bcn: Array<any>, env: RendererEnv) {
      self.activePage = {
        ...page,
        bcn
      };

      if (page.schema) {
        self.schema = page.schema;
      } else if (page.schemaApi) {
        self.fetchSchema(page.schemaApi, self.activePage);
      } else if (page.redirect) {
        env.jumpTo(page.redirect);
        return;
      } else if (page.rewrite) {
        this.rewrite(page.rewrite, env);
      } else {
        self.schema = null;
      }
    },

    updateActivePage(env: RendererEnv) {
      if (!Array.isArray(self.pages)) {
        return;
      }
      let matched: any;
      let bcns: any;

      let page = findTree(self.pages, (item, index, level, paths) => {
        if (item.path) {
          matched = env.isCurrentUrl(item.path, item);

          if (matched) {
            bcns = paths;
            return true;
          }
        }
        return false;
      });

      if (page) {
        this.setActivePage(page, bcns, env);
      } else {
        self.activePage = null;
      }
    }
  }));

export type IAppStore = typeof AppStore.Type;
export type SAppStore = SnapshotIn<typeof AppStore>;
