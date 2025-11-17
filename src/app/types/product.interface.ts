import { IMovement } from './movement.interface';

export interface IProduct {
  id: number;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  category?: string | null;
  movements?: IMovement[];
}
