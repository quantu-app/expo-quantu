import { userSetSignInUpModalAction } from "./actions";
import { store } from "..";

export function userSetSignInUpModal(status: boolean) {
  store.dispatch(userSetSignInUpModalAction.create(status));
}
