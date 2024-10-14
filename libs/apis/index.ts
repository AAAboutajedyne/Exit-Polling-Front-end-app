import * as R from "ramda"
import { apiUrl } from "./constants"

export namespace http {
  export async function get(relatliveUrl: string, fetchOptions = {}, baseUrl = apiUrl()) {
    return await parseResponse(
      await fetch(baseUrl + relatliveUrl, {
        headers: {
          ...fetchOptions["headers"]
        },
        ...R.omit<any, any>(["method", "headers"], fetchOptions)
      })
    )
  }

  export async function post(relatliveUrl: string, body, otherFetchOptions = {}, baseUrl = apiUrl()) {
    return await parseResponse(
      await fetch(baseUrl + relatliveUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...otherFetchOptions["headers"]
        },
        body: JSON.stringify(body),
        ...R.omit<any, any>(["method", "headers", "body"], otherFetchOptions)
      })
    )
  }

  /*
  export async function postAndGetRawResponse(relatliveUrl: string, body, otherFetchOptions = {}, baseUrl = apiUrl()) {
    return await fetch(baseUrl + relatliveUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      ...otherFetchOptions,
    })
  }
  */

  export async function put(relativeUrl: string, body, otherFetchOptions = {}, baseUrl = apiUrl()) {
    return await parseResponse(
      await fetch(baseUrl + relativeUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...otherFetchOptions["headers"]
        },
        body: JSON.stringify(body),
        ...R.omit<any, any>(["method", "headers", "body"], otherFetchOptions)
      })
    )
  }

  export async function delete_(relatliveUrl: string, fetchOptions = {}, baseUrl = apiUrl()) {
    return await parseResponse(
      await fetch(baseUrl + relatliveUrl, {
        method: "DELETE",
        headers: {
          ...fetchOptions["headers"]
        }, 
        ...R.omit<any, any>(["method", "headers"], fetchOptions)
      })
    )
  }
}

async function parseResponse(response: Response) {
  console.group("[parseResponse] ");
  console.log("url: ", response.url)
  console.log("status: ", response.statusText)
  
  if (response.ok) {
    if(response.status !== 204) {
      const parsedData = await response.json()
      if(parsedData.data) {
        console.log("data ('data' key is removed from parsed data): ")
        console.dir(parsedData.data, { depth: null })
        console.groupEnd()
        return parsedData.data  
      } else {
        console.log("data: ")
        console.dir(parsedData, { depth: null })
        console.groupEnd()
        return parsedData
      }
    } else {
      console.groupEnd()
      return;
    } 
  }

  switch (response.status) {
    case 422: {
      const parsedData = await response.json()
      console.log("data: ", parsedData)
      console.groupEnd()
      throw new ApiErrors.UnprocessableContentError(parsedData.errors)
    }

    case 401: {
      const parsedData = await response.json()
      console.log("data: ", parsedData)
      console.groupEnd()
      if(R.allPass([R.isNotNil, R.isNotEmpty])(parsedData.message)) {
        throw new ApiErrors.UnauthorizedError(parsedData.errors, parsedData.message)
      } else {
        throw new ApiErrors.UnauthorizedError(parsedData.errors)
      }
    }

    case 403: {
      const parsedData = await response.json()
      console.log("data: ", parsedData)
      console.groupEnd()
      if(R.allPass([R.isNotNil, R.isNotEmpty])(parsedData.message)) {
        throw new ApiErrors.ForbiddenError(parsedData.message)
      } else {
        throw new ApiErrors.ForbiddenError()
      }
    }

    default:
      const responseMessage = await response.json()
      console.log("API Error: ")
      console.dir(responseMessage, {depth: null})
      console.groupEnd()
      throw new Error("API Error: " + JSON.stringify(responseMessage)); 
  }
  
}

/*======= Api Errors ==========*/
export namespace ApiErrors {

  export class UnprocessableContentError extends Error {
    constructor(
      public contentErrors: CausedErrors, 
      public message = "UnprocessableContent - The request was well-formed but was unable to be followed due to semantic errors."
    ) {
      super(message)
    }
  }

  export class UnauthorizedError extends Error {
    constructor(
      public authErrors?: CausedErrors,
      public message = "Unauthenticated/Unauthorized"
    ) {
      super(message)
    }
  }

  export class ForbiddenError extends Error {
    constructor(
      public message = "Forbidden"
    ) {
      super(message)
    }
  }

  export type CausedErrors = {
    [fieldName: string]: string[]
  }

}



/*
export async function jsonFetcher({ url, method = "GET", body = false, parsingResult = true}) {
  const res = await fetch(url, {
    method,
    ...(body && {body: JSON.stringify(body)}),
    headers: {
      Accept: "application/json",
      ...(body && {"Content-Type": "application/json"}),
    }
  })

  if (!res.ok) 
    throw new Error("API Error");

  if (parsingResult) {
    const parsedData = await res.json()
    return parsedData.data
  }
}
*/