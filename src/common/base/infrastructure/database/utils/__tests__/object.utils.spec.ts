import { isEmptyObject } from '../object.utils';

describe('isEmptyObject', () => {
  it('should return true for an empty object', () => {
    expect(isEmptyObject({})).toBe(true);
  });

  it('should return false for a non-empty object', () => {
    expect(isEmptyObject({ key: 'value' })).toBe(false);
  });

  it('should return false for null', () => {
    expect(isEmptyObject(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isEmptyObject(undefined)).toBe(false);
  });

  it('should return false for arrays', () => {
    expect(isEmptyObject([])).toBe(false);
    expect(isEmptyObject(['value'])).toBe(false);
  });

  it('should return false for non-object types', () => {
    expect(isEmptyObject('string')).toBe(false);
    expect(isEmptyObject(123)).toBe(false);
    expect(isEmptyObject(true)).toBe(false);
  });
});
