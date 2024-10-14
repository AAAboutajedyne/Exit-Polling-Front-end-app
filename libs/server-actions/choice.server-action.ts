"use server";
import { redirect } from "next/navigation";
import { ApiErrors, http } from "../apis";
import { revalidateTag } from "next/cache";
import { CHOICES_TAG } from "../apis/choice.api";
import { authBearerTokenHeader } from "../auth";
import { cookies } from "next/headers";

export async function createChoiceAction({districtId, questionId}, _previousState, formData: FormData) {  
  try {
    await http.post(`/questions/${questionId}/choices`, {
      choice: {
        description: formData.get("description"),
        party: formData.get("party")
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

  revalidateChoices()
  redirect(`/districts/${districtId}/questions/${questionId}/choices`)
}

export async function updateChoiceAction({districtId, questionId, choiceId}, _previousState, formData: FormData) {  
  try {
    await http.put(`/choices/${choiceId}`, {
      choice: {
        description: formData.get("description"),
        party: formData.get("party")
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

  revalidateChoices()
  redirect(`/districts/${districtId}/questions/${questionId}/choices`)
}

export async function deleteChoiceAction(choiceId: string, _formData: FormData) {

  try {
    await http.delete_(`/choices/${choiceId}`, {
      headers: {
        ...authBearerTokenHeader(cookies())
      }
    })
  } catch(error) {
    if(error instanceof ApiErrors.UnprocessableContentError) {
      console.error("Something went wrong! ", error.contentErrors)
    }
  }

  revalidateChoices()
}

export async function voteChoiceAction(districtId: string, choiceId: string) {
  await http.put(`/districts/${districtId}/choices/${choiceId}`, 
    {}, 
    {
      headers: {
        ...authBearerTokenHeader(cookies())
      }
    }
  )
  
}

export async function revalidateChoices() {
  revalidateTag(CHOICES_TAG)
}