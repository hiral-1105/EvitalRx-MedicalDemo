import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

import { AuthService } from '../Services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  orderForm: FormGroup;
  isPatientIdAvailable: boolean;
  patientName: string | null = null;
  patientData:any
  patientId:any
  patientDetailString: string | null = null;
  medicines: any
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    // private dialogRef: MatDialogRef<PlaceOrderDialogComponent>,
   
  ) {
    this.isPatientIdAvailable = !localStorage.getItem('PatientDetail');
    
    this.orderForm = this.fb.group({
      full_address:[''],
      delivery_type: ['pickup', Validators.required],
      address: [''],
      address_line2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipcode: ['', Validators.required],
     
    });

    
  }
  ngOnInit(): void {
    // Fetch patient details from localStorage
    this.patientDetailString = localStorage.getItem('PatientDetail');
    if (this.patientDetailString) {
      this.patientData = JSON.parse(this.patientDetailString);
      this.patientId = this.patientData.patient_id;
    }
    const cartString = localStorage.getItem('cart');
  if (cartString) {
    const cartItems = JSON.parse(cartString);
    
     this.medicines = cartItems.map((item: any) => ({
      medicine_id: item.medicine_id, // Assuming `medicine_id` exists in the cart items
      quantity: item.quantity || 1 // Defaulting to 1 if quantity is not present
    }));
     console.log("  this.medicines",  this.medicines);
     
  }
  }
 
  onPlaceOrder() {
    if (this.orderForm.invalid) {
      return;
    }
  
    const orderData = {
      patient_id: this.patientId,
      items: JSON.stringify(this.medicines), // Adjust based on actual items data structure
      ...this.orderForm.value
    };
    // if (this.orderForm.value.delivery_type === 'delivery') {
    //   orderData.address = this.orderForm.value.address;
    //   orderData.address_line2 = this.orderForm.value.address_line2 || ''; // Optional field
    //   orderData.city = this.orderForm.value.city;
    //   orderData.state = this.orderForm.value.state;
    //   orderData.zipcode = this.orderForm.value.zipcode;
    // }
    this.authService.placeOrder(orderData).subscribe(response => {
      console.log('Order placed successfully', response);
      this.snackBar.open('Order placed successfully!', 'Close', { duration: 3000 });
      // Optionally, reset form or navigate to a different page
    }, error => {
      console.error('Order placement failed', error);
      this.snackBar.open('Order placement failed. Please try again.', 'Close', { duration: 3000 });
    });
  }
}