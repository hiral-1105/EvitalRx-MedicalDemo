import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class SignupService {

  private signupUrl = 'https://api.evitalrx.in/v1/patient/login/signup';
  private authTokenKey = 'authToken';
  constructor(private http: HttpClient) {}

  // signup(signupData: SignupRequest): Observable<SignupResponse> {
  //   return this.http.post<SignupResponse>(this.signupUrl, signupData);
  // }

  signup(userData: any): Observable<any> {
    return this.http.post<any>(this.signupUrl, userData).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem(this.authTokenKey, response.token);
        }
      }),
      // catchError(this.handleError<any>('signup'))
    );
  }

}
