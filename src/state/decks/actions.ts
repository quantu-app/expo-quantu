import { createAsynAction } from "../actions";
import { IDeckJSON } from "./definitions";

export const DECKS_ALL_FOR_CREATOR = "decks.all-for-creator";

export const decksAllForCreatorAction = createAsynAction<
  typeof DECKS_ALL_FOR_CREATOR,
  string,
  Array<IDeckJSON>
>(DECKS_ALL_FOR_CREATOR);

export const DECKS_GET = "decks.get";

export const decksGetAction = createAsynAction<
  typeof DECKS_GET,
  number,
  IDeckJSON
>(DECKS_GET);

export const DECKS_CREATE = "decks.create";

export const decksCreateAction = createAsynAction<
  typeof DECKS_CREATE,
  undefined,
  IDeckJSON
>(DECKS_CREATE);

export const DECKS_UPDATE = "decks.update";

export const decksUpdateAction = createAsynAction<
  typeof DECKS_UPDATE,
  { id: number; deck: Partial<IDeckJSON> },
  IDeckJSON
>(DECKS_UPDATE);

export const DECKS_DELETE = "decks.delete";

export const decksDeleteAction = createAsynAction<
  typeof DECKS_DELETE,
  number,
  undefined
>(DECKS_DELETE);
