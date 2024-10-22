import { User } from './User';
import { Company } from './Company';

export interface OKR {
  id: string;
  title: string;
  description?: string;
  progress: number;
  userId: string;
  user: User;
  companyId?: string;
  company?: Company;
  parentId?: string;
  parent?: OKR;
  children: OKR[];
  createdAt: Date;
  updatedAt: Date;
}