import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
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
@Injectable({
    providedIn: 'root'
})
export class ListProductService {
    private apiUrl = 'http://localhost:3000/products';

    constructor(private http: HttpClient) {}

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.apiUrl);
    }

    createProduct(product: Product): Observable<Product> {
        return this.http.post<Product>(this.apiUrl, product);
    }

    updateProduct(product: Product): Observable<Product> {
        return this.http.put<Product>(`${this.apiUrl}/${product.id}`, product);
    }

    deleteProduct(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
// --- Simplified Service for JSON-Server ---
    getMerchants(): Observable<Merchant[]> {
        const MERCHANT_API_URL = 'http://localhost:3000/merchant';
        // Expect the array directly
        return this.http.get<Merchant[]>(MERCHANT_API_URL);
    }
}
