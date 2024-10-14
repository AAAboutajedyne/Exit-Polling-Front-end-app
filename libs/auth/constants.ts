
export const jwtCookieName = () => process.env["JWT_COOKIE_NAME"] ?? "DEFAULT_JWT_COOKIE_NAME"
export const jwtSecret = () => process.env["JWT_SECRET"] ?? "A_SECRET"