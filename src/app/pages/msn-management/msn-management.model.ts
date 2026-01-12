import { Manufacturer } from '@/pages/manufacturer/manufacturer.model';
import { Model } from '@/pages/model/model.model';
import { Product } from '@/pages/product/product.model';

export interface MsnManagement {
    id?: number,
    code?: string;
    manufacturerId?: Manufacturer,
    productId?: Product,
    modelId?: Model,
    manufacturer?: Manufacturer,
    product?: Product,
    model?: Model,
    batchNo?: number,
    qty?: number,
    mappedQty?: number,
    lastMsnNumber?: number,
    description?: string,
    generateDate?: string,
    status?: number,
    version?: number,
    msnCodes?: any;
    createdBy?: string;
}



