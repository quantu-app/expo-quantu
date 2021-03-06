import { Record, RecordOf } from "immutable";

export interface ICurrentUser {
  id: string;
  username: string;
}

export const CurrentUser = Record<ICurrentUser>({
  id: "487a1226-7728-4bb8-96fa-c5d428b9b98a",
  username: "guest",
});

export interface IUser {
  isSignInUpModalOpen: boolean;
  isSignedIn: boolean;
  current: RecordOf<ICurrentUser>;
}

export const User = Record<IUser>({
  isSignInUpModalOpen: false,
  isSignedIn: false,
  current: CurrentUser(),
});
