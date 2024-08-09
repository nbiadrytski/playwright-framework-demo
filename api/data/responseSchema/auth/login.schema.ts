import { number, object, ObjectSchema, string } from 'yup';

export const LoginSchema: ObjectSchema<any> = object(
  {
    id: number().required(),
    username: string().required(),
    email: string().email().required(),
    firstName: string().required(),
    lastName: string().required(),
    gender: string().required(),
    image: string().url().required(),
    token: string().required().length(360),
    refreshToken: string().required().length(360),
  }
);
