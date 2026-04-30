import { createList } from '../create-list';

describe('createList', () => {
  it('returns an empty list', () => {
    expect(createList()).toEqual({ head: null, size: 0 });
  });

  it('returns a fresh list each call', () => {
    expect(createList()).not.toBe(createList());
  });
});
