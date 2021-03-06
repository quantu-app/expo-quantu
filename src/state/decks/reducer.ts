import { RecordOf, OrderedSet } from "immutable";
import { IAction } from "../actions";
import { decksAllForCreatorAction, decksCreateAction } from "./actions";
import {
  IDecks,
  Decks,
  deckFromJSON,
  decksFromJSON,
  decksById,
  decksByCreatorId,
} from "./definitions";

export const INITIAL_STATE = Decks();

export function reducer(
  state = INITIAL_STATE,
  action: IAction
): RecordOf<IDecks> {
  if (decksAllForCreatorAction.success.is(action)) {
    const decks = decksFromJSON(action.payload);
    return state
      .update("byId", (byId) => byId.merge(decksById(decks)))
      .update("byCreatorId", (byCreatorId) =>
        byCreatorId.mergeDeep(decksByCreatorId(decks))
      );
  } else if (decksCreateAction.success.is(action)) {
    const deck = deckFromJSON(action.payload);
    return state
      .update("byId", (byId) => byId.set(deck.id, deck))
      .update("byCreatorId", (byCreatorId) => {
        const decks = byCreatorId.get(deck.creatorId) || OrderedSet();
        return byCreatorId.set(deck.creatorId, decks.add(deck));
      });
  } else {
    return state;
  }
}
