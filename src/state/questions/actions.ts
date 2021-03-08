import { createAsynAction } from "../actions";
import { IQuestionJSON, QuestionType } from "./definitions";

export const QUESTIONS_GET = "questions.get";

export const questionGetAction = createAsynAction<
  typeof QUESTIONS_GET,
  number,
  IQuestionJSON
>(QUESTIONS_GET);

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

export const QUESTIONS_DELETE = "questions.delete";

export const questionsDeleteAction = createAsynAction<
  typeof QUESTIONS_DELETE,
  number,
  undefined
>(QUESTIONS_DELETE);
