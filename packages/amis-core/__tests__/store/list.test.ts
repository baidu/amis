import {ListStore} from '../../src/store/list';

describe('ListStore', () => {
  it('restores the original item order when resetting a drag', () => {
    const store = ListStore.create({id: 'mock-id', storeType: 'list'});
    store.initItems([
      {id: 'first', label: 'First'},
      {id: 'second', label: 'Second'},
      {id: 'third', label: 'Third'}
    ]);

    store.exchange(0, 2);
    expect(store.items.map(item => item.data.id)).toEqual([
      'second',
      'third',
      'first'
    ]);
    expect(store.moved).toBe(1);

    store.reset();

    expect(store.items.map(item => item.data.id)).toEqual([
      'first',
      'second',
      'third'
    ]);
    expect(store.moved).toBe(0);
  });
});
