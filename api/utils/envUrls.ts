import { SERVICE_NAME } from '../data/enums/appName';

export function getServiceUrl(serviceName: SERVICE_NAME): SERVICE_NAME {
  const urls: { [key: string]: string } = {
    authService: 'https://dummyjson.com',
  };

  if (!process.env.ENV_TYPE) throw Error('Не задана переменная окружения ENV_TYPE');

  return urls[serviceName] as SERVICE_NAME;
}
