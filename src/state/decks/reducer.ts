import { RecordOf, OrderedSet } from "immutable";
import { IAction } from "../actions";
import {
  decksAllForCreatorAction,
  decksCreateAction,
  decksDeleteAction,
  decksGetAction,
} from "./actions";
import {
  IDecks,
  Decks,
  deckFromJSON,
  decksFromJSON,
  decksById,
  decksByCreatorId,
  IDeck,
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
        byCreatorId.merge(decksByCreatorId(decks))
      );
  } else if (decksGetAction.success.is(action)) {
    const deck = deckFromJSON(action.payload);
    return state
      .update("byId", (byId) => byId.set(deck.id, deck))
      .update("byCreatorId", (byCreatorId) => {
        const decks =
          byCreatorId.get(deck.creatorId) || OrderedSet<RecordOf<IDeck>>();
        return byCreatorId.set(deck.creatorId, decks.add(deck));
      });
  } else if (decksCreateAction.success.is(action)) {
    const deck = deckFromJSON(action.payload);
    return state
      .update("byId", (byId) => byId.set(deck.id, deck))
      .update("byCreatorId", (byCreatorId) => {
        const decks =
          byCreatorId.get(deck.creatorId) || OrderedSet<RecordOf<IDeck>>();
        return byCreatorId.set(deck.creatorId, decks.add(deck));
      });
  } else if (decksDeleteAction.pending.is(action)) {
    const deck = state.byId.get(action.payload);
    if (deck) {
      return state
        .update("byId", (byId) => byId.delete(deck.id))
        .update("byCreatorId", (byCreatorId) => {
          const decks =
            byCreatorId.get(deck.creatorId) || OrderedSet<RecordOf<IDeck>>();
          return byCreatorId.set(deck.creatorId, decks.remove(deck));
        });
    } else {
      return state;
    }
  } else {
    return state;
  }
}
