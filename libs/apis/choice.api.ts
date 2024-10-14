import "server-only"
import { http } from ".";
import { Choice } from "@/models/choice.model";

export const CHOICES_TAG = "choices"

export async function getChoicesByQuestionId(questionId: string) {
  return await http.get(
    `/questions/${questionId}/choices`, {
      next: { revalidate: 24 * 3600 }
    }
  ) as Choice[]
}

export async function getChoiceById(questionId: string, choiceId: string) {
  const choices = await getChoicesByQuestionId(questionId)

  return choices
    ?.filter(choice => choice.id === +choiceId)
    ?.at(0)
}