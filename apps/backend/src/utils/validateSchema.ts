import type { ObjectSchema } from 'joi';

/** @throws can throw an error */
function validateSchema({ schema, payload }: { schema: ObjectSchema; payload: any }) {
  const result = schema.validate(payload);

  if (result.error) throw new Error(result.error.message);

  return result.value;
}

export { validateSchema };
