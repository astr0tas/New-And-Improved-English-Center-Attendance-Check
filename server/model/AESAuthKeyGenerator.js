import CryptoJS from 'crypto-js';

let authKey = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);

function updateAuthKey()
{
      return setInterval(() =>
      {
            authKey = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
            console.log('Authentication AES key updated!');
      }, 2500);
}

export { authKey, updateAuthKey };