import { Option, none } from "@aicacia/core";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Automerge from "automerge";
import EventEmitter from "events";

const eventEmitter = new EventEmitter();

export const NODE_ID_KEY = "NODE_ID";
export const NODE_ID: Option<string> = none();

export function getNodeId() {
  return new Promise<string>((resolve) =>
    NODE_ID.mapOrElse(resolve, () => eventEmitter.once(NODE_ID_KEY, resolve))
  );
}

async function main() {
  let nodeId = await AsyncStorage.getItem(NODE_ID_KEY);

  if (!nodeId) {
    nodeId = Automerge.uuid();
    await AsyncStorage.setItem(NODE_ID_KEY, nodeId);
  }

  NODE_ID.replace(nodeId);
  eventEmitter.emit(NODE_ID_KEY, nodeId);
}

main();
