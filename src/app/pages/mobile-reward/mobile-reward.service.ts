import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Merchant, MobileReward } from '@/pages/mobile-reward/mobile-reward.model';


@Injectable({
    providedIn: 'root'
})
export class MobileRewardService {
    private apiUrl = 'http://localhost:3000/mobile-reward';

    constructor(private http: HttpClient) {}

    getMobileReward(): Observable<MobileReward[]> {
        return this.http.get<MobileReward[]>(this.apiUrl);
    }

    create(product: MobileReward): Observable<MobileReward> {
        return this.http.post<MobileReward>(this.apiUrl, product);
    }

    update(product: MobileReward): Observable<MobileReward> {
        return this.http.put<MobileReward>(`${this.apiUrl}/${product.id}`, product);
    }

    delete(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
// --- Simplified Service for JSON-Server ---
    getMerchants(): Observable<Merchant[]> {
        const MERCHANT_API_URL = 'http://localhost:3000/merchant';
        // Expect the array directly
        return this.http.get<Merchant[]>(MERCHANT_API_URL);
    }
}
