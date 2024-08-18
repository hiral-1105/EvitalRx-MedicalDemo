import { Component } from '@angular/core';
import {FormControl,
  FormGroupDirective,
  NgForm, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginRequest, LoginResponse } from '../Model/login.interface';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MyErrorStateMatcher } from './my-error-state-matcher';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        HttpClientModule,
        MatButtonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
providers:[AuthService]
})

export class LoginComponent {
  errorMessage=''
  matcher = new MyErrorStateMatcher();
  loginForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService:AuthService,
    private router:Router)

     {
    this.loginForm = this.fb.group({
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', Validators.required],
    });
  }


  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
  const formData = this.loginForm.value as LoginRequest;
    this.authService.login(formData).subscribe(
    (response: LoginResponse) => {
        if (response.status_code === '1') {
          alert('Login successful!');
          localStorage.setItem('accessToken', JSON.stringify(response)); // Store the token
          this.router.navigate(['/dashboard']); // Navigate to dashboard after successful login
        } else {
          // Show error using MatSnackBar
          this.snackBar.open(response.status_message, 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
        }
    },
    )}

}

