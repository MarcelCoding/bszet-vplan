import { Changes } from "./domain";

const LAST_MODIFIED = "last-modified";
const CHANGES = "changes";

export async function getStoredLastModified(): Promise<string | null> {
  const modified = await get<string>(LAST_MODIFIED);
  return modified === "" ? null : modified;
}

export async function setStoredLastModified(
  modified?: string | null
): Promise<void> {
  if (modified === null) {
    modified = "";
  }

  return modified
    ? await put(LAST_MODIFIED, modified)
    : await remove(LAST_MODIFIED);
}

export async function getStoredChanges(): Promise<Changes | null> {
  return await get(CHANGES);
}

export async function setStoredChanges(changes?: Changes): Promise<void> {
  return changes ? await put(CHANGES, changes) : await remove(CHANGES);
}

async function get<T>(key: string): Promise<T | null> {
  return await BSZET_VPLAN.get(key, { type: "json" });
}

async function put<T>(key: string, value: T): Promise<void> {
  return await BSZET_VPLAN.put(key, JSON.stringify(value));
}

async function remove(key: string): Promise<void> {
  return await BSZET_VPLAN.delete(key);
}
