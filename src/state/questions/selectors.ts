import { OrderedSet, RecordOf } from "immutable";
import { IState } from "..";
import { IQuestion } from "./definitions";

export function selectQuestionsByDeckId(
  state: IState,
  deckId: number
): OrderedSet<RecordOf<IQuestion>> {
  return state.questions.byDeckId.get(deckId, OrderedSet());
}

export function selectQuestionById(state: IState, id: number) {
  return state.questions.byId.get(id);
}
