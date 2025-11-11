export interface IMovement {
  id: number;
  productId: number;
  productName?: string;
  type: 'entrada' | 'saida';
  quantity: number;
  createdAt: string;
}
