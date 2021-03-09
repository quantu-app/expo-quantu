import { createAsynAction } from "../actions";
import { IQuestionJSON, QuestionType } from "./definitions";

export const QUESTIONS_GET = "questions.get";

export const questionsGetAction = createAsynAction<
  typeof QUESTIONS_GET,
  number,
  IQuestionJSON
>(QUESTIONS_GET);

export const QUESTIONS_ALL_FOR_DECK = "questions.all-for-deck";

export const questionsAllAction = createAsynAction<
  typeof QUESTIONS_ALL_FOR_DECK,
  number,
  Array<IQuestionJSON>
>(QUESTIONS_ALL_FOR_DECK);

export const QUESTIONS_CREATE = "questions.create";

export const questionsCreateAction = createAsynAction<
  typeof QUESTIONS_CREATE,
  { type: QuestionType; deckId: number },
  IQuestionJSON
>(QUESTIONS_CREATE);

export const QUESTIONS_UPDATE = "questions.update";

export const questionsUpdateAction = createAsynAction<
  typeof QUESTIONS_UPDATE,
  { id: number; question: Partial<IQuestionJSON> },
  IQuestionJSON
>(QUESTIONS_UPDATE);

export const QUESTIONS_DELETE = "questions.delete";

export const questionsDeleteAction = createAsynAction<
  typeof QUESTIONS_DELETE,
  number,
  undefined
>(QUESTIONS_DELETE);
