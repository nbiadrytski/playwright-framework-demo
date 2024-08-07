import { ENV_TYPES } from '../enums/envType';

export const ENV_TYPE: ENV_TYPES = process.env.ENV_TYPE as ENV_TYPES;

export const AUTH_USERNAME = process.env.AUTH_USER?.split('/')[0] as string;
export const AUTH_PASSWORD = process.env.AUTH_USER?.split('/')[1] as string;
