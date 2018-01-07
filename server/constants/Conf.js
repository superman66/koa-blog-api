// 无需登录权限的api路由
export const PUBLIC_PATH = [
  /\/register/,
  /\/login/,
  // 不包含 admin
  /^(?!.*admin)/,
]
