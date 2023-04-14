import { useNavigate } from "react-router-dom";

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