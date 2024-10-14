"use client";
import React, { startTransition } from 'react'
import IconButton from './IconButton';
import { RefreshCw } from 'react-feather';

export default function RefreshButton({action}) {
  return (
    <IconButton IconRef={RefreshCw} 
      label="Refresh" 
      className="btn-white"
      onClick={() => startTransition(action)} 
    />
  )
}
