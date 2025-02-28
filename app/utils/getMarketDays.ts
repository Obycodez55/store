import moment from "moment";

export function getMarketDays(prevDate: string, inputInterval: string) {
  // Convert dates to moment objects

  if (!inputInterval) {
    throw new Error("Interval is required");
  }
  if (inputInterval.toLowerCase() === "daily") {
    return {
      interval: 1,
      lastMarketDay: moment().format("YYYY-MM-DD"),
      nextMarketDay: moment().add(1, "day").format("YYYY-MM-DD"),
    };
  }
  const prev = moment(prevDate, "YYYY-MM-DD");
  // Calculate the interval in days
  //   const interval = next.diff(prev, "days");
  // interval is in form 3 DAY, extract 3
  const interval = parseInt(inputInterval.split(" ")[0]);

  // Get today's date (ignoring time)
  const today = moment().startOf("day");

  // Find the last market day before today
  const lastMarketDay = prev.clone();
  // Calculate days between prev date and today and determine last market day directly
  const daysDiff = today.diff(prev, "days");
  const intervalsCount = Math.floor(daysDiff / interval);
  lastMarketDay.add(intervalsCount * interval, "days");
  lastMarketDay.subtract(interval, "days"); // Step back one interval

  // Find the next market day after today
  const nextMarketDay = lastMarketDay.clone().add(interval - 1, "days");

  return {
    interval,
    lastMarketDay: lastMarketDay.format("YYYY-MM-DD"),
    nextMarketDay: nextMarketDay.format("YYYY-MM-DD"),
  };
}
