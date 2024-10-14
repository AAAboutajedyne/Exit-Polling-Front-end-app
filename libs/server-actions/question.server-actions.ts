"use server";
import { ApiErrors, http } from '@/libs/apis';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { QUESTIONS_TAG } from '../apis/question.api';
import { authBearerTokenHeader } from '../auth';
import { cookies } from 'next/headers';

export async function createQuestionAction(districtId: string, _previousState, formData: FormData) {  
  try {
    await http.post(`/districts/${districtId}/questions`, {
      question: {
        description: formData.get("description")
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

  revalidateQuestions()
  redirect(`/districts/${districtId}/questions`)
}

export async function updateQuestionAction(districtId: string, questionId: string, _previousState, formData: FormData) {  
  try {
    await http.put(`/questions/${questionId}`, {
      question: {
        description: formData.get("description")
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

  revalidateQuestions()
  redirect(`/districts/${districtId}/questions`)
}

export async function deleteQuestionAction(questionId: string, _formData: FormData) {

  try {
    await http.delete_(`/questions/${questionId}`, {
      headers: {
        ...authBearerTokenHeader(cookies())
      }
    })
  } catch(error) {
    if(error instanceof ApiErrors.UnprocessableContentError) {
      console.error("Something went wrong! ", error.contentErrors)
    }
  }

  revalidateQuestions()
}

export async function revalidateQuestions() {
  revalidateTag(QUESTIONS_TAG)
}