import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {MatDialogModule} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
@Component({
  selector: 'app-place-order',
  standalone: true,
  imports: [ CommonModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule, MatInputModule, FormsModule,
    MatSelectModule,ReactiveFormsModule
    ],

  templateUrl: './place-order.component.html',
 
  styleUrl: './place-order.component.scss'
})
export class PlaceOrderComponent {
  selectedMedicines: any[] =[]
  medicines = []; // Dynamic medicine data will be loaded here
  subtotal = 0;
  quantityOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; 
//   [
//     {
//         "medicine_id": "y8P5ElKQqfn/Dkb0uhE9Sg==",
//         "in_stock": "yes"
//     },
//     {
//         "medicine_id": "+ZqERHcCTAeuxsJheIXjyw==",
//         "in_stock": "no",
//         "alternatives": []
//     },
//     {
//         "medicine_id": "I446Nql4z13v8fTxtjx63g==",
//         "in_stock": "no",
//         "alternatives": [
//             {
//                 "medicine_id": "y8P5ElKQqfn/Dkb0uhE9Sg==",
//                 "medicine_name": "Ltk 50 Tablet",
//                 "mrp": 50,
//                 "packing_size": "1 Strip of  10 Tablet",
//                 "manufacturer_name": "Unison Pharmaceuticals Pvt Ltd",
//                 "content": "Losartan (50mg)"
//             }
//         ]
//     }
// ]

  constructor(private router: Router,public dialog: MatDialog) {}
  
  total: number = 0;
 
   

  ngOnInit() {
    const state = history.state;
    if (state && state.data) {
      this.selectedMedicines = state.data.availability.map((medicine: any) => ({
        ...medicine,
        quantity: 1, // Default quantity is 1 for each medicine
        manualQuantity: 1, // Default manual quantity if "10+" is selected
        showManualInput: false, // Hide manual input initially
        subtotal: medicine.mrp // Subtotal initialized to MRP for quantity 1
      }));
      this.calculateTotal();
    } else {
      console.error('No state data found');
    }
  }

  updateQuantity(index: number, value: number) {
    const selectedMedicine = this.selectedMedicines[index];

    if (value === 10) {
      selectedMedicine.showManualInput = true; // Show input field for quantities > 10
      selectedMedicine.manualQuantity = 1; // Default for manual input
    } else {
      selectedMedicine.showManualInput = false;
      selectedMedicine.quantity = value;
    }

    this.updateSubtotal(index);
  }

  updateManualQuantity(index: number, quantity: number) {
    if (quantity < 1) {
      quantity = 1; // Prevent quantity from being less than 1
    }
    this.selectedMedicines[index].manualQuantity = quantity; // Update manual quantity
    this.updateSubtotal(index);
  }

  updateSubtotal(index: number) {
    const medicine = this.selectedMedicines[index];
    const quantity = medicine.showManualInput ? medicine.manualQuantity : medicine.quantity;
    medicine.subtotal = medicine.mrp * quantity;
    this.calculateTotal();
  }

  // removeMedicine(index: number) {
  //   this.selectedMedicines.splice(index, 1);
  //   this.calculateTotal();
  // }

  calculateTotal() {
    this.total = this.selectedMedicines.reduce((acc, medicine) => acc + medicine.subtotal, 0);
  }

  placeOrder() {
    console.log("Placing order", this.selectedMedicines);
   this.router.navigate(['confirmation']);
 
  }
}