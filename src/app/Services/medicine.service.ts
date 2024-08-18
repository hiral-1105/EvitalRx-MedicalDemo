import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {
  private apiUrl = 'https://api.evitalrx.in/v1/doctor/medicines/search';

  constructor(private http: HttpClient) {}

  searchMedicines(query: string): Observable<any> {
    // return this.http.get<any>(`${this.apiUrl}?search=${query}`);
    const APIdata={
      apikey:'wFIMP75eG1sQEh8vVAdXykgzF4mLhDw3',
      data:query
    }
    return this.http.post(this.apiUrl, APIdata).pipe(
      tap((response: any) => {
        if (response.token) {

        }
      }),
      catchError(this.handleError)
    );
  }
}
