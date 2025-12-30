export interface Store {
    id?: number;
    storeName: string;
    storeCode: string;
}

export interface Merchant {
    id?: number;
    merchantName: string;
    merchantCode: string;
}

export interface TerminalModel {
    id?: number;
    name: string;
    serialNumber: string;
    model: string;
    type: string;
    status: boolean;
    store: Store[];
    merchant: Merchant[];
}
