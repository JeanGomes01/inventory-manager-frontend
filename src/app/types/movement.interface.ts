import { MovementsType } from './enums/movements-type.enum';

export interface IMovement {
  id: number;
  productId: number;
  productName?: string;
  type: MovementsType;
  price: number;
  quantity: number;
  createdAt: string;
}
