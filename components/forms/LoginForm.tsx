"use client";
import React, { useState } from 'react'
import { ApiErrors } from '@/libs/apis';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/libs/server-actions/auth.server-action';
import FormErrors from '../common/FormErrors';
import { useFormState } from 'react-dom';

type ActionState = {
  errors?: ApiErrors.CausedErrors
}

const initialState = {
  email: "",
  password: ""
}

export default function LoginForm() {
  const [actionState, formAction] = useFormState<ActionState, FormData>(loginAction, {})
  const [formState, setFormState] = useState(initialState)
  const router = useRouter()

  return (
    <form action={formAction}>
      <FormErrors errors={actionState?.errors ?? {}} className="mb-5"/>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="text"
          className="!w-full"
          value={formState.email}
          onChange={e =>
            setFormState(formState => ({
              ...formState,
              email: e.target.value
            }))}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password"
          className="!w-full"
          value={formState.password}
          onChange={e =>
            setFormState(formState => ({
              ...formState,
              password: e.target.value
            }))}
        />
      </div>
      <div className='actions mt-3'>
        <button type="submit" className="btn">Log in</button>
      </div>
    </form>
  )
}
