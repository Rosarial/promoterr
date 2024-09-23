export interface ILojas {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  cpf: string;
  cnpj: string;
  ativo: string;
  data_cad: string;
  data_pgto: string;
  valor: string;
  endereco: string;
  latitude: string;
  longitude: string;
  foto: string;
  close: string;
  open: string;
}
export interface IDTO<T> {
  status: string;
  statusCode: number;
  message: string;
  data: T;
}

export interface IStoreData {
  id: number;
  name: string;
  promoterId: number;
  cnpj: string;
  cpf: string;
  email: string;
  address: string;
  phone: string;
  latitude: string;
  longitude: string;
  registrationDate: Date;
  paymentDate: Date;
  value: number;
  active: string;
  createdAt: Date;
  updatedAt: Date;
  checkins: ICheckin[];
  foto?: string;
  distancePermited?: number;
  lastCheckinDate?: any;
  checkin?: ICheckin;
}

export interface ICheckin {
  id: number;
  userId: number;
  storeId: number;
  initialCheckinDate: Date;
  isDone: boolean;
  initialCheckin: boolean;
  location: null;
  deviceInfo: any;
  photoUrls: any;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: number;
    email: string;
    profile: {
      firstName: string;
      lastName: string;
    };
  };
}

export interface IChat {
  lastMessage: {
    id: number;
    message: string;
    createdAt: string;
  } | null;
  receiver: {
    id: number;
    userName: string;
    firstName?: string | null;
    lastName?: string | null;
    foto?: string;
  };
}
export interface IMessage {
  id: number;
  senderId: number;
  receiverId: number;
  message: string;
  createdAt: string;
  updatedAt: string;
}
