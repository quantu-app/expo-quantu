import { Action } from "redux";

export interface IAction<T = any> extends Action<T> {}

export function createAction<T = any>(type: T) {
  function is(action: IAction): action is IAction<T> {
    return action.type === type;
  }

  function create(): IAction<T> {
    return { type };
  }

  return { is, create };
}

export interface IActionWithPayload<T = any, P = any> extends IAction<T> {
  payload: P;
}

export function createActionWithPayload<T = any, P = any>(type: T) {
  function is(action: IAction): action is IActionWithPayload<T, P> {
    return action.type === type;
  }

  function create(payload: P): IActionWithPayload<T, P> {
    return { type, payload };
  }

  return { is, create };
}

export function createAsynAction<
  T = any,
  Input = any,
  Success = any,
  Error = any
>(type: T) {
  const pendingType = `${type}.pending`,
    successType = `${type}.success`,
    failedType = `${type}.failed`;
  return {
    pending: createActionWithPayload<typeof pendingType, Input>(pendingType),
    success: createActionWithPayload<typeof successType, Success>(successType),
    failed: createActionWithPayload<typeof failedType, Error>(failedType),
  };
}
