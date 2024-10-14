import ChoiceForm from '@/components/forms/ChoiceForm'
import { getDistrictById } from '@/libs/apis/district.api'
import { getQuestionById } from '@/libs/apis/question.api'
import { createChoiceAction } from '@/libs/server-actions/choice.server-action'
import { Party } from '@/models/choice.model'
import Link from 'next/link'
import React from 'react'

async function getData({districtId, questionId} : {districtId: string, questionId: string}) {
  return Promise.all([
    getDistrictById(districtId),
    getQuestionById(districtId, questionId)
  ])
} 

type Params = {
  params: {
    districtId: string
    questionId: string
  }
}

export default async function ChoiceNewPage({params}: Params) {
  const [district, question] = await getData(params)
  const createChoiceActionWithIds = createChoiceAction.bind(null, {
    districtId: params.districtId,
    questionId: params.questionId
  })
  return (
    <div>
      <h1>New Choice</h1>

      <div className='space-y-4 mx-2 my-4'>
        <p>District: {district?.name}</p>
        <p>Question: {question?.description}</p>
      </div>
      <ChoiceForm
        action={createChoiceActionWithIds}
        initialState={{ description: '', party: Party.Democrate }}
        cancelLink={
          <Link href={`/districts/${params.districtId}/questions/${params.questionId}/choices`} className="btn-white">
            Cancel
          </Link>
        }
      />
    </div>
  )
}
