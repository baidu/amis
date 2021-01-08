import {SnapshotIn, types} from 'mobx-state-tree';
import {Navigation} from '../components/AsideNav';
import {guid, mapTree} from '../utils/helper';
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
            children: item.children
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
      if (Array.isArray(pages)) {
        pages = mapTree(pages, (item, index, level, paths) => {
          let path = item.link;

          if (!item.isDefaultPage && (item.schema || item.schemaApi)) {
            path = item.url || guid();

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
            label: item.label,
            icon: item.icon,
            path,
            children: item.children
          };
        });
        self.pages = pages;
      }
    },

    updateActivePage(location: any) {
      debugger;
    }
  }));

export type IAppStore = typeof AppStore.Type;
export type SAppStore = SnapshotIn<typeof AppStore>;
