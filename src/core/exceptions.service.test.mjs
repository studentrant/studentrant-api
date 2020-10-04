import * as exceptions from './exceptions.service.js';

function handler(errorType, message) {
  throw errorType(message);
}

describe('Exception [Unit]', () => {
  it('should throw ExistsException', () => {
    expect(() => {
      handler(exceptions.ExistsException, 'found');
    }).toThrowError('found');
  });
  it('should throw UnAuthorizedAccessException', () => {
    expect(() => {
      handler(exceptions.UnAuthorizedAccessException, 'unauthorized');
    }).toThrowError('unauthorized');
  });
  it('should throw BadValueException', () => {
    expect(() => {
      handler(exceptions.BadValueException, 'badvalue');
    }).toThrowError('badvalue');
  });
});
