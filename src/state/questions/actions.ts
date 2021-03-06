import { createAsynAction } from "../actions";
import { IQuestionJSON, QuestionType } from "./definitions";

export const QUESTIONS_ALL_FOR_DECK = "questions.all-for-deck";

export const questionAllAction = createAsynAction<
  typeof QUESTIONS_ALL_FOR_DECK,
  number,
  Array<IQuestionJSON>
>(QUESTIONS_ALL_FOR_DECK);

export const QUESTIONS_CREATE = "questions.create";

export const questionCreateAction = createAsynAction<
  typeof QUESTIONS_CREATE,
  { type: QuestionType; deckId: number },
  IQuestionJSON
>(QUESTIONS_CREATE);
