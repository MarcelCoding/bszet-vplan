import Toucan from "toucan-js";

export function initSentry(
  event: FetchEvent | ScheduledEvent,
  additionalOptions = {}
) {
  const sentry = new Toucan({
    // @ts-ignore
    dsn: SENTRY_DSN,
    event: event,
    allowedHeaders: [
      "user-agent",
      "cf-challenge",
      "accept-encoding",
      "accept-language",
      "cf-ray",
      "content-length",
      "content-type",
      "x-real-ip",
      "host",
    ],
    allowedSearchParams: /(.*)/,
    rewriteFrames: {
      root: "/",
    },
    release: "development",
    ...additionalOptions,
  });

  // Set the type (fetch event or scheduled event)
  sentry.setTag("type", event.type);

  if (event instanceof FetchEvent) {
    const request = event.request;

    const colo = request.cf && request.cf.colo ? request.cf.colo : "UNKNOWN";
    sentry.setTag("colo", colo);

    // cf-connecting-ip should always be present, but if not we can fallback to XFF.
    const ip =
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-forwarded-for");
    const userAgent = request.headers.get("user-agent") || "";
    sentry.setUser({ ip, userAgent, colo });
  }

  return sentry;
}
