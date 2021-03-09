import { OrderedSet, RecordOf } from "immutable";
import { IAction } from "../actions";
import {
  questionsAllAction,
  questionsCreateAction,
  questionsGetAction,
  questionsDeleteAction,
  questionsUpdateAction,
} from "./actions";
import {
  IQuestions,
  questionFromJSON,
  Questions,
  questionsFromJSON,
  questionsById,
  questionsByDeckId,
  IQuestion,
} from "./definitions";

export const INITIAL_STATE = Questions();

export function reducer(
  state = INITIAL_STATE,
  action: IAction
): RecordOf<IQuestions> {
  if (questionsGetAction.success.is(action)) {
    const question = questionFromJSON(action.payload);
    return state
      .update("byId", (byId) => byId.set(question.id, question))
      .update("byDeckId", (byDeckId) => {
        const questions = byDeckId.get(question.deckId) || OrderedSet();
        return byDeckId.set(question.deckId, questions.add(question));
      });
  } else if (questionsAllAction.success.is(action)) {
    const questions = questionsFromJSON(action.payload);
    return state
      .update("byId", (byId) => byId.merge(questionsById(questions)))
      .update("byDeckId", (byDeckId) =>
        byDeckId.merge(questionsByDeckId(questions))
      );
  } else if (questionsCreateAction.success.is(action)) {
    const question = questionFromJSON(action.payload);
    return state
      .update("byId", (byId) => byId.set(question.id, question))
      .update("byDeckId", (byDeckId) => {
        const questions = byDeckId.get(question.deckId) || OrderedSet();
        return byDeckId.set(question.deckId, questions.add(question));
      });
  } else if (questionsUpdateAction.success.is(action)) {
    const question = questionFromJSON(action.payload);
    return state
      .update("byId", (byId) => byId.set(question.id, question))
      .update("byDeckId", (byDeckId) => {
        const questions = byDeckId.get(question.deckId) || OrderedSet();
        return byDeckId.set(question.deckId, questions.add(question));
      });
  } else if (questionsDeleteAction.pending.is(action)) {
    const question = state.byId.get(action.payload);
    if (question) {
      return state
        .update("byId", (byId) => byId.delete(question.id))
        .update("byDeckId", (byDeckId) => {
          const questions =
            byDeckId.get(question.deckId) || OrderedSet<RecordOf<IQuestion>>();
          return byDeckId.set(question.deckId, questions.remove(question));
        });
    } else {
      return state;
    }
  } else {
    return state;
  }
}
