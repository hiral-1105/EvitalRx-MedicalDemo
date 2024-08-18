import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SignupService } from '../Services/signup.service';
import { CommonModule } from '@angular/common';
import { OtpService } from '../Services/otp.service';
import { HttpClientModule } from '@angular/common/http';



@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule, HttpClientModule],
  providers: [SignupService,OtpService],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  signupForm: FormGroup  = this.fb.group({
    mobile: ['', [Validators.required]],
    firstname: ['', [Validators.required]],
    lastname: [''],
    otp: ['', [Validators.required]],
    password: ['', [Validators.required]],
    os: ['android'],
    zipcode: ['', [Validators.minLength(6), Validators.maxLength(6)]]
  });
  constructor(
    private fb: FormBuilder,
    private signupService: SignupService,
   private otpService:OtpService
  ) {}

  get formControls() {
    return this.signupForm.controls as {
      mobile: AbstractControl;
      firstname: AbstractControl;
      lastname: AbstractControl;
      otp: AbstractControl;
      password: AbstractControl;
      os: AbstractControl;
      zipcode: AbstractControl;
    };
  }

  requestOtp() {
    // if (this.signupForm.valid) {
      // Get the form values
      const formData = this.signupForm.value;

      // Use form data for the OTP request
      this.otpService.sendOtp(formData.mobile, formData.firstname, formData.lastname).subscribe(
        response => {
          console.log('Response:', response);
          // Handle successful response
          // if (response.status_code === '1') {
          //   alert(response.status_message);  // Show success message
          // }
        },
        error => {
          console.error('Error:', error);
          // Handle error response
          alert('Failed to send OTP');  // Show error message
        }
      );
    // // } else {
    //   // If the form is invalid, show validation errors
    //   console.log('Form is invalid');
    //   this.signupForm.markAllAsTouched();  // Mark all fields as touched to display validation messages
    // }
  }
  onSignup() {
   if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    this.signupService.signup(this.signupForm.value).subscribe(
      (response) => {
        console.log('Signup Successful:', response);
        // Handle successful signup here
      },
      (error) => {
        console.error('Signup Failed:', error);
        // Handle error here
      }
    );
  }


}
