import { IState } from "..";
import { RecordOf } from "immutable";
import { ICurrentUser } from "./definitions";

export function selectIsSignedIn(state: IState): boolean {
  return state.user.isSignedIn;
}

export function selectUser(state: IState): RecordOf<ICurrentUser> {
  return state.user.current;
}

export function selectIsSignInUpModalOpen(state: IState): boolean {
  return state.user.isSignInUpModalOpen;
}
