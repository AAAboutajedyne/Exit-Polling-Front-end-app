import React from 'react'
import Link from 'next/link';
import QuestionForm, { QuestionFormState } from '@/components/forms/QuestionForm';
import { createQuestionAction } from '@/libs/server-actions/question.server-actions';
import { getDistrictById } from '@/libs/apis/district.api';

const getData = getDistrictById

type Params = {
  params: {
    districtId: string
  },
  // searchParams: {
  //   district_name: string
  // }
}

export default async function QuestionNewPage({params}: Params) {
  const district = await getData(params.districtId)
  const initialFormState: QuestionFormState  = {description: ""}
  const createQuestionActionWithDistrictId = createQuestionAction.bind(null, params.districtId)
  return (
    <div>
      <h1>New Question for {district?.name}</h1>

      <QuestionForm
        action={createQuestionActionWithDistrictId}
        initialState={initialFormState}
        cancelLink={
          <Link href={`/districts/${params.districtId}/questions`} className="btn-white">
            Cancel
          </Link>
        }
      />
    </div>
  )
}
