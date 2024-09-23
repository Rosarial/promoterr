export interface ILogin {
  accessToken: string;
  refreshToken: string;
  id: number;
  user: {
    email: string;
  };
}
