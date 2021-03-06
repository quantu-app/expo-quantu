import { OrderedSet, RecordOf } from "immutable";
import { IState } from "..";
import { IDeck } from "./definitions";

export function selectDeck(state: IState, deckId: number) {
  return state.decks.byId.get(deckId);
}

export function selectDecks(state: IState): OrderedSet<RecordOf<IDeck>> {
  return state.decks.byCreatorId.get(state.user.current.id, OrderedSet());
}
