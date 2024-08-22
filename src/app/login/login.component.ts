import { Component } from '@angular/core';
import {FormControl,
  FormGroupDirective,AbstractControl,
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
import {MatIconModule} from '@angular/material/icon';
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
        MatButtonModule,
        MatIconModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
providers:[AuthService]
})

export class LoginComponent {
  errorMessages: string[] = [];
    matcher = new MyErrorStateMatcher();
  loginForm: FormGroup
  hidePassword: boolean = true;
  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService:AuthService,
    private router:Router)

     {
    this.loginForm = this.fb.group({
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['',[Validators.required,
        Validators.minLength(8),
        this.passwordUppercaseValidator,
        this.passwordLowercaseValidator,
        this.passwordNumberValidator,
        this.passwordSpecialCharValidator
      ]],
    });
  }

  ngOnInit(): void {
    this.loginForm.get('password')?.valueChanges.subscribe(() => {
      this.updateErrorMessages();
    });


  }
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
  passwordUppercaseValidator(control: AbstractControl) {
    const regex = /[A-Z]/;
    if (!regex.test(control.value)) {
      return { uppercase: true };
    }
    return null;
  }

  passwordLowercaseValidator(control: AbstractControl) {
    const regex = /[a-z]/;
    if (!regex.test(control.value)) {
      return { lowercase: true };
    }
    return null;
  }

  passwordNumberValidator(control: AbstractControl) {
    const regex = /[0-9]/;
    if (!regex.test(control.value)) {
      return { number: true };
    }
    return null;
  }

  passwordSpecialCharValidator(control: AbstractControl) {
    const regex = /[@$!%*?&]/;
    if (!regex.test(control.value)) {
      return { specialChar: true };
    }
    return null;
  }
  updateErrorMessages() {
    this.errorMessages = [];

    const passwordErrors = this.loginForm.get('password')?.errors;
    if (passwordErrors) {
      if (passwordErrors['required']) {
        this.errorMessages.push('Password is required.');
      }
      if (passwordErrors['minlength']) {
        this.errorMessages.push('Password must be at least 8 characters long.');
      }
      if (passwordErrors['uppercase']) {
        this.errorMessages.push('Password must include at least one uppercase letter.');
      }
      if (passwordErrors['lowercase']) {
        this.errorMessages.push('Password must include at least one lowercase letter.');
      }
      if (passwordErrors['number']) {
        this.errorMessages.push('Password must include at least one number.');
      }
      if (passwordErrors['specialChar']) {
        this.errorMessages.push('Password must include at least one special character (@$!%*?&).');
      }
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
  const formData = this.loginForm.value as LoginRequest;
    this.authService.login(formData).subscribe(
    (response: LoginResponse) => {
          alert('Login successful!');
          localStorage.setItem('accessToken', JSON.stringify(response)); // Store the token
          this.router.navigate(['/dashboard']); // Navigate to dashboard after successful login

    },
    )}

}

