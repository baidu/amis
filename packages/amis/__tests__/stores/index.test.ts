import {RendererStore} from '../../src';
import {getSnapshot, getEnv} from 'mobx-state-tree';
import {ServiceStore} from '../../src';

test('store:index', () => {
  const store = RendererStore.create({});

  expect(getSnapshot(store)).toMatchSnapshot();

  const serviceStore = ServiceStore.create({
    path: '/xxx',
    storeType: ServiceStore.name,
    id: '1'
  });
  store.addStore(serviceStore);

  expect(getSnapshot(store)).toMatchSnapshot();

  const serviceStore2 = ServiceStore.create({
    path: '/yyy',
    storeType: ServiceStore.name,
    id: '2',
    parentId: '1'
  });

  store.addStore(serviceStore2);

  expect(getSnapshot(store)).toMatchSnapshot();

  expect(serviceStore2.parentStore).toEqual(serviceStore);

  store.removeStore(serviceStore2);
  expect(getSnapshot(store)).toMatchSnapshot();
});

test('store:index env', () => {
  const fetcher = jest.fn();
  const notify = jest.fn();
  const isCancel = jest.fn(() => false);

  const store = RendererStore.create(
    {},
    {
      fetcher,
      notify,
      isCancel
    }
  );

  expect(store.fetcher).toBe(fetcher);
  expect(store.notify).toBe(notify);
  expect(store.isCancel).toBe(isCancel);
});
