import React from 'react'
import { Icon as ReactFeatherIcon } from 'react-feather'

export default function Icon(
  {IconRef, size = 20, ...restProps}: {IconRef: ReactFeatherIcon, size?: number, [prop:string]: any}
) {
  return (
    <IconRef size={size} {...restProps} />
  )
}
