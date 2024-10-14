import React, { ReactNode } from 'react'
import { CurrentUserProvider } from '@libs/contexts/current-user.context'
import { validateJwtFromCookie } from '@/libs/auth'
import { cookies } from 'next/headers'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

async function getUserIdFromJwtCookie(cookies: ReadonlyRequestCookies): Promise<string | undefined> {
  let userId;
  try {
    const userPayload = await validateJwtFromCookie(cookies)
    userId = userPayload.userId;
  } catch {
    userId = undefined
  }

  return userId;
}

export default async function AuthProvider({children}: {children: ReactNode}) {
  const userId = await getUserIdFromJwtCookie(cookies())

  return (
    <CurrentUserProvider userId={userId}>
      {children}
    </CurrentUserProvider>
  )
}
