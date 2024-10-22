import { User } from './User';
import { OKR } from './OKR';

export interface Company {
  id: string;
  name: string;
  description?: string;
  users: User[];
  okrs: OKR[];
  createdAt: Date;
  updatedAt: Date;
}