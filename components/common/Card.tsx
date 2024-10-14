import React from 'react'
import clsx from 'clsx'

export default function Card(
  { children, className }: { children: React.ReactNode, className?: string }
) {
  return (
    <div className={clsx('border-2 border-black/25 rounded-2xl px-10 py-4 bg-[#FBC489]/5 shadow-md', className)}>
      {children}
    </div>
  )
}
