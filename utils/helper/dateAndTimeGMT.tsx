export function convertDateAndTimeToStringGMT(date, gmtFontSize = "0.85em") {
  const dateObj = new Date(date);

  // Format the date and time
  const formattedDate = dateObj.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Get the timezone offset in minutes
  const offsetMinutes = dateObj.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
  const offsetRemainingMinutes = Math.abs(offsetMinutes) % 60;

  // Format timezone offset as GMT-04:00 or GMT+02:30
  const gmtSign = offsetMinutes <= 0 ? "+" : "-";
  const gmt = `(GMT${gmtSign}${String(offsetHours).padStart(2, "0")}:${String(
    offsetRemainingMinutes
  ).padStart(2, "0")})`;

  return (
    <>
      {formattedDate}{" "}
      <span
        style={{ color: "gray", fontSize: gmtFontSize }}
        className="font-roboto font-medium text-para"
      >
        {gmt}
      </span>
    </>
  );
}
