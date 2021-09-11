const relativeFormat = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
  style: "long",
});

export function formatRelativeTime(diff) {
  const secDiff = diff / 1000;

  if (isInRange(-60, secDiff, 60)) {
    return relativeFormat.format(Math.round(secDiff), "seconds");
  }

  const minDiff = secDiff / 60;

  if (isInRange(-60, minDiff, 60)) {
    return relativeFormat.format(Math.round(minDiff), "minutes");
  }

  const hourDiff = minDiff / 60;

  if (isInRange(-24, hourDiff, 24)) {
    return relativeFormat.format(Math.round(hourDiff), "hours");
  }

  return relativeFormat.format(Math.round(hourDiff / 24), "days");
}

function isInRange(start, value, end) {
  return start < value && value < end;
}
