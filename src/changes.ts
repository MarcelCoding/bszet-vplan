import { Changes } from "./domain";
import {
  getStoredChanges,
  getStoredLastModified,
  setStoredChanges,
  setStoredLastModified,
} from "./store";

const CHANGES_PDF_URL =
  "https://geschuetzt.bszet.de/s-lk-vw/Vertretungsplaene/vertretungsplan-bgy.pdf";
// @ts-ignore
const PARSE_CHANGES_URL = `${API_URL}/parse-pdf`;

export async function checkChangesAndUpdate(): Promise<boolean> {
  const [actualLastModified, storedLastModified] = await Promise.all([
    fetchChangesPdfLastModified(),
    getStoredLastModified(),
  ]);

  if (!storedLastModified || storedLastModified !== actualLastModified) {
    await Promise.all([
      setStoredLastModified(actualLastModified),
      setStoredChanges(),
    ]);
    return true;
  }

  return false;
}

export async function fetchChangesPdf(): Promise<Blob> {
  const response = await fetch(CHANGES_PDF_URL, {
    // @ts-ignore
    headers: { Authorization: "Basic " + btoa(USER + ":" + PASS) },
  });

  if (response.status !== 200) {
    throw new Error(
      `Error while fetching changes pdf file: ${response.status} ${response.statusText}`
    );
  }

  return response.blob();
}

export async function fetchChanges(): Promise<Changes> {
  const storedChanges = await getStoredChanges();
  if (storedChanges) {
    return storedChanges;
  }

  const changesPdf = await fetchChangesPdf();
  return await parseAndStoreChanges(changesPdf);
}

export async function parseAndStoreChanges(changesPdf: Blob): Promise<Changes> {
  const body = new FormData();
  body.append("file", changesPdf);

  const response = await fetch(PARSE_CHANGES_URL, {
    method: "POST",
    body: body,
    // @ts-ignore
    headers: { Authorization: `Bearer ${API_KEY}` },
  });

  if (response.status !== 200) {
    throw new Error(
      `Error while parsing changes pdf file: ${response.status} ${response.statusText}`
    );
  }

  const changes = await response.json();
  await setStoredChanges(changes);

  return changes;
}

async function fetchChangesPdfLastModified(): Promise<string> {
  const response = await fetch(CHANGES_PDF_URL, {
    method: "HEAD",
    // @ts-ignore
    headers: { Authorization: "Basic " + btoa(USER + ":" + PASS) },
  });

  const lastModified = response.headers.get("last-modified");

  if (response.status !== 200) {
    throw new Error(
      `Error while fetching changes pdf file last modified state: ${response.status} ${response.statusText}`
    );
  }

  if (!lastModified) {
    throw new Error("Empty last modified value");
  }

  return lastModified;
}
