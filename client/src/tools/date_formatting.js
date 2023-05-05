export function format(date)
{
      // "2023-01-29T17:00:00.000Z" to "30/01/2023"
      return new Date(date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
      });
}

export function detailFormat(date)
{
      // "2023-01-30T17:00:00.000Z" to "Tuesday, January 31, 2023"
      return new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatDate(dateString)
{
      // "2023-01-30T17:00:00.000Z" to "2023-01-30"
      const date = new Date(dateString);
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      month = month < 10 ? `0${ month }` : month;
      day = day < 10 ? `0${ day }` : day;
      return `${ year }-${ month }-${ day }`;
}