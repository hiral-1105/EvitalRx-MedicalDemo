import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-place-order-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    FormsModule,

    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule,
  ],

  templateUrl: './place-order-dialog.component.html',
  styleUrl: './place-order-dialog.component.scss'
})
export class PlaceOrderDialogComponent {
  orderForm: FormGroup | any;
  patientId: string | undefined;
  medicines:any
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  private router:Router) {}

  ngOnInit(): void {
    // Initialize the form
    this.orderForm = this.fb.group({
      delivery_type: ['', Validators.required],
      address: ['',Validators.required],
      address_line2: ['',Validators.required],
      city: ['',Validators.required],
      state: ['',Validators.required],
      zipcode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      full_address: ['',Validators.required]
    });
    const patientDetail = localStorage.getItem('PatientDetail');
    if (patientDetail) {
      this.patientId = JSON.parse(patientDetail).patient_id;
    }
    const medicinesData = localStorage.getItem('cart');
    if (medicinesData) {
      try {
        this.medicines = JSON.parse(medicinesData);
      } catch (error) {
        console.error('Error parsing medicines data from localStorage', error);
        this.medicines = []; // Set to empty array or handle error as needed
      }
    } else {
      this.medicines = []; // Set to empty array if no data is found
    }

  }
  get isDelivery(): boolean {
    return this.orderForm.get('delivery_type')?.value === 'delivery';
  }

  onPlaceOrder() {
    if (this.orderForm?.invalid) {
      this.snackBar.open('Please fill in all required fields correctly.', 'Close', { duration: 3000 });
      return;
    }

    const orderData = {
      patient_id: this.patientId,
      items: JSON.stringify(this.medicines),
      ...this.orderForm?.value
    };

    this.authService.placeOrder(orderData).subscribe(response => {
      if(response.status_code == '1') {
        this.snackBar.open(response.status_message, 'Close', {
          duration: 2000,
        });
        this.orderForm?.reset();
        this.router.navigate(['/dashboard'])
      }else{
        this.snackBar.open(response.status_message, 'Close', {
          duration: 2000,
        });
      }
    }, error => {
      console.error('Order placement failed', error);
      this.snackBar.open('Order placement failed. Please try again.', 'Close', { duration: 3000 });
    });
  }
}
