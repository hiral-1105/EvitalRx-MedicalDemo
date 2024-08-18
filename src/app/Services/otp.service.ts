import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OtpService {
  private apiUrl = 'https://api.evitalrx.in/v1/patient/login/signup_sendotp';
  private apikey = 'your-api-key';

  constructor(private http: HttpClient) { }


  sendOtp(mobile: string, firstname: string, lastname: string): Observable<any> {
    const payload = {
      // apikey: 'wFIMP75eG1sQEh8vVAdXykgzF4mLhDw3', 
      mobile,
      firstname,
      lastname
    };

    return this.http.post<any>(this.apiUrl, payload);
  }
}
