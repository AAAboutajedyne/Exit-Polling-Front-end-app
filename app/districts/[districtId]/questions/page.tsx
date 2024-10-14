import React from 'react'
import Link from 'next/link'
import { PlusCircle, ArrowLeftCircle, Edit, Trash2, List } from 'react-feather'
import Icon from '@/components/common/Icon'
import IconButton from '@/components/common/buttons/IconButton'
import RefreshButton from '@/components/common/buttons/RefreshButton'
import { Question } from '@/models/question.model'
import { http } from '@/libs/apis'
import { deleteQuestionAction } from '@/libs/server-actions/question.server-actions'
import { revalidateQuestions } from '@/libs/server-actions/question.server-actions'
import { getDistrictById } from '@/libs/apis/district.api'
import { QUESTIONS_TAG } from '@/libs/apis/question.api'
import * as R from "ramda"

async function getData(id: string) {
  const district = getDistrictById(id)
  const questions = await http.get(
    `/districts/${id}/questions`, { 
      next: { 
        revalidate: 24 * 3600,
        tags: [QUESTIONS_TAG]
      },
    }
  ) as Question[]

  return Promise.all([district, questions])
}

type Params = {
  params: {
    districtId: string
  }
}

export default async function QuestionsHomePage({params}: Params) {
  const [district, questions] = await getData(params.districtId)
  
  return (
    <div className='space-y-10'>
      <h1>Poll Questions for {district?.name}</h1>

      {
        R.isNotEmpty(questions) 
        ? (
          <table>
            <thead>
              <tr>
                <th colSpan={2}>Description</th>
              </tr>
            </thead>
            <tbody>
              {questions.map(question => (
                <tr key={question.id}>
                  <td>{question.description}</td>
                  <td>
                    <QuestionListActions question={{...question, districtId: params.districtId}} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No questions yet on this district !</div>
        )
      }

      {/* Actions */}
      <div className="actions">
        <Link href={`/districts/${district?.id}/questions/new`}>
          <IconButton IconRef={PlusCircle} label="New Question" />
        </Link>
        <RefreshButton action={revalidateQuestions}/>
        <Link href="/districts">
          <IconButton IconRef={ArrowLeftCircle} label="Back" className="btn-white" />
        </Link>
      </div>
    </div>
  )
}


function QuestionListActions({question}: {question: Question & {districtId: string}}) {
  const deleteQuestionActionWithId = deleteQuestionAction.bind(
    null, question.id.toString()
  )
  return (
    <form className="flex-row justify-end gap-3">
      {/* go to choices home page */}
      <Link href={`/districts/${question.districtId}/questions/${question.id}/choices`}>
        <Icon IconRef={List} />
      </Link>

      {/* edit question */}
      <Link href={`/districts/${question.districtId}/questions/${question.id}/edit/`}><Icon IconRef={Edit} /></Link>
      
      {/* delete question */}
      <button formAction={deleteQuestionActionWithId} type="submit">
        <Icon IconRef={Trash2} />
      </button>
    </form>
  )
}