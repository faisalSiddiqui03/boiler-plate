import envConfig from './.env';

export const config = {
  "baseUrl": "/api/"
};

export const appConfig = {
  ...config,
  ...envConfig
};
