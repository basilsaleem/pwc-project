import {User} from '../page/model/user';

export interface JwtAuthData {
  accessToken: string;
  expiresIn: number;
  user: User;
  roles: [];
}
