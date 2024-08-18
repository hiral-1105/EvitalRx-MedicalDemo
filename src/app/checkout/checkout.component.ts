import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../Services/auth.service';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  standalone:true,
  imports:[
    CommonModule,
    MatButtonModule,
    MatListModule,
    FormsModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule, MatInputModule,],
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems: any[] = [];
  availability: any[] = [];
  constructor(
    private fb: FormBuilder,
    private router:Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.checkoutForm = this.fb.group({
      fullAddress: ['', Validators.required],
      latitude: [''],
      longitude: ['']
    });
  }

  ngOnInit(): void {
    // Load cart items from local storage
    this.cartItems = JSON.parse(localStorage.getItem('cart') || '[]');

  }
  removeFromCart(medicine: any) {
    this.cartItems = this.cartItems.filter(item => item.medicine_id !== medicine.medicine_id);
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.snackBar.open(`${medicine.medicine_name} removed from the cart!`, 'Close', {
      duration: 2000,
    });
  }
  onSubmit(): void {
    if (this.checkoutForm.valid) {
      const formData = this.checkoutForm.value;
      const requestPayload = {
        medicine_ids: JSON.stringify(this.cartItems.map(item => item.medicine_id)),
        full_address: formData.fullAddress,
        // latitude: formData.latitude,
        // longitude: formData.longitude
      };

      this.authService.checkout(requestPayload).subscribe(
        response => {
          if (response.status_code === '1') {
            this.router.navigate(['/place-order'], { state: { data: response.data } });
          }
        },
        error => {
          this.snackBar.open('Failed to Check Avability.', 'Close', { duration: 2000 });
        }
      );
    } else {
      this.snackBar.open('Please fill in all required fields.', 'Close', { duration: 2000 });
    }
  }
}
