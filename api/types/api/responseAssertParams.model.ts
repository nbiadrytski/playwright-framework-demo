import { ObjectSchema } from 'yup';

export interface ResponseAssertParams {
  statusCode: number;
  schema?: ObjectSchema<any>;
}
