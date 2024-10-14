import React from 'react'
import { Icon as ReactFeatherIcon } from 'react-feather'
import Icon from '../Icon'

export default function IconButton(
  {IconRef, label, className = "btn", ...restProps}: 
  {IconRef: ReactFeatherIcon, label: string, className?: string, [prop:string]: any}
) {
  return (
    <div className={className} {...restProps}>
      <span className="flex justify-center items-center gap-2">
        <Icon IconRef={IconRef}/> {label}
      </span>
    </div>
  )
}
