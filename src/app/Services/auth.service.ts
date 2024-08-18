import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginRequest } from '../Model/login.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private cart: any[] = [];

    private tokenKey = 'authToken'; //
    apiUrl:any ='';
    private apiKey = 'wFIMP75eG1sQEh8vVAdXykgzF4mLhDw3';
  constructor(private http: HttpClient, private router: Router) {}

  storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null;
  }

  // Handle HTTP errors
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  login(data: LoginRequest): Observable<any> {
     this.apiUrl = 'https://api.evitalrx.in/v1/patient/login';
    const APIdata={
      apikey:'wFIMP75eG1sQEh8vVAdXykgzF4mLhDw3',
      data:data
    }
    return this.http.post(this.apiUrl, APIdata).pipe(
      tap((response: any) => {
        if (response.token) {
          this.storeToken(response.token);
        }
      }),
      catchError(this.handleError)
    );
  }
  searchMedicines(query: any): Observable<any> {
    this.apiUrl = 'https://dev-api.evitalrx.in/v1/fulfillment/medicines/search';
  const APIdata={
    apikey:'wFIMP75eG1sQEh8vVAdXykgzF4mLhDw3',
    searchstring:query
  }
  return this.http.post(this.apiUrl, APIdata).pipe(
    tap((response: any) => {
      if (response.token) {
      }
  }),
  catchError(this.handleError)
);
  }

  addPatient(patientData: any): Observable<any> {
     patientData.apikey = this.apiKey
    this.apiUrl = 'https://dev-api.evitalrx.in/v1/fulfillment/patients/add';
    return this.http.post(this.apiUrl, patientData, );
  }

  addToCart(medicine: any, quantity: number = 1) {
    const existingItem = this.cart.find(item => item.medicine_id === medicine.medicine_id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({ ...medicine, quantity });
    }
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }
  checkout(payload: any): Observable<any> {
    payload.apikey = this.apiKey
    const apiUrl = 'https://dev-api.evitalrx.in/v1/fulfillment/orders/checkout';
    return this.http.post<any>(apiUrl, payload);
  }

  placeOrder(orderPayload: any): Observable<any> {
    orderPayload.apikey = this.apiKey
    const apiUrl = 'https://dev-api.evitalrx.in/v1/fulfillment/orders/place_order';
    return this.http.post<any>(apiUrl, orderPayload);
  }
}
