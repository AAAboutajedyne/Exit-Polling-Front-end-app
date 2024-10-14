import * as R from "ramda"

export enum Party {
  Democrate = "democrate", 
  Republican = "republican"
}

export interface Choice {
  id: number;
  description: string;
  party: Party;
  votes: number
}

export function sortingChoicesByVotesAndThenParty(choices: Choice[]) {
  return R.sortWith([
    R.descend(R.prop("votes") as any),
    R.ascend(R.prop("party") as any)
  ], choices)
}