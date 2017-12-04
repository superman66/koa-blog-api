
/**
 * 错误处理
 * @param {*} ctx
 * @param {*} next
 */
export default async function errorHandle(ctx, next) {
  try {
    // if (ctx.response.status === 404) {
    //   ctx.throw(404)
    // }
    await next()
  } catch (err) {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = {
        error: err.originalError ? err.originalError.message : err.message,
      };
    } else {
      throw err;
    }
  }
}
