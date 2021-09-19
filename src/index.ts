import { vPlanCron } from "./vplan";
import { Router } from "itty-router";
import { initSentry } from "./sentry";

async function handleCron(): Promise<unknown> {
  // if more, use Promise.all
  return vPlanCron();
}

const router = Router()
  .get("/image/:id", (request) =>
    // @ts-ignore
    fetch(`${API_URL}/img/${request.params?.id}`, {
      // @ts-ignore
      headers: { Authorization: `Bearer ${API_KEY}` },
    })
  )
  .get("/error", () => Promise.reject(new Error("Test123")))
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
