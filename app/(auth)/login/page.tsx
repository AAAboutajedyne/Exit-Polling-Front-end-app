import React from 'react'
import clsx from 'clsx'
import Card from '@/components/common/Card'
import LoginForm from '@/components/forms/LoginForm'

export default function LoginPage() {
  return (
    <div className='flex justify-center'>
      <Card className={clsx("w-[60%] flex justify-center mt-20",
          "transition hover:shadow-xl")}>
        <div className="w-full mx-5 my-2">
          <h1 className="text-center text-3xl">Welcome back</h1>
          <LoginForm />
        </div>
      </Card>
    </div>
  )
}
