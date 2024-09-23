export interface IProfile {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  phone: string;
  photo: string;
  deviceInfo: any;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
  role: UserRole;
  currentPosition: any;
}
export enum UserRole {
  PROMOTER = 'promoter',
  SUPERVISOR = 'supervisor',
  ADMIN = 'admin'
}
