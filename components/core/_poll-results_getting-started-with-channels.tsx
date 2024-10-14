"use client";
import React, { useEffect, useState } from 'react'
import { Socket } from "phoenix"
import { mainSocketUrl } from '@/libs/apis/constants';
import { Question } from '@/models/question.model';

export default function _PollResults(
  {districtId, questions}: {districtId: string, questions: Question[]}
) {

  const messages = useDistrictChannelMessages(districtId)
  
  return (<>
    {
      messages.map(message => (
        <p className="font-mono">{message}</p>
      ))
    }
  </>)
}


function useDistrictChannelMessages(districtId: string) {
  const [messages, setMessages] = useState<string[]>([])
  
  useEffect(() => {
    const socket = new Socket(mainSocketUrl() /* "ws://localhost:4000/socket" */)
    socket.connect()

    console.log("connecting to: " + `district:${districtId}`)
    const channel = socket.channel(`district:${districtId}`)
    channel
      .join()             //<== returns Push object
      .receive("ok", joinData => {
        console.log("join data ", joinData)
      })
      .receive("error", errorData => {
        console.log("join failed with reason: ", errorData.reason)
      })
    
    channel.on("msg", ({msg}) => {
      console.log("message received: ", msg)
      setMessages(messages => [msg].concat(messages))
    })

    return () => {
      channel.leave();
      socket.disconnect();
    }
  }, [districtId])

  return messages
}