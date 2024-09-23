export interface IAuthUser {
  nome: string;
  email: string;
  primeiroNome: string;
  segundoNome: string;
  id: string;
  nivel: string;
  empresa?: string;
  ativo: string;
  foto: string;
  currentPosition?: {
    lat: number;
    lng: number;
  };
}

export interface ILogin {
  accessToken: string;
  refreshToken: string;
  id: number;
  user: {
    email: string;
  };
}
