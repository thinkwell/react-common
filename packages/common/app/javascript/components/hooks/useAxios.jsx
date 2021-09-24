import React, { useContext } from 'react';
import axios from 'axios';
import { getSessionToken } from "@shopify/app-bridge-utils";
import { useAppBridge } from '@shopify/app-bridge-react';

export default function useAxios (props) {
  const app = useAppBridge();

  const instance = axios.create();
  // Intercept all requests on this Axios instance
  instance.interceptors.request.use(function (config) {
    return getSessionToken(app) // requires a Shopify App Bridge instance
      .then((token) => {
        // Append your request headers with an authenticated token
        config.headers["Authorization"] = `Bearer ${token}`;
        return config;
      });
  });

  return instance
}
