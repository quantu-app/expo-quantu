import { debounce } from "@aicacia/debounce";
import Automerge from "automerge";
import { decks } from "./decks";
import { createStore } from "./store";

export enum QuestionType {
  FlashCard = "flashcard",
}

interface IQuestionBase {
  type: QuestionType;
  deckId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IFlashCardQuestion extends IQuestionBase {
  front: "";
  back: "";
}

export type IQuestion = IFlashCardQuestion;

export const questions = createStore("questions", {
  table: new Automerge.Table<IQuestion>(),
});

export function createQuestion(type: QuestionType, deckId: string) {
  if (!decks.getState().table.byId(deckId)) {
    throw new Error(`Deck ${deckId} does not exists`);
  }
  let id: string | undefined;
  questions.update((state) => {
    const now = new Date().toJSON();
    id = state.table.add({
      type,
      deckId,
      createdAt: now,
      updatedAt: now,
      front: "",
      back: "",
    });
  }, `Create ${type} Question`);
  return id;
}

export function updateQuestion(id: string, question: Partial<IQuestion>) {
  questions.update((state) => {
    const row = state.table.byId(id);
    if (question.front) {
      row.front = question.front;
    }
    if (question.back) {
      row.back = question.back;
    }
    row.updatedAt = new Date().toJSON();
  }, `Update Deck ${id}`);
}

export const updateQuestionDebounced = debounce(updateQuestion, 1000);

export function deleteQuestion(id: string) {
  questions.update((state) => {
    state.table.remove(id);
  }, `Delete Deck ${id}`);
}
