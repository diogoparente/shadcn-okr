import { Company } from "./Company";

export interface User {
  $id: string;
  name: string;
  email: string;
  image?: string;
}
