import { List, RecordOf } from "immutable";
import { IState } from "..";
import { IQuestion } from "./definitions";

export function selectDeckQuestions(
  state: IState,
  deckId: number
): List<RecordOf<IQuestion>> {
  return state.questions.byDeckId.get(deckId, List());
}
