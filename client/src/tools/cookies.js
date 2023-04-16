export function cookieExists(cookieName)
{
      const cookies = document.cookie.split('; ');
      for (let i = 0; i < cookies.length; i++)
      {
            const cookie = cookies[i].split('=');
            if (cookie[0] === cookieName)
            {
                  return true;
            }
      }
      return false;
}

export function getCookieValue(cookieName)
{
      const cookies = document.cookie.split('; ');
      for (let i = 0; i < cookies.length; i++)
      {
            const cookie = cookies[i].split('=');
            if (cookie[0] === cookieName)
            {
                  return decodeURIComponent(cookie[1]);
            }
      }
      return null;
}

export function deleteCookies()
{
      const cookies = document.cookie.split('; ');
      for (let i = 0; i < cookies.length; i++)
      {
            const cookie = cookies[i].split('=');           
            document.cookie = `${ cookie[0] } =; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;`;
      }
}