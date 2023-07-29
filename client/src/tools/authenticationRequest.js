import axios from 'axios';
import JSEncrypt from 'jsencrypt';
import { domain } from './domain';
import CryptoJS from 'crypto-js';

const keys = new JSEncrypt();
keys.getKey();
const publicKey = keys.getPublicKey();

async function getKey()
{
      const res = await axios.post(`http://${ domain }/getAuthKey`, { params: { key: publicKey } }, {  headers: { 'Content-Type': 'application/json' } });
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

const authRequest = axios.create();

authRequest.interceptors.request.use(async (config) =>
{
      if (config.method === 'post')
      {
            const encryptedData = await encrypt(config.data);
            config.data = { key: publicKey, data: encryptedData };
      }
      return config;
}, (error) =>
{
      return Promise.reject(error);
});

export default authRequest;