import { createActionWithPayload } from "../actions";

export const USER_SET_SIGN_IN_UP_MODAL = "user.set-sign-in-up-modal";

export const userSetSignInUpModalAction = createActionWithPayload<
  typeof USER_SET_SIGN_IN_UP_MODAL,
  {
    status: boolean;
  }
>(USER_SET_SIGN_IN_UP_MODAL);
