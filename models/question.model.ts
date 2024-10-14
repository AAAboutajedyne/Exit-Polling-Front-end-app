import { Choice } from "./choice.model";

export interface Question {
  id: number;
  description: string;
  choices?: Choice[];
}