import React from 'react'
import { getDistrictById } from '@/libs/apis/district.api'
import { getQuestionById } from '@/libs/apis/question.api'
import { getChoiceById } from '@/libs/apis/choice.api'
import ChoiceForm, { ChoiceFormState } from '@/components/forms/ChoiceForm'
import Link from 'next/link'
import { updateChoiceAction } from '@/libs/server-actions/choice.server-action'

async function getData(
  {districtId, questionId, choiceId}: {districtId: string, questionId: string, choiceId: string}
) {
  return await Promise.all([
    getDistrictById(districtId),
    getQuestionById(districtId, questionId),
    getChoiceById(questionId, choiceId)
  ])
}

type Params = {
  params: {
    districtId: string
    questionId: string
    choiceId: string
  }
}

export default async function ChoiceEditPage({params}: Params) {
  const [district, question, choice] = await getData(params)
  if(district && question && choice) {
    const initialFormState: ChoiceFormState  = {description: choice.description, party: choice.party}
    const updateChoiceActionWithIds = updateChoiceAction.bind(null, {
      districtId: params.districtId,
      questionId: params.questionId,
      choiceId: params.choiceId
    })
    return (
      <div>
        <h1>Edit Choice</h1>

        <div className='space-y-4 mx-2 my-4'>
          <p>District: {district?.name}</p>
          <p>Question: {question?.description}</p>
        </div>
        <ChoiceForm
          action={updateChoiceActionWithIds} 
          initialState={initialFormState} 
          cancelLink={
            <Link href={`/districts/${params.districtId}/questions/${params.questionId}/choices`} className="btn-white">
              Cancel
            </Link>
          }
        />
      </div>
    )
  } else {
    return <div>No requested choice found for question !</div>
  }
  
}
