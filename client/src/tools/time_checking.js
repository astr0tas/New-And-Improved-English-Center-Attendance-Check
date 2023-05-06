function formatTime(time)
{
      // format start and end time from hh:mm:ss to hh:mm
      const [hours, minutes] = time.split(':');
      return `${ hours }:${ minutes }`;
}


export function isCurrentTimeInRange(start, end)
{
      // format start and end time from hh:mm:ss to hh:mm
      start = formatTime(start);
      end = formatTime(end);

      const startTime = new Date();
      const endTime = new Date();
      const currentTime = new Date();

      // Set start time to today at the given start time
      startTime.setHours(parseInt(start.split(":")[0], 10));
      startTime.setMinutes(parseInt(start.split(":")[1], 10));
      startTime.setSeconds(0);
      startTime.setMilliseconds(0);

      // Set end time to today at the given end time
      endTime.setHours(parseInt(end.split(":")[0], 10));
      endTime.setMinutes(parseInt(end.split(":")[1], 10));
      endTime.setSeconds(0);
      endTime.setMilliseconds(0);

      // Check if current time is between start and end time
      return currentTime >= startTime && currentTime <= endTime;
}


export function isInWeekPeriod(date)
{
      date = new Date(date);
      const oneWeekAfter = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
      const currentDate = new Date();

      return currentDate >= date && currentDate <= oneWeekAfter;
}

export function getDate100DaysLater(date)
{
      // Convert the input date string to a Date object
      const inputDate = new Date(date);

      // Calculate the timestamp of the input date plus 100 days (in milliseconds)
      const timestamp100DaysLater = inputDate.getTime() + (100 * 24 * 60 * 60 * 1000);

      // Create a new Date object from the timestamp
      const date100DaysLater = new Date(timestamp100DaysLater);

      // Return the date string in the format "YYYY-MM-DD"
      return date100DaysLater.toISOString().slice(0, 10);
}