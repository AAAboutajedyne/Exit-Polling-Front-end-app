"use client";
import { ApiErrors } from '@/libs/apis'
import React, { useState } from 'react'
import { useFormState } from 'react-dom';
import FormErrors from '../common/FormErrors';
import { Party } from '@/models/choice.model';

export type ChoiceFormState = {
  description: string;
  party: Party;
}

type ActionState = {
  errors?: ApiErrors.CausedErrors
}

export default function ChoiceForm(
  {action, initialState, cancelLink}: {action: any, initialState: ChoiceFormState, cancelLink: React.ReactNode}
) {
  const [actionState, formAction] = useFormState<ActionState>(action, {})
  const [formState, setFormState] = useState(initialState)
  
  console.log("formState: ", formState);

  return (
    <form action={formAction}>
      <FormErrors errors={actionState?.errors ?? {}} className="w-[50%]"/>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <input id="description" name="description" type="text"
          value={formState.description} 
          onChange={e => 
            setFormState(formState => ({ 
              ...formState,
              description: e.target.value
            }))}
        />
      </div>

      <div className="form-group">
        <label htmlFor="party">Party</label>
        <select id="party" name="party"
          value={formState.party} 
          onChange={e => 
            setFormState(formState => ({ 
              ...formState,
              party: e.target.value as Party
            }))}
        >
          {Object.keys(Party).map(k => (
            <option key={k} value={Party[k]}>{k}</option>
          ))}
        </select>
      </div>

      <div className='actions mt-3'>
        <button type="submit" className="btn">Save</button>
        {cancelLink}
      </div>
    </form>
  )
}
