/* @flow */

import assert from 'assert';

import getTransitionTimeMs from '../src/getTransitionTimeMs';

describe('getTransitionTimeMs', function() {
  it('works with milliseconds', function() {
    assert.strictEqual(getTransitionTimeMs('250ms ease'), 250);
  });

  it('works with fractional seconds', function() {
    assert.strictEqual(getTransitionTimeMs('.25s ease'), 250);
  });

  it('works with real seconds', function() {
    assert.strictEqual(getTransitionTimeMs('10.2s ease-in'), 10.2*1000);
  });

  it('works with integer seconds', function() {
    assert.strictEqual(getTransitionTimeMs('10s ease-in'), 10*1000);
  });

  it('throws error', function() {
    assert.throws(() => getTransitionTimeMs('10ss ease-in'));
  });
});
