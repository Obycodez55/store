import moment from "moment";

export function getMarketDays(prevDate: string, nextDate: string) {

    // Convert dates to moment objects
    const prev = moment(prevDate, 'YYYY-MM-DD');
    const next = moment(nextDate, 'YYYY-MM-DD');

    // Calculate the interval in days
    const interval = next.diff(prev, 'days');

    // Get today's date (ignoring time)
    const today = moment().startOf('day');

    // Find the last market day before today
    const lastMarketDay = prev.clone();
    while (lastMarketDay.isBefore(today)) {
        lastMarketDay.add(interval, 'days');
    }
    lastMarketDay.subtract(interval, 'days'); // Step back one interval

    // Find the next market day after today
    const nextMarketDay = lastMarketDay.clone().add(interval, 'days');

    return {
        interval,
        lastMarketDay: lastMarketDay.format('YYYY-MM-DD'),
        nextMarketDay: nextMarketDay.format('YYYY-MM-DD')
    };
}

// Example usage
try {
    const marketDays = getMarketDays('2021-10-01', '2021-10-06');
    console.log(marketDays);
} catch (error: any) {
    console.error(error.message);
}
