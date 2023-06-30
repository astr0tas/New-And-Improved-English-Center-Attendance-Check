// Check if the specify cookie exists
export function checkCookie(cookieName)
{
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++)
      {
            var cookie = cookies[i].trim();
            if (cookie.indexOf(cookieName + '=') === 0)
            {
                  return true;
            }
      }
      return false;
}