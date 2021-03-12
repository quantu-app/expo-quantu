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
  private subscribers: Array<(state: Automerge.FreezeObject<T>) => void> = [];

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

  private emit() {
    const subscribers = this.subscribers.slice();
    for (const subscriber of subscribers) {
      subscriber(this.state);
    }
    return this;
  }

  setState(state: Automerge.FreezeObject<T>) {
    this.state = state;
    this.emit();
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
    this.subscribers.push(subscription);
    return () => {
      const index = this.subscribers.indexOf(subscription);
      if (index === -1) {
        this.subscribers.splice(index, 1);
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
    savedValue =
      typeof localStorage === "object" && localStorage?.getItem(name),
    state = savedValue
      ? Automerge.load<T>(savedValue, nodeId)
      : Automerge.from<T>(initialState, nodeId);
  return new Store<T>(name, state, timeout);
}
