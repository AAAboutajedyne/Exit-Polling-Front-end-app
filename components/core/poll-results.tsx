"use client";
import React, { useEffect, useReducer, useState } from 'react'
import { Socket } from "phoenix"
import { mainSocketUrl, districtVotesUpdateEventName } from '@/libs/apis/constants';
import { Question } from '@/models/question.model';
import { Choice, sortingChoicesByVotesAndThenParty } from '@/models/choice.model';
import { ChoicePartyUtils } from '@/utils/choice-party.utils';
import { PollResultsActionType, PollResultsChannelJoinData, PollResultsState, pollResultsReducer } from '@/models/poll-results.model';
import { District } from '@/models/district.model';
import { isPollResultsChannelJoinDataHasPayload } from '@/models/poll-results.model';
import ChannelConnectionStatus from '../common/ChannelConnectionStatus';
import { ChannelConnectionState } from '@/utils/channel.utils';
import ProgressBar from '../common/ProgressBar';
import * as R from "ramda"

function pollResultsReducerInitializer(questions: Question[]) {
  return {
    questions: R.compose(
      R.map(
        R.over(
          // @ts-ignore
          R.lensProp("choices"), 
          sortingChoicesByVotesAndThenParty
        )
      ), 
      R.filter((question: Question) => R.isNotEmpty(question.choices))
    )(questions),

    channelConnectionState: ChannelConnectionState.Syncing,

  } as PollResultsState
}

function usePollResultsChannel(districtId: number, initialQuestions: Question[]) {
  const [state, dispatch] = useReducer(
    pollResultsReducer, initialQuestions, pollResultsReducerInitializer
  )
  
  useEffect(() => {
    const socket = new Socket(mainSocketUrl() /* "ws://localhost:4000/socket" */)
    socket.connect()
    socket.onClose(event => {
      console.log("socket connection closed !", event)
      dispatch({ type: PollResultsActionType.SyncingChannelConnection })
    })

    console.log("connecting to: " + `district:${districtId}`)
    const channel = socket.channel(`district:${districtId}`)
    channel
      .join()
      .receive("ok", (joinData: PollResultsChannelJoinData) => {
        console.log("join data ", joinData)
        dispatch({ type: PollResultsActionType.ChannelConnectionEstablished })
        if(isPollResultsChannelJoinDataHasPayload(joinData)) {
          dispatch({
            type: PollResultsActionType.LatestVotesDataReceived,
            payload: joinData.latestVotes
          })
        }
      })
      .receive("error", errorData => {
        console.log("join failed with reason: ", errorData.reason)
        dispatch({ type: PollResultsActionType.SyncingChannelConnection })
      })
    
    channel.on(districtVotesUpdateEventName(), ({choice_id, votes}) => {
      console.log("district_votes_update event received with: ", choice_id, votes)
      dispatch({
        type: PollResultsActionType.ChoiceVotePerformed,
        payload: { choiceId: choice_id, votes }
      })
    })

    return () => {
      channel.leave();
      socket.disconnect();
    }
  }, [districtId])

  return [state, dispatch] as const;
}

export default function PollResults({district}: {district: District}) {
  const [state,] = usePollResultsChannel(district.id, district.questions || []);

  console.log("questionsFilteredAndSortedByChoicesVotes: ", state.questions)

  return (<>
    <div className="flex items-baseline gap-2 mb-8">
      <h1>Poll results for {district.name}</h1>
      <ChannelConnectionStatus state={state.channelConnectionState} />
    </div>

    <div className="flex flex-wrap gap-5">
      {
        state.questions.map(question => (
          <PollQuestionResults key={question.id} question={question} />
        ))
      }
    </div>
    
    {/* -- TODO: to delete ... ------------------------------- */}
    {/** 
    <button className="btn-white" 
      onClick={() => dispatch({
        type: PollResultsActionType.LatestVotesDataReceived, 
        payload: {
          5: 3,       //<== choiceId: votes
          2: 3
        }
      })}
    >
      dispatch "LatestVotesDataReceivedAction"
    </button>

    <button className="btn-white" 
      onClick={() => dispatch({
        type: PollResultsActionType.ChoiceVotePerformed, 
        payload: {
          choiceId: 5,
          votes: 2
        }
      })}
    >
      dispatch "ChoiceVotePerformedAction" on question 1
    </button>

    <button className="btn-white" 
      onClick={() => dispatch({
        type: PollResultsActionType.ChoiceVotePerformed, 
        payload: {
          choiceId: 15,
          votes: 2
        }
      })}
    >
      dispatch "ChoiceVotePerformedAction" on question 23
    </button>
    */}
  </>)
}

function PollQuestionResults({question}: {question: Question}) {
  const totalVotes = R.compose(
    // @ts-ignore
    R.sum(), R.map(R.prop("votes"))
  )(question.choices) as number
  // console.log(`total of votes for question(${question.id}): `, totalVotes);

  const choicesWithPercents = question.choices?.map(choice => ({
    ...choice, percent: R.defaultTo(0, Math.floor(choice.votes * 100 / totalVotes))
  }))
  
  return(
    <div className="w-[500px] h-fit min-h-[200px] p-5 border rounded-sm shadow-lg">
      {/* Headers */}
      <div>
        <div className="text-lg">{question.description}</div>
        <div className="text-right">Votes</div>
      </div>

      {/* Choices */}
      <div className="divide-y">
        {
          choicesWithPercents?.map(choice => (
            <PollChoiceResults key={choice.id} choice={choice}/>
          ))
        }
      </div>

    </div>
  )
}

function PollChoiceResults({choice}: {choice: Choice & {percent: number}}) {
  return (
    <div className="py-4 text-base">
      <div className="flex justify-between items-center">
        <div className="w-[90%] space-y-1">
          <div className="space-x-1">
            <span>{choice.description} - ({choice.id})</span>
            <span className="text-xs">({ChoicePartyUtils.partyName(choice.party)})</span>
          </div>
          <ProgressBar percent={choice.percent} 
            bgColorClassName={ChoicePartyUtils.partyBackgroundColorClassName(choice.party)} />
        </div>
        <div className="w-[10%]">
          <div className="text-right">{choice.votes}</div>
        </div>
      </div>
    </div>
  )
}
