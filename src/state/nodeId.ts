import Automerge from "automerge";

export const NODE_ID_KEY = "NODE_ID";

let nodeId: string =
  typeof localStorage === "object" &&
  (localStorage.getItem(NODE_ID_KEY) as any);

if (!nodeId) {
  nodeId = Automerge.uuid();
  typeof localStorage === "object" && localStorage.setItem(NODE_ID_KEY, nodeId);
}

export function getNodeId(): string {
  return nodeId;
}
