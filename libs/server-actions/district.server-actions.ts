"use server";
import { ApiErrors, http } from '@/libs/apis';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { authBearerTokenHeader } from '../auth';
import { cookies } from 'next/headers';

export async function createDistrictAction(_previousState, formData: FormData) {  
  try {
    await http.post("/districts", {
      district: {
        name: formData.get("name")
      }
    }, {
      headers: {
        ...authBearerTokenHeader(cookies())
      }
    })
    
  } catch(error) {
    if(error instanceof ApiErrors.UnprocessableContentError) {
      return { errors: error.contentErrors }
    }
  }


  revalidateDistricts()
  /**
   * [REMINDER][CAVEATS/MISES_EN_GARDE] in Server Actions and Route Handlers, 
   * "redirect" should be called after the "try/catch" block.
   */
  redirect("/districts")
}

export async function updateDistrictAction(id: string, _previousState, formData: FormData) {
  try {
    await http.put(`/districts/${id}`, {
      district: {
        name: formData.get("name")
      }
    }, {
      headers: {
        ...authBearerTokenHeader(cookies())
      }
    })
    
  } catch(error) {
    if(error instanceof ApiErrors.UnprocessableContentError) {
      return { errors: error.contentErrors }
    }
  }

  revalidateDistricts()
  redirect("/districts")
}

export async function deleteDistrictAction(id: string, _formData: FormData) {
  try {
    await http.delete_(`/districts/${id}`, {
      headers: {
        ...authBearerTokenHeader(cookies())
      }
    })
  } catch(error) {
    if(error instanceof ApiErrors.UnprocessableContentError) {
      console.error("Something went wrong! ", error.contentErrors)
    }
  }

  revalidateDistricts()
}

export async function revalidateDistricts() {
  // console.log("refreshDistricts called");
  revalidatePath('/districts')
  // redirect("/districts")
}