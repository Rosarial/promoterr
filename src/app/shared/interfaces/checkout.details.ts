export interface ICheckoutDetatils {
  id: number;
  storeId: number;
  checkinId: number;
  needRestock: boolean;
  restockProducts?: IProduct[];
  hasDamage: boolean;
  damageProducts?: IProductDamager[];
  createdAt: Date;
  updatedAt: Date;
  checkin: Checkin;
}
export interface IProductDamager {
  product: {
    id: number;
    name: string;
    availableQuantity: number;
    createdAt: string;
    updatedAt: string;
  };
  damageDescription: string;
  damagePhoto: {
    base64Data: string;
    name: string;
    id: string;
    date: string;
    url?: string;
  };
}
export interface IProduct {
  product: {
    id: number;
    name: 'Produto 2';
    availableQuantity: number;
    createdAt: string;
    updatedAt: string;
  };
  quantity: number;
}

export interface Checkin {
  id: number;
  userId: number;
  storeId: number;
  initialCheckinDate: Date;
  isDone: boolean;
  initialCheckin: boolean;
  location: null;
  deviceInfo: string;
  photoUrls: string;
  createdAt: Date;
  updatedAt: Date;
}
[
  {
    product: {
      id: 4,
      name: 'Produto 4',
      availableQuantity: 400,
      createdAt: '2024-07-19T01:54:36.000Z',
      updatedAt: '2024-07-19T01:54:36.000Z'
    },
    damageDescription: '212',
    damagePhoto: {
      name: 'damage',
      id: '172f1174-d922-49a0-aaa4-9973786938f6',
      date: '2024-07-19T02:19:50.711Z'
    }
  },
  {
    product: {
      id: 3,
      name: 'Produto 3',
      availableQuantity: 300,
      createdAt: '2024-07-19T01:54:36.000Z',
      updatedAt: '2024-07-19T01:54:36.000Z'
    },
    damageDescription: 'sdsadasdasdasd',
    damagePhoto: {
      name: 'damage',
      id: '7af6f8bb-eba8-43af-8f86-68441a6b3a1d',
      date: '2024-07-19T02:20:12.084Z'
    }
  },
  {
    product: {
      id: 5,
      name: 'Produto 5',
      availableQuantity: 500,
      createdAt: '2024-07-19T01:54:36.000Z',
      updatedAt: '2024-07-19T01:54:36.000Z'
    },
    damageDescription: 'dasdasdasdas',
    damagePhoto: {
      name: 'damage',
      id: 'b4a7122d-efea-49d7-a25d-a42da6871c38',
      date: '2024-07-19T02:20:25.849Z'
    }
  }
];
