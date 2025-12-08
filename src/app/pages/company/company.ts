import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define an interface for type safety
export interface Employee {
    code: string;
    name: string;
    category: string;
    quantity: number;
    status: boolean;
}
export interface CategoryOption {
    label: string;
    value: string;
}

// Assuming json-server is running and serving this endpoint
const API_URL = 'http://localhost:3000/employees';

@Injectable({
    providedIn: 'root'
})
export class CompanyService { // Renamed for clarity

    constructor(private http: HttpClient) { }

    getEmployees(): Observable<Employee[]> {
        return this.http.get<Employee[]>(API_URL);
    }

    createEmployee(employee: Employee): Observable<Employee> {
        // NOTE: For json-server, the POST request is to the base URL
        return this.http.post<Employee>(API_URL, employee);
    }

    updateEmployee(employee: Employee): Observable<Employee> {
        // NOTE: For json-server, the PUT request includes the ID/Code in the URL
        const url = `${API_URL}/${employee.code}`;
        return this.http.put<Employee>(url, employee);
    }

    deleteEmployee(code: string): Observable<any> {
        const url = `${API_URL}/${code}`;
        return this.http.delete(url);
    }
}
