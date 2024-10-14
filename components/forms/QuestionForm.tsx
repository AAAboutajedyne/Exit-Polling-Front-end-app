"use client";
import React, { useCallback, useState } from 'react'
import { useFormState } from 'react-dom';
import { ApiErrors } from '@/libs/apis'
import FormErrors from '@/components/common/FormErrors';

export type QuestionFormState = {
  description: string;
}

type ActionState = {
  errors?: ApiErrors.CausedErrors;
}

export default function QuestionForm(
  {action, initialState, cancelLink}: {action: any, initialState: QuestionFormState, cancelLink: React.ReactNode}
) {
  const [actionState, formAction] = useFormState<ActionState>(action, {})
  const [formState, setFormState] = useState(initialState)

  return (
    <form action={formAction}>
      <FormErrors errors={actionState?.errors ?? {}} className="w-[50%]"/>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <input id="description" name="description" type="text"
          value={formState.description} onChange={e => {
            setFormState(formState => ({...formState, description: e.target.value}))
          }}
        />
      </div>

      <div className='actions'>
        <button type="submit" className="btn">Save</button>
        {cancelLink}
      </div>
    </form>
  )
}
