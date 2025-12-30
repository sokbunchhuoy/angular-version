
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { TerminalModel } from './terminal.model';

@Injectable({
    providedIn: 'root'
})
export class TerminalPostService {
// API endpoint as seen in your console
    private apiUrl = 'http://localhost:3000/terminal';

    terminal = signal<TerminalModel[]>([]);
    loading = signal<boolean>(false);

    constructor(private http: HttpClient) {}

    // Add this method to fix the error in image_84a102.png
    getById(id: string | number): Observable<TerminalModel> {
        return this.http.get<TerminalModel>(`${this.apiUrl}/${id}`);
    }

    // Existing methods...
    getTerminals(name?: string, status?: boolean): Observable<TerminalModel[]> {
        this.loading.set(true);

        let params = new URLSearchParams();
        if (name) params.append('name', name);

        // Check for null/undefined explicitly because 'false' is a valid value
        if (status !== undefined && status !== null) {
            params.append('status', status.toString());
        }

        const url = params.toString() ? `${this.apiUrl}?${params.toString()}` : this.apiUrl;

        return this.http.get<TerminalModel[]>(url).pipe(
            tap((res) => {
                this.terminal.set(res);
                this.loading.set(false);
            })
        );
    }

    create(data: TerminalModel): Observable<TerminalModel> {
        return this.http.post<TerminalModel>(this.apiUrl, data);
    }

    update(id: string | number, data: TerminalModel): Observable<TerminalModel> {
        return this.http.put<TerminalModel>(`${this.apiUrl}/${id}`, data);
    }

    delete(id: string | number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

}
