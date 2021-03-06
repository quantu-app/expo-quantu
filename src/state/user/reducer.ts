import { RecordOf } from "immutable";
import { User, IUser } from "./definitions";
import { userSetSignInUpModalAction } from "./actions";
import { IAction } from "../actions";

export const INITIAL_STATE = User();

export function reducer(
  state = INITIAL_STATE,
  action: IAction
): RecordOf<IUser> {
  if (userSetSignInUpModalAction.is(action)) {
    return state.set("isSignInUpModalOpen", action.payload.status);
  } else {
    return state;
  }
}
