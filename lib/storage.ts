/** Storage is optional: blocked access and quota failures must not break the UI. */
export function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* keep in-memory state */
  }
}

export function removeStorage(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* storage is optional */
  }
}

export function readStoredJSON(key: string): unknown {
  try {
    return JSON.parse(readStorage(key) ?? "null");
  } catch {
    return null;
  }
}

export function writeStoredJSON(key: string, value: unknown): void {
  writeStorage(key, JSON.stringify(value));
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function booleanRecord(value: unknown): Record<string, boolean> {
  return isRecord(value)
    ? Object.fromEntries(
        Object.entries(value).filter(
          (entry): entry is [string, boolean] => typeof entry[1] === "boolean",
        ),
      )
    : {};
}
