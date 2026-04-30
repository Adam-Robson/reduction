import { append } from '../append';
import { createList } from '../create-list';
import { toArray } from '../to-array';

describe('toArray', () => {
  it('returns [] for an empty list', () => {
    expect(toArray(createList())).toEqual([]);
  });

  it('walks the list in insertion order', () => {
    const list = append(append(append(createList(), 'a'), 'b'), 'c');
    expect(toArray(list).map((n) => n.text)).toEqual(['a', 'b', 'c']);
  });
});
