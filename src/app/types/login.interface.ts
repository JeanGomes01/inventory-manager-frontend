export interface ILogin {
  email: string;
  password: string;
}

export interface ILoginResponse {
  access_token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}
