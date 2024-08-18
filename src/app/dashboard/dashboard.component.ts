import { Component, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { AuthService } from '../Services/auth.service';
import { MatButtonModule } from '@angular/material/button';

import { Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
 import { Medicine } from '../Model/medicine.interface';
 import {MatPaginatorModule} from '@angular/material/paginator';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,
    MatFormFieldModule,
    MatCardModule ,
    FormsModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers:[AuthService]
})
export class DashboardComponent {
  currentTabIndex: number = 0; // Index of the currently active tab
  medicines: any[] = [];
  searchQuery: string = '';
  isSearchActive= false
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<Medicine>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator ;
  @ViewChild(MatSort) sort!: MatSort;
  private searchTerms = new Subject<string>();
  constructor(
    private authService: AuthService,
    private router:Router,
    private snackBar: MatSnackBar
  ) {

  this.searchTerms.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((term :any)=> this.authService.searchMedicines(term))
  ).subscribe((results:any) => {
    this.medicines = results;
  });
}

searchMedicines(query: Event) {
  const inputElement = query.target as HTMLInputElement;
    const value = inputElement.value.trim();
    this.isSearchActive = true;
    if (value.trim() === '') {
      this.dataSource.data = [];
    }
  this.authService.searchMedicines(value).subscribe(
    response => {
      if (response && response.data) {
        this.dataSource.data = response.data.result
      } else {
        this.dataSource.data = [];
      }
    },
    error => {
      console.error('Error fetching medicines', error);
      // Optionally handle error
      this.dataSource.data = [];
      this.displayedColumns = [];
    }
  );
}

addToCart(medicine: any) {
  this.authService.addToCart(medicine);
  this.snackBar.open(`${medicine.medicine_name} added to the cart!`, 'Close', {
    duration: 2000,
  });
}
}

