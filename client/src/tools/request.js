import axios from 'axios';
import { domain } from './domain.js';
import CryptoJS from 'crypto-js';

const request = axios.create();

async function decrypt(encryptedData)
{
      const res = await axios.get(`http://${ domain }/getKey`);

      const bytes = CryptoJS.AES.decrypt(encryptedData, res.data.key);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      return JSON.parse(decryptedData);
}

request.interceptors.response.use(async (response) =>
{
      const decryptedData = await decrypt(response.data);
      return { ...response, data: decryptedData };
}, (error) =>
{
      return Promise.reject(error);
});

export default request;
