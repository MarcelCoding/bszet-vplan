import { Router } from "itty-router";
import { initSentry } from "./sentry";
import { getActualTimetable, getDefaultTimetable } from "./timetable";
import { fetchChanges } from "./changes";
import { vPlanCron } from "./vplan";
import Toucan from "toucan-js";
import {getIteration} from "./iteration";

async function handleCron(sentry: Toucan): Promise<void> {
  return await new Promise((resolve, reject) => {
    // if more, use Promise.all
    vPlanCron(sentry)
      .then(() => resolve())
      .catch(reject);
  });
}

const router = Router()
  .get("/image/:id", (request) =>
    fetch(`${API_URL}/img/${request.params?.id}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    })
  )
  .get("/timetable/changes", async (request) => {
    const key = request.query?.key;
    if (!key || key !== OWN_API_KEY) {
      return new Response("Bad Api Key", { status: 403 });
    }

    // @ts-ignore
    return new Response(JSON.stringify(await fetchChanges(request.sentry)), {
      headers: { "Content-Type": "application/json" },
    });
  })
  .get("/timetable/:clazz", async (request) => {
    const key = request.query?.key;
    if (!key || key !== OWN_API_KEY) {
      return new Response("Bad Api Key", { status: 403 });
    }

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

    return new Response(
      JSON.stringify(
        await getActualTimetable(
          clazz,
          date,
          // @ts-ignore
          await fetchChanges(request.sentry)
        ),
        (k, v) => (v === undefined ? null : v)
      ),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  })
  .get("/timetable/:clazz/default", async (request) => {
    const key = request.query?.key;
    if (!key || key !== OWN_API_KEY) {
      return new Response("Bad Api Key", { status: 403 });
    }

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

    const iteration = getIteration(date);
    if (!iteration) {
      throw new Error("Unable to gather iteration.");
    }

    return new Response(
      JSON.stringify(getDefaultTimetable(clazz, date,iteration), (k, v) =>
        v === undefined ? null : v
      ),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  })
  .all("*", () => new Response("Not Found", { status: 404 }));

addEventListener("fetch", (event) => {
  const sentry = initSentry(event);
  // @ts-ignore
  event.request.sentry = sentry;
  event.respondWith(
    router.handle(event.request).catch((error: unknown) => {
      sentry.captureException(error);
      // throw error;
      // @ts-ignore
      return new Response(`Internal Server Error: ${error.message}`, {
        status: 500,
      });
    })
  );
});

addEventListener("scheduled", (event) => {
  const sentry = initSentry(event);

  event.waitUntil(
    handleCron(sentry).catch((error: unknown) => {
      sentry.captureException(error);
      throw error;
    })
  );
});
