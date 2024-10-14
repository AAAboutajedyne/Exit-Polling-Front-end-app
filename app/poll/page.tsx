import React from 'react'
import DistrictsList from '@/components/core/districts-list'

export default function PollPage() {
  return (<>
    <h1>Poll Districts</h1>
    <DistrictsList hrefPrefix="/poll" />
  </>)
}
