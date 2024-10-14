import React from 'react'
import { http } from '@/libs/apis'
import { CHOICES_TAG } from '@/libs/apis/choice.api'
import { getDistrictById } from '@/libs/apis/district.api'
import { getQuestionById } from '@/libs/apis/question.api'
import Icon from '@/components/common/Icon'
import { ArrowLeftCircle, Edit, PlusCircle, Trash2 } from 'react-feather'
import Link from 'next/link'
import IconButton from '@/components/common/buttons/IconButton'
import RefreshButton from '@/components/common/buttons/RefreshButton'
import { toPascalCase } from '@/utils/string.utils'
import { Choice } from '@/models/choice.model'
import { deleteChoiceAction, revalidateChoices } from '@/libs/server-actions/choice.server-action'
import * as R from "ramda"

async function getData({districtId, questionId}: {districtId: string, questionId: string}) {
  const district = getDistrictById(districtId)
  const question = getQuestionById(districtId, questionId)
  const choices = await http.get(
    `/questions/${questionId}/choices`, { 
      next: { 
        revalidate: 24 * 3600,
        tags: [CHOICES_TAG]
      },
    }
  ) as Choice[]

  return Promise.all([district, question, choices])
}

type Params = {
  params: {
    districtId: string
    questionId: string
  }
}

export default async function ChoicesHomePage({params}: Params) {
  const [district, question, choices] = await getData(params)
  
  return (
    <div className='space-y-10'>
      <h1>Choices for {question?.description} in {district?.name}</h1>

      {
        R.isNotEmpty(choices) 
        ? (
          <table>
            <thead>
              <tr>
                <th>Choice</th>
                <th>Party</th>
                <th colSpan={2}>Votes</th>
              </tr>
            </thead>
            <tbody>
              {choices.map(choice => (
                <tr key={choice.id}>
                  <td>{choice.description}</td>
                  <td>{toPascalCase(choice.party)}</td>
                  <td>{choice.votes}</td>
                  <td>
                    <ChoiceListActions choice={choice} 
                      editLinkUrl={`/districts/${district?.id}/questions/${question?.id}/choices/${choice.id}/edit/`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No choices yet for this question !</div>
        )
      }

      {/* Actions */}
      <div className="actions">
        <Link href={`/districts/${district?.id}/questions/${question?.id}/choices/new`}>
          <IconButton IconRef={PlusCircle} label="New Choice" />
        </Link>
        <RefreshButton action={revalidateChoices}/>
        <Link href={`/districts/${district?.id}/questions`}>
          <IconButton IconRef={ArrowLeftCircle} label="Back" className="btn-white" />
        </Link>
      </div>

    </div>
  )
}


function ChoiceListActions({choice, editLinkUrl}: {choice: Choice, editLinkUrl: string}) {
  const deleteChoiceActionWithId = deleteChoiceAction.bind(
    null, choice.id.toString()
  )
  return (
    <form className="flex-row justify-end gap-3">
      {/* edit choice */}
      <Link href={editLinkUrl}><Icon IconRef={Edit} /></Link>
      
      {/* delete choice */}
      <button formAction={deleteChoiceActionWithId} type="submit">
        <Icon IconRef={Trash2} />
      </button>
    </form>
  )
}