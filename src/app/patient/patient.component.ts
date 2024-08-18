import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../Services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [
     CommonModule,
     ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDatepickerModule,MatNativeDateModule],
    providers: [MatDatepickerModule],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.scss'
})
export class PatientComponent {
  patientForm: FormGroup;
  // errorMessage:any=''
constructor(
  private fb: FormBuilder,
  private authService: AuthService,
  private snackBar: MatSnackBar
){
  this.patientForm = this.fb.group({
    zipcode: ['', Validators.required],
    mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    first_name: ['', Validators.required],
    last_name: [''],
    dob: ['', Validators.pattern('^\\d{4}-\\d{2}-\\d{2}$')],
    gender: ['', Validators.required],
    blood_group: ['']
  });
}

onSubmit() {
  if (this.patientForm.valid) {
    this.authService.addPatient(this.patientForm.value).subscribe(
      (response) => {
        this.snackBar.open('Patient added successfully!', 'Close', {
          duration: 2000,
        });
        // Use the patient ID for further actions
         const patientId = response.data.patient_id;
        localStorage.setItem('PatientDetail',JSON.stringify(response.data))
        this.patientForm.reset();
      },
      (error) => {
        this.snackBar.open('Failed to add patient.', 'Close', {
          duration: 2000,
        });
      }
    );
  }
}

}
