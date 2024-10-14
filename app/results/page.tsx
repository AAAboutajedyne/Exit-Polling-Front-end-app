import DistrictsList from '@/components/core/districts-list'
import React from 'react'

export default function PollResultPage() {
  return (<>
    <h1>Poll Results</h1>
    <DistrictsList hrefPrefix="/results" />
  </>)
}
