/**
 * jwt 错误处理
 * @param {*} ctx
 * @param {*} next
 */
export function authentication(ctx, next) {
  return next().catch((err) => {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = {
        error: err.originalError ? err.originalError.message : err.message,
      };
    } else {
      throw err;
    }
  });
}

/**
 * 404 处理
 * @param {*} ctx
 */
export function pageNotFound(ctx) {
  if (ctx.status === 404) {
    ctx.throw(404)
  }
}
