"use server";
import { ApiErrors, http } from "../apis";
import { serverDomainUrl } from "../apis/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { clearJwtCookie, putJwtInResponseCookies } from "../auth";

export async function loginAction(_previousState, formData: FormData) {
  try {
    const response = await http.post(`/auth/login`, {
      email: formData.get("email"),
      password: formData.get("password")
    },
    {},
    `${serverDomainUrl() + "/"}`)

    // const payload = await validateJWT(response.token)
    // console.log("payload: ", payload);
    
    putJwtInResponseCookies(cookies(), response.token);

  } catch(error) {
    console.log("Error: ", error)
    if(error instanceof ApiErrors.UnauthorizedError) {
      return { errors: error.authErrors }
    } else {
      throw error
    }
  }
  
  redirect("/")
}


export async function logoutAction() {
  clearJwtCookie(cookies())
  redirect("/")
}

