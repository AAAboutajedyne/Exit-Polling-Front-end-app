"use client";
import React, { useCallback, useState } from 'react'
import Link from 'next/link'
import { useFormState } from 'react-dom';
import { ApiErrors } from '@/libs/apis'
import FormErrors from '@/components/common/FormErrors';

export type DistrictFormState = {
  name: string,
}

type ActionState = {
  errors?: ApiErrors.CausedErrors;
}

export default function DistrictForm(
  {action, initialState}: {action: any, initialState: DistrictFormState}
) {
  const [actionState, formAction] = useFormState<ActionState>(action, {})
  const [formState, setFormState] = useState(initialState)

  return (
    <form action={formAction}>
      <FormErrors errors={actionState?.errors ?? {}} className="w-[50%]"/>

      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text"
          value={formState.name} 
          onChange={e => {
            setFormState(formState => ({...formState, name: e.target.value}))
          }}
        />
      </div>

      <div className='actions'>
        <button type="submit" className="btn">Save</button>
        <Link href="/districts" className="btn-white">Cancel</Link>
      </div>
    </form>
  )
}
