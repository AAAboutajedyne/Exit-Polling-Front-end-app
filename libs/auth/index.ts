import { JWTPayload, jwtVerify } from "jose"
import { jwtCookieName, jwtSecret } from "./constants"
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"

export interface UserJWTPayload extends JWTPayload {
  userId: string
}

export async function validateJWT(jwt: string): Promise<UserJWTPayload> {
  // jwtVerify: throws JWSSignatureVerificationFailed when token not valid
  const { payload } = await jwtVerify(jwt, new TextEncoder().encode(jwtSecret()))
  return { 
    ...payload, 
    ...{ userId: payload.sub }
  } as UserJWTPayload
}

export async function validateJwtFromCookie(cookies: ReadonlyRequestCookies): Promise<UserJWTPayload> {
  if(!cookies.has(jwtCookieName())) {
    throw new Error("JWT Cookie not found!")
  }

  const token = cookies.get(jwtCookieName())!.value
  return await validateJWT(token)
}

export function putJwtInResponseCookies(cookies: ReadonlyRequestCookies, token) {
  cookies.set(jwtCookieName(), token, {
    httpOnly: true,
    maxAge: 10 * 60,
  })
}

export function clearJwtCookie(cookies: ReadonlyRequestCookies) {
  cookies.delete(jwtCookieName())
}

export function authBearerTokenHeader(cookies: ReadonlyRequestCookies): Record<"Authorization", `Bearer ${string}`> {
  if(!cookies.has(jwtCookieName())) {
    throw new Error("JWT Cookie not found!")
  }

  const token = cookies.get(jwtCookieName())!.value
  return {"Authorization": `Bearer ${token}`}
}

