"use client";
import React, { useCallback, useState, useTransition } from 'react'
import { Question } from '@/models/question.model'
import { Choice } from '@/models/choice.model';
import clsx from 'clsx';
import { ChoicePartyUtils } from '@/utils/choice-party.utils';
import { voteChoiceAction } from '@/libs/server-actions/choice.server-action';
import { BackButton } from '../common/buttons/BackButton';
import * as R from "ramda"

export default function Poller(
  {districtId, questions}: {districtId: string, questions: Question[]}
) {
  const [questionIndex, setQuestionIndex] = useState(-1)
  
  const nextQuestion = useCallback(() => {
    setQuestionIndex(index => index + 1)
  }, [setQuestionIndex])

  const resetPoll = useCallback(() => {
    setQuestionIndex(-1)
  }, [setQuestionIndex])

  if(questionIndex < 0) {
    return (
      <div className="actions">
        <button className="btn" onClick={nextQuestion}>
          Start
        </button>
        <BackButton backUrl="/poll" />
      </div>
    )
  } else if(questionIndex >= questions.length) {
    resetPoll()
    return;
  } else {
    /** 0 <= questionIndex < questions.length */
    return (<>
      <PollQuestion districtId={districtId} 
        question={questions[questionIndex]} 
        nextQuestionAction={nextQuestion} 
        cancelButton={
          <button className="btn-white" onClick={resetPoll}>
            Cancel
          </button>
        }
      />
    </>)
    
  }
    
  
}

function PollQuestion(
  {districtId, question, nextQuestionAction, cancelButton}: 
  {districtId: string, question: Question, nextQuestionAction: any, cancelButton: React.ReactNode}
) {
  const [, startTransition] = useTransition()

  const handleChoiceClick = useCallback(choiceId => {
    return async () => {
      console.log(`Choice ${choiceId} for question ${question.id} clicked`)
      
      await voteChoiceAction(districtId, choiceId)
      nextQuestionAction()
    }
  }, [question, nextQuestionAction])


  if(R.isEmpty(question.choices)) {
    nextQuestionAction()
    return;
  } else {
    return (<>
      <div className="text-lg">Question: {question.description}</div>

      <div className="flex flex-wrap justify-evenly gap-y-2.5 my-3">
        {
          question.choices?.map(choice => (
            <PollChoice key={choice.id} choice={choice} 
              onClick={() => startTransition(handleChoiceClick(choice.id))}
                                /*  --------------
                                ** to enable the closest Error boundary to this component to catch errors 
                                ** thrown in the server action
                                **  ..[REMINDER] Error boundaries do not catch errors inside event handlers.
                                **/
            />  
          ))
        }
      </div>
      
      <div className="actions">
        {cancelButton}
      </div>
    </>)
  }

}

function PollChoice({choice, onClick}: {choice: Choice, onClick: any}) {
  return (
    <a
      className={clsx(
        "inline-block w-[300px] h-[100px] px-3 rounded-xl shadow-md",
        "text-center text-white ",
        "animate-[pulse_1s_2]",
        "cursor-pointer transition hover:opacity-50 hover:shadow-2xl",
        ChoicePartyUtils.partyBackgroundColorClassName(choice.party)
      )}
      onClick={onClick}
    >
      <div className="text-lg mt-5 mb-1">{choice.description}</div>
      <div className="text-sm">{ChoicePartyUtils.partyName(choice.party)}</div>
    </a>
  );
}