import { decksAllForCreatorAction, decksCreateAction } from "./actions";
import { store } from "..";

export function decksAllForCreator(creatorId: string) {
  store.dispatch(decksAllForCreatorAction.pending.create(creatorId));
  setTimeout(() => {
    store.dispatch(
      decksAllForCreatorAction.success.create([
        {
          id: ++ID,
          creator_id: creatorId,
          name: "Test",
          created_at: "2021-03-06T13:47:55.580Z",
          updated_at: "2021-03-06T13:47:55.580Z",
        },
      ])
    );
  }, 1000);
}

let ID = 0;

export function decksCreate() {
  store.dispatch(decksCreateAction.pending.create(undefined));
  setTimeout(() => {
    store.dispatch(
      decksCreateAction.success.create({
        id: ++ID,
        creator_id: "487a1226-7728-4bb8-96fa-c5d428b9b98a",
        name: "New Deck",
        created_at: "2021-03-06T13:47:55.580Z",
        updated_at: "2021-03-06T13:47:55.580Z",
      })
    );
  }, 1000);
}
