import "server-only"
import { http } from ".";
import { getChoicesByQuestionId } from "./choice.api";
import { Question } from "@/models/question.model";
import * as R from "ramda"
import { delay } from "@/utils/promise.utils";

export const QUESTIONS_TAG = "questions"

export async function getQuestionsByDistrictId(districtId: string) {
  return await http.get(
    `/districts/${districtId}/questions`, {
      next: { revalidate: 24 * 3600 }
    }
  ) as Question[]
}

export async function getQuestionsWithChoicesByDistrictId(districtId: string): Promise<Question[]> {
  const questions = await getQuestionsByDistrictId(districtId)

  const choicesPromise = questions.map(question =>
    getChoicesByQuestionId(question.id.toString())
  )
  const allChoices = await Promise.all(choicesPromise)

  //TODO: remove this delay
  // await delay(3000)

  return questions.map((question, index) => ({
    ...question, choices: allChoices[index]
  }))
}

export async function getQuestionById(districtId: string, questionId: string) {
  const questions = await getQuestionsByDistrictId(districtId)

  return questions
    ?.filter(question => question.id === +questionId)
    ?.at(0) as Question | undefined
}