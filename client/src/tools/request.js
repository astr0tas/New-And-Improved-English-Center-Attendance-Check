import axios from 'axios';
import { publicKey, encrypt, decrypt } from './encryption';

const request = axios.create();

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