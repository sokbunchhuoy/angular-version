export interface MobileReward {
    id: string;
    code: string;
    name: string;
    price: number;
    category: string;
    status: string;
    merchant: Merchant;
}

export interface Merchant {
    id: number;
    merchantId: string;
    merchantName: string;
}


export interface MerchantOption {
    label: string;
    value: Merchant;
}
