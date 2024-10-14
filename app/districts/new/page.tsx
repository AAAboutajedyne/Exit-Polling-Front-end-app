import React from 'react'
import { createDistrictAction } from '@/libs/server-actions/district.server-actions';
import DistrictForm, { DistrictFormState } from '@/components/forms/DistrictForm';


export default function DistrictNewPage() {
  const initialFormState: DistrictFormState  = {name: ""}
  return (
    <div>
      <h1>New District</h1>
      
      <DistrictForm 
        action={createDistrictAction} 
        initialState={initialFormState} />
    </div>
  )
}
