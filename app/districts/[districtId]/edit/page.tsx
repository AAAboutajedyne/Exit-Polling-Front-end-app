import React from 'react'
import { getDistrictById } from '@/libs/apis/district.api'
import { updateDistrictAction } from '@/libs/server-actions/district.server-actions'
import DistrictForm, { DistrictFormState } from '@/components/forms/DistrictForm'

const getData = getDistrictById
// async function getData(id: string) {
//   const districts = await http.get(
//     "/districts",
//   ) as District[]

//   return districts
//     .filter(district => district.id.toString() === id)
//     .at(0) as District | undefined
// }

export default async function DistrictEditPage(
  {params}: {params: {districtId: string}}
) {
  const district = await getData(params.districtId) 
  if(district) {
    const initialFormState: DistrictFormState  = {name: district.name}
    const updateDistrictActionWithId = updateDistrictAction.bind(null, params.districtId)
    return (
      <div>
        <h1>Edit District</h1>
        
        <DistrictForm 
          action={updateDistrictActionWithId} 
          initialState={initialFormState} />
      </div>
    )
  } else {
    return <div>Requested district is not found !</div>
  }
}
