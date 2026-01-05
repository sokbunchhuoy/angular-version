import { Product } from '@/pages/product/product.model';

export interface Model {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    logo?: string;
    productId?: Product;
    product?: Product;
    major?: string;
    minor?: string;
    batchModel: BatchModel[];
}
export interface BatchModel {
    id: number;
    batch: string;
    modelId: number;
}
