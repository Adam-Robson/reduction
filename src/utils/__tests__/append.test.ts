import { append } from '../append';
import { createList } from '../create-list';
import { toArray } from '../to-array';

describe('append', () => {
  it('adds the first node to an empty list', () => {
    const list = append(createList(), 'first');
    expect(list.size).toBe(1);
    expect(list.head?.text).toBe('first');
    expect(list.head?.done).toBe(false);
    expect(list.head?.next).toBeNull();
  });

  it('appends to the tail and increments size', () => {
    const list = append(append(append(createList(), 'a'), 'b'), 'c');
    expect(list.size).toBe(3);
    expect(toArray(list).map((n) => n.text)).toEqual(['a', 'b', 'c']);
  });

  it('assigns unique ids', () => {
    const list = append(append(createList(), 'a'), 'b');
    const [n1, n2] = toArray(list);
    expect(n1.id).not.toBe(n2.id);
  });
});
