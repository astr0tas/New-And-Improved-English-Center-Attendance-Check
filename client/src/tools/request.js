import axios from 'axios';
import { domain } from './domain.js';
import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';

const keys = new JSEncrypt();
keys.getKey();
const publicKey = keys.getPublicKey();

const request = axios.create();

async function getKey()
{
      const res = await axios.post(`http://${ domain }/getKey`, { params: { key: publicKey } }, { headers: { 'Content-Type': 'application/json' } });
      const result = keys.decrypt(res.data.key, 'utf8');
      return result;
}

async function encrypt(data)
{
      const key = await getKey();
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
      return encryptedData;
}

async function decrypt(encryptedData)
{
      const key = await getKey();
      const bytes = CryptoJS.AES.decrypt(encryptedData, key);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return JSON.parse(decryptedData);
}

request.interceptors.request.use(async (config) =>
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

request.interceptors.response.use(async (response) =>
{
      const decryptedData = await decrypt(response.data);
      return { ...response, data: decryptedData };
}, (error) =>
{
      return Promise.reject(error);
});

export default request;
