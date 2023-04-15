function formatTime(time)
{
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

      // If end time is before start time, add a day to end time
      // if (endTime < startTime)
      // {
      //       endTime.setDate(endTime.getDate() + 1);
      // }

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