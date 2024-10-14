import { NextRequest, NextResponse } from "next/server";
import { jwtCookieName } from "@libs/auth/constants";
import { validateJWT } from './libs/auth';

export const config = {
  matcher: [
    "/districts/:path*"
  ]
}

export default async function middleware(request: NextRequest) {
  console.log("middleware executed: ", request.nextUrl.pathname)

  return await protectRoutesStartingWith("/districts", request)
}

async function protectRoutesStartingWith(partialRouteUrl: string, request: NextRequest) {
  const redirectToLoginResponse = NextResponse.redirect(new URL("/login", request.url))
  if(request.nextUrl.pathname.startsWith(partialRouteUrl)) {
    if(!request.cookies.has(jwtCookieName())) {
      console.log(`middleware redirection for "${partialRouteUrl}": access token cookie not found`)
      return redirectToLoginResponse;
    }

    try {
      const token = request.cookies.get(jwtCookieName())?.value ?? ""
      await validateJWT(token)
    } catch(error) {
      console.log(error) 
      console.log(`middleware redirection for "${partialRouteUrl}": access token cookie not valid`)
      return redirectToLoginResponse;
    }
  }
}
