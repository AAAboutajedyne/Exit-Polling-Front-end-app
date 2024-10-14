import QuestionForm, { QuestionFormState } from '@/components/forms/QuestionForm'
import { updateQuestionAction } from '@/libs/server-actions/question.server-actions'
import { District } from '@/models/district.model'
import { http } from '@/libs/apis'
import Link from 'next/link'
import React from 'react'
import { getDistrictById } from '@/libs/apis/district.api'
import { getQuestionById } from '@/libs/apis/question.api'

async function getData({districtId, questionId}: {districtId: string, questionId: string}) {
  return await Promise.all([
    getDistrictById(districtId),
    getQuestionById(districtId, questionId)
  ])
}

type Params = {
  params: {
    districtId: string,
    questionId: string
  },
}

export default async function QuestionEditPage({params}: Params) {
  const [district, question] = await getData(params)
  if(district && question) {
    const initialFormState: QuestionFormState  = {description: question.description}
    const updateQuestionActionWithIds = updateQuestionAction.bind(null, params.districtId, params.questionId)
    return (
      <div>
        <h1>Edit Question for {district.name}</h1>
        
        <QuestionForm 
          action={updateQuestionActionWithIds} 
          initialState={initialFormState} 
          cancelLink={
            <Link href={`/districts/${params.districtId}/questions`} className="btn-white">Cancel</Link>
          }
        />
      </div>
    )
  } else {
    return <div>No requested question found on district !</div>
  }
}
