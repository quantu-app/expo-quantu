import { OrderedSet, RecordOf } from "immutable";
import { IState } from "..";
import { IDeck } from "./definitions";

export function selectDeckById(state: IState, id: number) {
  return state.decks.byId.get(id);
}

export function selectDecks(state: IState): OrderedSet<RecordOf<IDeck>> {
  return state.decks.byCreatorId.get(state.user.current.id, OrderedSet());
}
