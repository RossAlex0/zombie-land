import { describe, expect, test } from 'vitest';
import { filterPublicActivities } from './activity';

describe('filterPublicActivities', () => {
  test('it should hide closed activities from the public list', () => {
    //ARRANGE
    const activities = [
      { id: 1, status: 'active' },
      { id: 2, status: 'close' },
      { id: 3, status: 'active' },
    ];

    //ACT
    const result = filterPublicActivities(activities);

    //ASSERT
    expect(result.map((activity) => activity.id)).toEqual([1, 3]);
  });
});
