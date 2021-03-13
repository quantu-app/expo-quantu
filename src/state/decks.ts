import { debounce } from "@aicacia/debounce";
import Automerge from "automerge";
import { questionStore } from "./questions";
import { createStore } from "./store";

export interface IDeck {
  name: string;
  createdAt: string;
  updatedAt: string;
}

export const deckStore = createStore("decks", {
  table: new Automerge.Table<IDeck>(),
});

export function createDeck(name: string) {
  let id: string | undefined;
  deckStore.update((state) => {
    const now = new Date().toJSON();
    id = state.table.add({
      name,
      createdAt: now,
      updatedAt: now,
    });
  }, `Create Deck ${name}`);
  return id;
}

export function updateDeck(id: string, deck: Partial<IDeck>) {
  deckStore.update((state) => {
    const row = state.table.byId(id);
    if (deck.name) {
      row.name = deck.name;
    }
    row.updatedAt = new Date().toJSON();
  }, `Update Deck ${id}`);
}

export const updateDeckDebounced = debounce(updateDeck, 1000);

export function deleteDeck(id: string) {
  questionStore.update((state) => {
    for (const row of state.table.rows.filter((row) => row.deckId === id)) {
      state.table.remove(row.id);
    }
  }, `Delete Deck ${id}`);
  deckStore.update((state) => {
    state.table.remove(id);
  }, `Delete Deck ${id}`);
}
