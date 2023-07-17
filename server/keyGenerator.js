import CryptoJS from 'crypto-js';

let key = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
setInterval(() =>
{
      key = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
}, 5000);

export { key };
