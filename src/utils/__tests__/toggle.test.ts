import { append } from '../append';
import { createList } from '../create-list';
import { toArray } from '../to-array';
import { toggle } from '../toggle';

describe('toggle', () => {
  it('flips done on the matching node', () => {
    const list = append(append(createList(), 'a'), 'b');
    const [first] = toArray(list);
    const after = toggle(list, first.id);
    expect(toArray(after)[0].done).toBe(true);
    expect(toArray(after)[1].done).toBe(false);
  });

  it('flips back when toggled twice', () => {
    const list = append(createList(), 'a');
    const id = list.head?.id ?? '';
    const after = toggle(toggle(list, id), id);
    expect(after.head?.done).toBe(false);
  });

  it('is a no-op when the id is not found', () => {
    const list = append(createList(), 'a');
    const after = toggle(list, 'missing');
    expect(after.head?.done).toBe(false);
    expect(after.size).toBe(list.size);
  });

  it('preserves size', () => {
    const list = append(append(createList(), 'a'), 'b');
    const [first] = toArray(list);
    expect(toggle(list, first.id).size).toBe(2);
  });
});
