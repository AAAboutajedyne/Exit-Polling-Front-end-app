import { Question } from "./question.model";

export interface District {
  id: number;
  name: string;
  questions?: Question[];
}

export type DistrictInfo = Pick<District, "id" | "name">