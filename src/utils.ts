const locale = "de";

const relativeTimeFormat = new Intl.RelativeTimeFormat(locale, {
  numeric: "auto",
  style: "long",
});

const dateTimeFormat = new Intl.DateTimeFormat(locale, {
  timeStyle: "short",
  dateStyle: "short",
  timeZone: "Europe/Berlin",
});

const longDateTimeFormat = new Intl.DateTimeFormat(locale, {
  timeStyle: "short",
  dateStyle: "full",
  timeZone: "Europe/Berlin",
});

export function formatRelativeTime(diff: number): string {
  const secDiff = diff / 1000;

  if (isInRange(-60, secDiff, 60)) {
    return relativeTimeFormat.format(Math.round(secDiff), "seconds");
  }

  const minDiff = secDiff / 60;

  if (isInRange(-60, minDiff, 60)) {
    return relativeTimeFormat.format(Math.round(minDiff), "minutes");
  }

  const hourDiff = minDiff / 60;

  if (isInRange(-24, hourDiff, 24)) {
    return relativeTimeFormat.format(Math.round(hourDiff), "hours");
  }

  return relativeTimeFormat.format(Math.round(hourDiff / 24), "days");
}

function isInRange(start: number, value: number, end: number) {
  return start < value && value < end;
}

export function formatDateTime(date: Date) {
  return dateTimeFormat.format(date);
}
export function formatLongDateTime(date: Date) {
  return longDateTimeFormat.format(date);
}

export async function pdf2Img(
  pdf: Blob,
  line1: string,
  line2: string,
  line3: string
): Promise<string[]> {
  const data = new FormData();
  data.append("file", pdf);

  const params = new URLSearchParams();
  params.append("top-text", line1);
  params.append("top2-text", line2);
  params.append("bottom-text", line3);

  const response = await fetch(
    // @ts-ignore
    `${API_URL}/pdf2img?${params.toString()}`,
    {
      method: "POST",
      body: data,
      // @ts-ignore
      headers: { Authorization: `Bearer ${API_KEY}` },
    }
  );

  if (response.status !== 200) {
    throw new Error(
      `Error while converting pdf file to images: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}
