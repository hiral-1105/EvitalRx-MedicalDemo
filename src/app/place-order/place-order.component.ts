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
  medicines = [];
  subtotal = 0;
  total: number = 0;
  quantityOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
//  selectedMedicines:any =   [
//     {
//         "medicine_id": "y8P5ElKQqfn/Dkb0uhE9Sg==",
//         "in_stock": "yes",
//         "medicine_name": "Ltk 50 Tablet",
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
  ngOnInit() {
    const state = history.state;
    if (state && state.data) {
      this.selectedMedicines = state.data.availability.map((medicine: any) => ({
        ...medicine,
        quantity: 1,
        manualQuantity: 1,
        showManualInput: false,
        subtotal: medicine.mrp
      }));
      this.calculateTotal();
    } else {
      console.error('No state data found');
    }
  }

  updateQuantity(index: number, value: number) {
    const selectedMedicine = this.selectedMedicines[index];

    if (value === 10) {
      selectedMedicine.showManualInput = true;
      selectedMedicine.manualQuantity = 1;
    } else {
      selectedMedicine.showManualInput = false;
      selectedMedicine.quantity = value;
    }

    this.updateSubtotal(index);
  }

  updateManualQuantity(index: number, quantity: number) {
    if (quantity <= 1) {
      quantity = 1;
    }
    this.selectedMedicines[index].manualQuantity = quantity;
    this.updateSubtotal(index);
  }

  updateSubtotal(index: number) {
    const medicine = this.selectedMedicines[index];
    const quantity = medicine.showManualInput ? medicine.manualQuantity : medicine.quantity;
    medicine.subtotal = medicine.mrp * quantity;
    this.calculateTotal();
  }

  removeMedicine(index: number) {
    this.selectedMedicines.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(this.selectedMedicines));
    this.calculateTotal();
  }

  calculateTotal() {
    console.log("this.selectedMedicines",this.selectedMedicines);
    this.total = this.selectedMedicines.reduce((acc:any, medicine:any) => acc + medicine.subtotal, 0);
    console.log(" this.total ", this.total );

  }

  placeOrder() {
    console.log("Placing order", this.selectedMedicines);
    localStorage.setItem('cart', JSON.stringify(this.selectedMedicines));
   this.router.navigate(['confirmation']);

  }
}
