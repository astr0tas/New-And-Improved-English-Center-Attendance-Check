export function DMY(date)
{
      // "2023-01-29T17:00:00.000Z" to "30/01/2023"
      return new Date(date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
      });
}

export function DMDY(date)
{
      // "2023-01-30T17:00:00.000Z" to "Tuesday, January 31, 2023"
      return new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export function YMD(dateString)
{
      // 30/01/2023 to 2023-01-30
      if (dateString.includes('/'))
      {
            const date = dateString.split('/');
            return `${ date[2] }-${ date[1] }-${ date[0] }`;
      }
      // "2023-01-30T17:00:00.000Z" to "2023-01-30"
      const date = new Date(dateString);
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      month = month < 10 ? `0${ month }` : month;
      day = day < 10 ? `0${ day }` : day;
      return `${ year }-${ month }-${ day }`;
}