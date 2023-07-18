import axios from 'axios';
import { domain } from './domain.js';
import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';

const keys = new JSEncrypt();
keys.getKey();
const publicKey = keys.getPublicKey();

async function getKey()
{
      const res = await axios.post(`http://${ domain }/getKey`, { params: { key: publicKey } }, { headers: { 'Content-Type': 'application/json' } });
      const result = keys.decrypt(res.data.key, 'utf8');
      return result;
}

async function encrypt(data)
{
      if (data === null || data === undefined || data === '' || data === 'null' || data === 'undefined') return null;
      const key = await getKey();
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
      return encryptedData;
}

async function decrypt(encryptedData)
{
      if (encryptedData === null || encryptedData === undefined || encryptedData === '' || encryptedData === 'null' || encryptedData === 'undefined') return null;
      const key = await getKey();
      const bytes = CryptoJS.AES.decrypt(encryptedData, key);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return JSON.parse(decryptedData);
}

export { publicKey, encrypt, decrypt };