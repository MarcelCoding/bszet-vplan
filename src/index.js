import { vPlanCron } from "./vplan";

async function handleCron() {
  // if more, use Promise.all
  return vPlanCron();
}

addEventListener("scheduled", (event) => event.waitUntil(handleCron()));
