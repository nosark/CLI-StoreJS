const { Store } = require('../../../src/store');

test('Testing Store Construction Store()', () => {
  const store = new Store();
  expect(store.table).toEqual({});
  expect(store.transactionStack).toEqual([]);
  expect(store.previousTransactionValues).toEqual([]);
});

test('Testing Store.set() : add key-value pair to table', () => {
  const store = new Store();
  let key = 'abc';
  let value = '123';

  store.set(key, value);
  store.set('123', '3');
  store.set('664', 123)
  expect(store.getValue(key)).toBe(value);
  expect(store.getNumOccurences('123')).toBe(1);
});

test('Testing Store.getValue()' , () => {
  const t = new Store();
  t.set('abc', '123');
  t.set('def', 123);
  t.set('123', 6);

  const tableSize = Object.keys(t.table).length;

  expect(tableSize).toBe(3);
  expect(t.getValue('abc')).toBe('123');
  expect(t.getValue('def')).toBe(123);
  expect(t.getValue('123')).toBe(6);
});

test('Testing Store.getNumOccurences()', () => {
  const store = new Store();
  store.set('abc', 123);
  store.set('123', 6);
  store.set('333', 6);
  store.set('464', 6);
  const v = store.getNumOccurences(6);
  const size = Object.keys(store.table).length;
  expect(v).toBe(3);
  expect(size).toBe(4);

  store.delete('123');
  expect(Object.keys(store.table).length).toBe(3);
  const val = store.getValue('123');
  expect(val).toBe(null);
});