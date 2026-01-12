import { Product } from '@/pages/product/product.model';
import { Model } from '@/pages/model/model.model';
import { Manufacturer } from '@/pages/manufacturer/manufacturer.model';


export interface FirmwareManagement {
    id?: number;
    version?: number;
    uploadDate?: string;
    uploadBy?: string;
    file: string;
    productId?: Product;
    product: Product;
    model: Model;
    manufacturer: Manufacturer;
    manufacturerId: any[];
    deviceUpdate?: number;
    image?: string;
    modelSupport?: string;
    firmwareVersion: string;
    description: string;
    fileFirmwareName: string;
    fileSize: number;
    modelId: any[];
    fileName: string;
    firmwareSupportedModels: Model[];
    status: boolean;
    batchList: any[];
    msnRunningUpdate: any;
}
export interface Models{
    id: number;
    code: string;
    name: string;
    status: boolean;
    batchList: any[]
}
