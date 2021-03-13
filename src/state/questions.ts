import { debounce } from "@aicacia/debounce";
import Automerge from "automerge";
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
  front: string;
  back: string;
}

export type IQuestion = IFlashCardQuestion;

export const questionStore = createStore("questions", {
  table: new Automerge.Table<IQuestion>(),
});

export function createQuestion(type: QuestionType, deckId: string) {
  if (!deckStore.getState().table.byId(deckId)) {
    throw new Error(`Deck ${deckId} does not exists`);
  }
  let id: string | undefined;
  questionStore.update((state) => {
    const now = new Date().toJSON();
    id = state.table.add({
      type,
      deckId,
      createdAt: now,
      updatedAt: now,
      front: "Front",
      back: "Back",
    });
  }, `Create ${type} Question`);
  return id;
}

export function updateQuestion(id: string, question: Partial<IQuestion>) {
  questionStore.update((state) => {
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
  questionStore.update((state) => {
    state.table.remove(id);
  }, `Delete Deck ${id}`);
}

import { deckStore } from "./decks";
