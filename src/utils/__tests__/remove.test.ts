import { append } from '../append';
import { createList } from '../create-list';
import { remove } from '../remove';
import { toArray } from '../to-array';

describe('remove', () => {
  it('returns the same list when empty', () => {
    const list = createList();
    const after = remove(list, 'anything');
    expect(after).toBe(list);
  });

  it('drops the head', () => {
    const list = append(append(createList(), 'a'), 'b');
    const headId = list.head?.id ?? '';
    const after = remove(list, headId);
    expect(after.size).toBe(1);
    expect(toArray(after).map((n) => n.text)).toEqual(['b']);
  });

  it('drops a middle node', () => {
    const list = append(append(append(createList(), 'a'), 'b'), 'c');
    const middleId = toArray(list)[1].id;
    const after = remove(list, middleId);
    expect(toArray(after).map((n) => n.text)).toEqual(['a', 'c']);
    expect(after.size).toBe(2);
  });

  it('drops the tail', () => {
    const list = append(append(createList(), 'a'), 'b');
    const tailId = toArray(list)[1].id;
    const after = remove(list, tailId);
    expect(toArray(after).map((n) => n.text)).toEqual(['a']);
    expect(after.size).toBe(1);
  });
});
