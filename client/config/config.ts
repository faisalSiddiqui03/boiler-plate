import envConfig from './.env';

export const config = {
};

export const appConfig = {
  ...config,
  ...envConfig
};
