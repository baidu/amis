import {getSnapshot, getEnv, onSnapshot} from 'mobx-state-tree';
import {StoreNode} from '../../src';
import {ServiceStore} from '../../src';
import {RendererStore} from '../../src';
import omit = require('lodash/omit');

test('store:ServiceStore', () => {
  const store = ServiceStore.create({
    id: '1',
    storeType: ServiceStore.name
  });

  expect(getSnapshot(store)).toMatchSnapshot();
});

test('store:ServiceStore fetchInitData success', async () => {
  const fetcher = jest.fn().mockImplementationOnce(() =>
    Promise.resolve({
      ok: true,
      data: {
        a: 1,
        b: 2
      }
    })
  );
  const isCancel = jest.fn(() => false);
  const mainStore = RendererStore.create(
    {},
    {
      fetcher,
      isCancel
    }
  );
  const states: Array<any> = [];

  const store = ServiceStore.create(
    {
      id: '1',
      storeType: ServiceStore.name
    },
    {
      fetcher,
      isCancel
    }
  );
  mainStore.addStore(store);

  onSnapshot(store, snapshot => states.push(snapshot));

  await store.fetchInitData('/api/xxx');

  const ignoreUdatedAt = states.map(snapshot => omit(snapshot, ['updatedAt']));
  expect(ignoreUdatedAt).toMatchSnapshot();

  expect(states.length).toBe(2);
  expect(states[1].updatedAt).not.toEqual(states[0].updatedAt);
});

test('store:ServiceStore fetchInitData failed', async () => {
  const fetcher = jest
    .fn()
    .mockImplementationOnce(() => Promise.reject('Network Error'));
  const notify = jest.fn();
  const isCancel = jest.fn(() => false);
  const mainStore = RendererStore.create(
    {},
    {
      fetcher,
      notify,
      isCancel
    }
  );
  const states: Array<any> = [];

  const store = ServiceStore.create(
    {
      id: '1',
      storeType: ServiceStore.name
    },
    {
      fetcher,
      notify,
      isCancel
    }
  );
  mainStore.addStore(store);

  onSnapshot(store, snapshot => states.push(snapshot));

  await store.fetchInitData('/api/xxx');
  expect(states).toMatchSnapshot();
  expect(notify).toHaveBeenCalled();
  expect(notify).toHaveBeenLastCalledWith('error', 'Network Error');
  expect(isCancel).toHaveBeenCalled();
});
