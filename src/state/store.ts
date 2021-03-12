import { debounce } from "@aicacia/debounce";
import Automerge from "automerge";
import { getNodeId } from "./nodeId";

const DEFAULT_TIMEOUT = 1000;

export interface IStoreOptions {
  timeout?: number;
}

export class Store<T> {
  private name: string;
  private state: Automerge.FreezeObject<T>;
  private debouncedPersist: () => void;
  private subscriptions: Array<(state: Automerge.FreezeObject<T>) => void> = [];

  constructor(name: string, state: Automerge.FreezeObject<T>, timeout: number) {
    this.name = name;
    this.state = state;
    this.debouncedPersist = debounce(() => this.persist(), timeout);
  }

  persist() {
    typeof localStorage === "object" &&
      localStorage.setItem(this.name, Automerge.save(this.state));
  }

  getState() {
    return this.state;
  }

  private emit(state: Automerge.FreezeObject<T>) {
    const subscriptions = this.subscriptions.slice();
    for (const subscription of subscriptions) {
      subscription(state);
    }
    return this;
  }

  setState(state: Automerge.FreezeObject<T>) {
    this.state = state;
    this.emit(state);
    this.debouncedPersist();
    return this;
  }

  update(updater: (current: T) => void, action = "") {
    this.setState(Automerge.change(this.state, action, updater));
    return this;
  }

  subscribe(
    subscription: (value: Automerge.FreezeObject<T>) => void
  ): () => void {
    subscription(this.state);
    this.subscriptions.push(subscription);
    return () => {
      const index = this.subscriptions.indexOf(subscription);
      if (index === -1) {
        this.subscriptions.splice(index, 1);
      }
    };
  }
}

export function createStore<T>(
  name: string,
  initialState: T,
  timeout = DEFAULT_TIMEOUT
) {
  const nodeId = getNodeId(),
    savedValue = typeof localStorage === "object" && localStorage.getItem(name),
    state = savedValue
      ? Automerge.load<T>(savedValue, nodeId)
      : Automerge.from<T>(initialState, nodeId);
  return new Store<T>(name, state, timeout);
}
