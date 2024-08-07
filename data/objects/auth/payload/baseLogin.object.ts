import { LoginPayloadModel } from '../../../../types/auth/request/loginPayload.model';
import { UserModel } from '../../../../types/auth/user.model';

export const BaseLoginPayload = (user: UserModel): LoginPayloadModel => {
  return {
    username: user.username,
    password: user.password,
    expiresInMins: 10,
  };
};
