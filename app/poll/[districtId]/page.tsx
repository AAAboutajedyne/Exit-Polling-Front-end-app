import React, { Suspense } from 'react'
import { getDistrictById } from '@/libs/apis/district.api'
import { getQuestionsWithChoicesByDistrictId } from '@/libs/apis/question.api'
import LoadingIcon from '@/components/common/LoadingIcon'
import Poller from '@/components/core/poller'
import { delay } from '@/utils/promise.utils'

type Params = {
  params: {
    districtId: string
  }
}

export default async function DistrictPollPage({params}: Params) {
  const district = await getDistrictById(params.districtId)

  return (<>
    <h1>Poll for {district?.name}</h1>
    <Suspense fallback={<LoadingIcon />}>
      <DistrictPoll districtId={params.districtId} />
    </Suspense>
  </>)
}

async function DistrictPoll({districtId}: {districtId: string}) {
  const questions = await getQuestionsWithChoicesByDistrictId(districtId)
  console.log("questions: ")
  console.dir(questions, {depth: null})

  return (
    <Poller districtId={districtId} questions={questions} />
  )
}


