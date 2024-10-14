import { Question } from "./question.model"
import { Choice, sortingChoicesByVotesAndThenParty } from "./choice.model"
import { INDEX_OF_NOT_FOUND_ELEMENT } from "@/utils/list.utils"
import { ChannelConnectionState } from "@/utils/channel.utils"
import * as R from "ramda"

export type PollResultsChannelJoinPayload = {
  id: number,                                    //<== district id
  latestVotes: { [choiceId in number]: number }  //<== {choiceId: votes} - e.g. { 1: 2, 23: 4 }
}

export type PollResultsChannelJoinData = PollResultsChannelJoinPayload | {}

export function isPollResultsChannelJoinDataHasPayload(payload: PollResultsChannelJoinData): payload is PollResultsChannelJoinPayload {
  return R.both(R.has("id"), R.has("latestVotes"))(payload)
}


export type PollResultsState = {
  questions: Question[],
  channelConnectionState: ChannelConnectionState
}

export enum PollResultsActionType {
  LatestVotesDataReceived, ChoiceVotePerformed,
  SyncingChannelConnection, ChannelConnectionEstablished
}

export interface LatestVotesDataReceivedAction {
  type: PollResultsActionType.LatestVotesDataReceived
  payload: {
    //e.g. { 1: 2, 23: 4 }
    [choiceId in number]: number 
  }
}

export interface ChoiceVotePerformedAction {
  type: PollResultsActionType.ChoiceVotePerformed
  payload: {
    choiceId: number,
    votes: number
  }
}

export interface SyncingChannelConnectionAction {
  type: PollResultsActionType.SyncingChannelConnection
}

export interface ChannelConnectionEstablishedAction {
  type: PollResultsActionType.ChannelConnectionEstablished
}


export type PollResultsAction = LatestVotesDataReceivedAction | ChoiceVotePerformedAction |
  SyncingChannelConnectionAction | ChannelConnectionEstablishedAction


export function pollResultsReducer(state: PollResultsState, action: PollResultsAction): PollResultsState {
  switch(action.type) {
    case PollResultsActionType.LatestVotesDataReceived:
      return {
        ...state,
        questions: R.map(
          R.over(
            // @ts-ignore
            R.lensProp("choices"),
            // @ts-ignore
            R.compose(
              // @ts-ignore
              sortingChoicesByVotesAndThenParty,
  
              R.map((choice: Choice) => ({
                ...choice,
                votes: action.payload[choice.id] ?? choice.votes
              })),
            )
          )
        )(state.questions) as Question[]
      }

    case PollResultsActionType.ChoiceVotePerformed: 
      return {
        ...state,
        questions: R.map(
          R.over(
            // @ts-ignore
            R.lensProp("choices"),
            // @ts-ignore
            R.compose(
              R.ifElse(
                ([choiceIndex,]: [number, any]) => choiceIndex !== INDEX_OF_NOT_FOUND_ELEMENT,
                ([choiceIndex, choices]: [any, Choice[]]) => R.compose(
                  sortingChoicesByVotesAndThenParty,
                  R.set(R.lensPath([choiceIndex, "votes"]), action.payload.votes) 
                )(choices),
                ([, choices]: [any, readonly Choice[]]) => choices
              ),
              R.juxt([
                R.findIndex((choice: Choice) => choice.id === action.payload.choiceId),
                R.identity
              ])
            )
          )
        )(state.questions) as Question[]
      }

    case PollResultsActionType.SyncingChannelConnection:
      return {
        ...state,
        channelConnectionState: ChannelConnectionState.Syncing
      }

    case PollResultsActionType.ChannelConnectionEstablished:
      return {
        ...state,
        channelConnectionState: ChannelConnectionState.Established
      }
  }
}