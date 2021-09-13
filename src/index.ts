import { vPlanCron } from "./vplan";
import { Router } from "itty-router";

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
  .all("*", () => new Response("Not Found", { status: 404 }));

addEventListener("scheduled", (event) => event.waitUntil(handleCron()));
addEventListener("fetch", (event) =>
  event.respondWith(router.handle(event.request))
);
