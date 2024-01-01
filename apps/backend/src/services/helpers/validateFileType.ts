/** @throws Can throw an error. */
function validateFileType({ fileType, validFileTypes }: { fileType: string; validFileTypes: Array<string> }) {
  if (!validFileTypes.includes(fileType)) {
    throw new Error(
      `ValidationError::an invalid file type given. You provided ${fileType}, and allowed types are: [${validFileTypes.join(
        ',',
      )}]`,
    );
  }
}

export { validateFileType };
