import { EntityId } from './EntityId';

class TestId extends EntityId {
}

describe('ValueObject', () => {
  test('base', async () => {
    const id = new TestId('1');
    const id2 = new EntityId('1');
    const id3 = new TestId('1');
    expect(id).toEqual(id3);
    expect(id).not.toEqual(id2);
  });
});
