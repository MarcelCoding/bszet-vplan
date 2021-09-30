import { vPlanCron } from "./vplan";
import { Router } from "itty-router";
import { initSentry } from "./sentry";
import { fetchChanges } from "./timetable/changes";
import { getActualTimetable } from "./timetable";

async function handleCron(): Promise<unknown> {
  // if more, use Promise.all
  return vPlanCron();
}

const router = Router()
  .get("/image/:id", (request) =>
    fetch(`https://pdf2img.schripke.xyz/img/${request.params?.id}`, {
      // @ts-ignore
      headers: { Authorization: `Bearer ${API_KEY}` },
    })
  )
  .get("/test/changes", async () => {
    return new Response(JSON.stringify(await fetchChanges()), {
      headers: { "Content-Type": "application/json" },
    });
  })
  .get("/test/:clazz", async (request) => {
    let date;

    const rawDate = request.query?.date;

    if (rawDate) {
      try {
        date = new Date(rawDate);
      } catch (e) {
        return new Response("Bad Date", { status: 404 });
      }
    } else {
      date = new Date();
    }

    const clazz = request.params?.clazz;
    if (!clazz) {
      return new Response("Missing Class: /test/<class>", { status: 404 });
    }

    return new Response(JSON.stringify(await getActualTimetable(clazz, date)), {
      headers: { "Content-Type": "application/json" },
    });
  })
  .all("*", () => new Response("Not Found", { status: 404 }));

addEventListener("fetch", (event) => {
  const sentry = initSentry(event);
  event.respondWith(
    router.handle(event.request).catch((error: unknown) => {
      sentry.captureException(error);
      throw error;
    })
  );
});

addEventListener("scheduled", (event) => {
  const sentry = initSentry(event);

  event.waitUntil(
    handleCron().catch((error: unknown) => {
      sentry.captureException(error);
      throw error;
    })
  );
});
