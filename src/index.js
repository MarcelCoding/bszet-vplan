import { Router } from "itty-router";
import { vPlanCron } from "./vplan";

const router = Router().all(
  "*",
  () => new Response("Not Found", { status: 404 })
);

addEventListener("fetch", (event) =>
  event.respondWith(router.handle(event.request))
);

addEventListener("scheduled", (event) => event.waitUntil(handleCron()));

async function handleCron() {
  return await vPlanCron();
}
