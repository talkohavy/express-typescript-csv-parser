import assert from 'assert/strict';
import { describe, it } from 'node:test';
import { validateFileType } from '../dist/services/helpers/validateFileType.js';

describe('validateFileType', () => {
  it('should throw when fileType not found in array', () => {
    const fn = () => validateFileType({ fileType: 'csv', validFileTypes: ['pdf', 'docx'] });

    const expectedErrorMessage =
      'ValidationError::an invalid file type given. You provided csv, and allowed types are: [pdf,docx]';

    assert.throws(fn, { name: 'Error', message: expectedErrorMessage });
  });

  it('should NOT throw when fileType is found in array', () => {
    const fn = () => validateFileType({ fileType: 'pdf', validFileTypes: ['pdf', 'docx'] });

    assert.doesNotThrow(fn);
  });
});
