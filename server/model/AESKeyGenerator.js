import CryptoJS from 'crypto-js';

let key = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);

function updateKey()
{
      return setInterval(() =>
      {
            key = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
            console.log('Key updated!');
      }, 5000);
}

export { key, updateKey };