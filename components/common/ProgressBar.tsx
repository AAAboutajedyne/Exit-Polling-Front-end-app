import React from 'react'
import clsx from 'clsx'

export default function ProgressBar(
  {percent, bgColorClassName}: {percent: number, bgColorClassName: string}
) {
  return (
    <div 
      className={clsx(
        "w-full rounded-lg text-white p-2",
        bgColorClassName
      )}
      style={{ width: `${percent < 10 ? 10 : percent}%` }}
    >
      <div className="w-[100px] text-xs">{percent}%</div>
    </div>
  )
}
