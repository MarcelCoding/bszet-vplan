import { vPlanCron } from "./vplan";

async function handleCron(): Promise<unknown> {
  // if more, use Promise.all
  return vPlanCron();
}

addEventListener("scheduled", (event) => event.waitUntil(handleCron()));
