import {create} from 'apisauce';

// define the api
const baseUrl = 'https://tripsterbackend.onrender.com';
// const baseUrl = 'https://ba11-116-68-100-184.ngrok-free.app';
const apiClient = create({
  baseURL: baseUrl,
});

export {apiClient, baseUrl};
