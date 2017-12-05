import objectToFormFieldArray from '../utils/objectToArray';

export default function formErrorMiddleware(ctx, error) {
  if (error.errors) {
    ctx.status = 400
    ctx.body = {
      errors: objectToFormFieldArray(error.errors),
    }
    return;
  }
  ctx.throw(500)
}
