import React from 'react'
import { Loader } from 'react-feather'
import Icon from './Icon'

export default function LoadingIcon() {
  return (
    <Icon IconRef={Loader} size={30} className="animate-spin" />
  )
}
