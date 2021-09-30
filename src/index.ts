import { Router } from "itty-router";
import { initSentry } from "./sentry";
import { getActualTimetable } from "./timetable";
import { fetchChanges } from "./changes";
import { vPlanCron } from "./vplan";
import Toucan from "toucan-js";

async function handleCron(sentry: Toucan): Promise<unknown> {
  // if more, use Promise.all
  return vPlanCron(sentry);
}

const router = Router()
  .get("/image/:id", (request) =>
    fetch(`https://pdf2img.schripke.xyz/img/${request.params?.id}`, {
      // @ts-ignore
      headers: { Authorization: `Bearer ${API_KEY}` },
    })
  )
  .get("/timetable/changes", async () => {
    return new Response(JSON.stringify(await fetchChanges()), {
      headers: { "Content-Type": "application/json" },
    });
  })
  .get("/timetable/:clazz", async (request) => {
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
        await getActualTimetable(clazz, date, await fetchChanges())
      ),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  })
  .get("/cron", async () => {
    return new Response(
      JSON.stringify(
        // @ts-ignore
        await handleCron({
          captureException: (e) => {
            throw e;
          },
        })
      )
    );
  })
  .all("*", () => new Response("Not Found", { status: 404 }));

addEventListener("fetch", (event) => {
  const sentry = initSentry(event);
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
