import React from 'react'
import Icon from './Icon'
import { Check, RefreshCw } from 'react-feather'
import { ChannelConnectionState } from '@/utils/channel.utils'

export default function ChannelConnectionStatus({state}: {state: ChannelConnectionState}) {
  return (
    <div className="ml-2 text-xs">
      {
        state === ChannelConnectionState.Syncing ? (
          <div className="w-fit p-1 pr-3 border rounded-full bg-slate-200 flex gap-2 items-center animate-pulse">
            <Icon IconRef={RefreshCw} className="animate-spin" />
            <span>Syncing...</span>
          </div>
        ):
        (
          <div className="w-fit p-1 pr-3 border rounded-full bg-green-700 text-white flex items-center gap-1 ">
            <Icon IconRef={Check} className="animate-pulse"/>
            <span className="">Connection Established</span>
          </div>
        )
      }
    </div>
  )
}

