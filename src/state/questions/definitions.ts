import { IJSONObject } from "@aicacia/json";
import { List, OrderedMap, OrderedSet, Record, RecordOf } from "immutable";

export enum QuestionType {
  FlashCard = "flashcard",
}

interface IQuestionBase {
  id: number;
  type: QuestionType;
  deckId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface IQuestionBaseJSON {
  id: number;
  type: QuestionType;
  deck_id: number;
  created_at: string;
  updated_at: string;
}

const QuestionBaseDefaults = {
  id: -1,
  type: QuestionType.FlashCard,
  deckId: -1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export interface IFlashCardQuestion extends IQuestionBase {
  front: string;
  back: string;
}

export const FlashCardQuestion = Record<IFlashCardQuestion>({
  ...QuestionBaseDefaults,
  front: "",
  back: "",
});

export function isFlashCardQuestion(
  value: RecordOf<IQuestion>
): value is RecordOf<IFlashCardQuestion> {
  return value.type === QuestionType.FlashCard;
}

export type IQuestion = IFlashCardQuestion;

export interface IFlashCardQuestionJSON extends IQuestionBaseJSON {
  front: IJSONObject;
  back: IJSONObject;
}

export type IQuestionJSON = IFlashCardQuestionJSON;

export function questionFromJSON(json: IQuestionJSON): RecordOf<IQuestion> {
  if (json.type === QuestionType.FlashCard) {
    return FlashCardQuestion({
      id: json.id,
      type: json.type,
      deckId: json.deck_id,
      createdAt: new Date(json.created_at),
      updatedAt: new Date(json.updated_at),
    });
  } else {
    throw new TypeError(`Invalid type for Question: ${json.type}`);
  }
}

export interface IQuestions {
  byId: OrderedMap<number, RecordOf<IQuestion>>;
  byDeckId: OrderedMap<number, OrderedSet<RecordOf<IQuestion>>>;
}

export const Questions = Record<IQuestions>({
  byId: OrderedMap(),
  byDeckId: OrderedMap(),
});

export function questionsFromJSON(json: Array<IQuestionJSON>) {
  return List(json.map(questionFromJSON));
}

export function questionsById(questions: List<RecordOf<IQuestion>>) {
  return questions.reduce(
    (questions, question) => questions.set(question.id, question),
    OrderedMap<number, RecordOf<IQuestion>>()
  );
}

export function questionsByDeckId(questions: List<RecordOf<IQuestion>>) {
  return questions.reduce((questions, question) => {
    const byDeckId =
      questions.get(question.deckId) || OrderedSet<RecordOf<IQuestion>>();
    return questions.set(question.deckId, byDeckId.add(question));
  }, OrderedMap<number, OrderedSet<RecordOf<IQuestion>>>());
}
