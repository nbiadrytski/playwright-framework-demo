import { UserModel } from '../../../../../common/types/user.model';
import { LoginPayloadModel } from '../../../../types/auth/request/loginPayload.model';

export const BaseLoginPayload = (user: UserModel): LoginPayloadModel => {
  return {
    username: user.username,
    password: user.password,
    expiresInMins: 10,
  };
};
