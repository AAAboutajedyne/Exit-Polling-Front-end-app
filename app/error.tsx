"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

export default function MainErrorHandler(
  { error, reset }: { error: Error, reset: () => void }
) {
  const router = useRouter()

  useEffect(() => {
    console.error("Error: ", error)
    router.replace(`/?error=${error.message}`)
  }, [error])

  return (null)
}
