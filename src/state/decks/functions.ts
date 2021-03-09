import {
  decksAllForCreatorAction,
  decksCreateAction,
  decksDeleteAction,
  decksGetAction,
  decksUpdateAction,
} from "./actions";
import { store } from "..";
import { IDeckJSON } from "./definitions";
import { debounce } from "@aicacia/debounce";
import { selectDeckById } from "./selectors";

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export async function decksGet(id: number, force = true) {
  if (!force || selectDeckById(store.getState(), id)) {
    return;
  }
  store.dispatch(decksGetAction.pending.create(id));
  await wait(1000);
  store.dispatch(
    decksGetAction.success.create({
      id: 1,
      creator_id: "487a1226-7728-4bb8-96fa-c5d428b9b98a",
      name: "Test",
      created_at: "2021-03-06T13:47:55.580Z",
      updated_at: "2021-03-06T13:47:55.580Z",
    })
  );
}

export async function decksAllForCreator(creatorId: string) {
  store.dispatch(decksAllForCreatorAction.pending.create(creatorId));
  await wait(1000);
  store.dispatch(
    decksAllForCreatorAction.success.create([
      {
        id: 1,
        creator_id: creatorId,
        name: "Test",
        created_at: "2021-03-06T13:47:55.580Z",
        updated_at: "2021-03-06T13:47:55.580Z",
      },
    ])
  );
}

export async function decksCreate() {
  store.dispatch(decksCreateAction.pending.create(undefined));
  await wait(1000);
  store.dispatch(
    decksCreateAction.success.create({
      id: 1,
      creator_id: "487a1226-7728-4bb8-96fa-c5d428b9b98a",
      name: "New Deck",
      created_at: "2021-03-06T13:47:55.580Z",
      updated_at: "2021-03-06T13:47:55.580Z",
    })
  );
}

export async function decksUpdate(id: number, deck: Partial<IDeckJSON>) {
  store.dispatch(decksUpdateAction.pending.create({ id, deck }));
  await wait(1000);
  store.dispatch(
    decksUpdateAction.success.create({
      id: 1,
      creator_id: "487a1226-7728-4bb8-96fa-c5d428b9b98a",
      name: "Test",
      created_at: "2021-03-06T13:47:55.580Z",
      ...deck,
      updated_at: new Date().toJSON(),
    })
  );
}

export const debouncedDecksUpdate = debounce(decksUpdate, 1000);

export async function decksDelete(deckId: number) {
  store.dispatch(decksDeleteAction.pending.create(deckId));
  await wait(1000);
  store.dispatch(decksDeleteAction.success.create(undefined));
}
