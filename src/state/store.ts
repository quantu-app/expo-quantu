import { debounce } from "@aicacia/debounce";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Automerge from "automerge";
import { useMemo, useRef, useState } from "react";
import { EventEmitter } from "events";
import shallowEquals from "shallow-equals";
import { getNodeId } from "./nodeId";

const DEFAULT_TIMEOUT = 1000;

export interface IStoreOptions {
  timeout?: number;
}

// tslint:disable-next-line: interface-name
export interface Store<T> extends EventEmitter {
  on(event: "change", listener: (state: T, action?: string) => void): this;
  addListener(
    event: "change",
    listener: (state: T, action?: string) => void
  ): this;
  off(event: "change", listener: (state: T, action?: string) => void): this;
  off(event: "change"): this;
  removeListener(
    event: "change",
    listener: (state: T, action?: string) => void
  ): this;
  removeAllListeners(event: "change"): this;
}

export class Store<T> extends EventEmitter {
  private name: string;
  private state: Automerge.FreezeObject<T>;
  private debouncedPersist: () => Promise<void>;

  constructor(name: string, state: Automerge.FreezeObject<T>, timeout: number) {
    super();
    this.name = name;
    this.state = state;
    this.debouncedPersist = debounce(() => this.persist(), timeout);
  }

  async persist() {
    await AsyncStorage.setItem(this.name, Automerge.save(this.state));
    this.emit("persist");
  }

  getState() {
    return this.state;
  }

  setState(state: Automerge.FreezeObject<T>) {
    this.state = state;
    this.emit("change", this.state);
    this.debouncedPersist();
    return this;
  }

  update(updater: (current: T) => void, action = "") {
    this.setState(Automerge.change(this.state, action, updater));
    return this;
  }
}

export function createStore<T>(
  name: string,
  initialState: T,
  timeout = DEFAULT_TIMEOUT
): [Store<T>, <V>(map: (state: T) => V) => V] {
  const state = Automerge.from<T>(initialState),
    store = new Store<T>(name, state, timeout);

  getNodeId().then(async (nodeId) => {
    const value = await AsyncStorage.getItem(name);

    if (value) {
      store.setState(Automerge.load<T>(value, nodeId));
    } else {
      store.setState(Automerge.from<T>(initialState, nodeId));
    }
  });

  return [store, createUseStore(store)];
}

export function createUseStore<T>(store: Store<T>) {
  return function useStore<V>(mapStateToProps: (state: T) => V) {
    const [props, setProps] = useState(() =>
        mapStateToProps(store.getState() as T)
      ),
      lastProps = useRef<V>();

    useMemo(() => {
      function onChange(state: T) {
        const nextProps = mapStateToProps(state);

        if (
          !lastProps.current ||
          !shallowEquals(lastProps.current, nextProps)
        ) {
          lastProps.current = nextProps;
          setProps(nextProps);
        }
      }
      store.addListener("change", onChange);
      return () => {
        store.removeListener("change", onChange);
      };
    }, []);

    return props;
  };
}
