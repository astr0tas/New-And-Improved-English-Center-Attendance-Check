import axios from 'axios';
import { domain } from './domain.js';
import CryptoJS from 'crypto-js';

const request = axios.create();

async function decrypt(encryptedData)
{
      const key = await axios.get(`http://${ domain }/getKey`);
      // Decrypt the data
      const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, key.data.key);

      // Convert decrypted data to a string
      const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);

      // Convert to json format
      const decryptedJson = JSON.parse(decryptedData);

      return decryptedJson;
}

request.interceptors.response.use(async (response) =>
{
      console.log(response.data);
      const decryptedData = await decrypt(response.data);
      return { ...response, data: decryptedData };
}, (error) =>
{
      return Promise.reject(error);
});

export default request;
