import React, { Suspense } from 'react'
import { getDistrictById } from '@/libs/apis/district.api'
import PollResults from '@/components/core/poll-results'
import { getQuestionsWithChoicesByDistrictId } from '@/libs/apis/question.api'
import LoadingBanner from '@/components/common/LoadingBanner'
import Link from 'next/link'
import { delay } from '@/utils/promise.utils'
import { BackButton } from '@/components/common/buttons/BackButton'
import { DistrictInfo } from '@/models/district.model'

type Params = {
  params: {
    districtId: string
  }
}

export default async function DistrictPollResultPage({params}: Params) {
  const district = await getDistrictById(params.districtId)

  return (
    <Suspense fallback={<LoadingBanner text="Loading Questions & Choices ..."/>}>
      <DistrictPollResult districtInfo={{id: +params.districtId, name: district?.name || ""}}/>
    </Suspense>
  )
}

async function DistrictPollResult({districtInfo}: {districtInfo: DistrictInfo}) {
  const questions = await getQuestionsWithChoicesByDistrictId(districtInfo.id.toString())
  // await delay(5000)
  console.log("questions: ")
  console.dir(questions, {depth: null})

  return (<>
    <PollResults district={{...districtInfo, questions}} />

    <div className="mt-10 mb-5 actions underline">
      <BackButton backUrl="/results" />
      {/* <Link href="/results/1">go to district 1 results</Link>
      <Link href="/results/5">go to district 5 results</Link>
      <Link href="/results/x">go to district x results</Link> */}
    </div>
  </>)
}

