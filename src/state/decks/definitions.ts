import { OrderedMap, List, OrderedSet, Record, RecordOf } from "immutable";

export interface IDeck {
  id: number;
  creatorId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export const Deck = Record<IDeck>({
  id: -1,
  creatorId: "",
  name: "",
  createdAt: new Date(),
  updatedAt: new Date(),
});

export interface IDeckJSON {
  id: number;
  creator_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export function deckFromJSON(json: IDeckJSON) {
  return Deck({
    id: json.id,
    creatorId: json.creator_id,
    name: json.name,
    createdAt: new Date(json.created_at),
    updatedAt: new Date(json.updated_at),
  });
}

export interface IDecks {
  byId: OrderedMap<number, RecordOf<IDeck>>;
  byCreatorId: OrderedMap<string, OrderedSet<RecordOf<IDeck>>>;
}

export const Decks = Record<IDecks>({
  byId: OrderedMap(),
  byCreatorId: OrderedMap(),
});

export function decksFromJSON(json: Array<IDeckJSON>) {
  return List(json.map(deckFromJSON));
}

export function decksById(decks: List<RecordOf<IDeck>>) {
  return decks.reduce(
    (decks, deck) => decks.set(deck.id, deck),
    OrderedMap<number, RecordOf<IDeck>>()
  );
}

export function decksByCreatorId(decks: List<RecordOf<IDeck>>) {
  return decks.reduce((decks, deck) => {
    const byCreatorId =
      decks.get(deck.creatorId) || OrderedSet<RecordOf<IDeck>>();
    return decks.set(deck.creatorId, byCreatorId.add(deck));
  }, OrderedMap<string, OrderedSet<RecordOf<IDeck>>>());
}
