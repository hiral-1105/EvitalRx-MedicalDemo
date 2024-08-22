import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginRequest } from '../Model/login.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private cart: any[] = [];

    private tokenKey = 'authToken'; //
    apiUrl:any ='';
    private apiKey = 'wFIMP75eG1sQEh8vVAdXykgzF4mLhDw3';
  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,) {}

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
  login(data: LoginRequest): any {
console.log("data",data);

    return this.http.get<LoginRequest>
    ('http://localhost:3000/User'+'?mobile=' +`${data.mobile}&password=${data.password}`).pipe(
      map((response: LoginRequest | any) => {
        if (response && response.length > 0) {
          const user = response[0];
          console.log('Login successful:', user);
          // Save token or user data as needed
          localStorage.setItem(this.tokenKey, JSON.stringify(user));
          this.router.navigate(['dashboard'])
          this.snackBar.open('Welcome to Dashbaord of EvitalRx', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
          return user;
        } else {
           this.snackBar.open('Invalid credentials, please enter the correct data', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
          return null;
        }
      }),
      catchError(error => {
        console.error('Login failed', error);
        return of(null);
      })
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
