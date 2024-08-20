import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ NgClass, MatButtonModule,MatTooltipModule,MatToolbarModule, MatIconModule, MatMenuModule,],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  patientData:any = false


  constructor(private router:Router,private snackBar: MatSnackBar){

  }
  ngOnInit() {
    if (typeof window !== 'undefined') {
      const patientDetailString = localStorage.getItem('PatientDetail');
      this.patientData = patientDetailString ? JSON.parse(patientDetailString) : false;
    }

  }
  onLogout(){}

  onSettings(){}


  goToCheckout() {
    if (this.patientData) {
      this.router.navigate(['/checkout']);
    } else {
      // Show a toaster message if patient data is missing
      this.snackBar.open('Please fill in the patient data before proceeding to checkout.', 'Close', {
        duration: 3000, // Duration for which the toaster will be visible
      });
    }
  }

  home(){
    this.router.navigate(['/dashboard']);
  }
}
