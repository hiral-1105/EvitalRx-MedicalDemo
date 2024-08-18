import { Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './Guard/auth.guard';
import { AboutComponent } from './about/about.component';
import { CompanyComponent } from './company/company.component';
import { PatientComponent } from './patient/patient.component';
import { LayoutComponent } from './layout/layout.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PlaceOrderComponent } from './place-order/place-order.component';
import { PlaceOrderDialogComponent } from './place-order-dialog/place-order-dialog.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  // { path: 'dashboard', component: DashboardComponent ,canActivate: [AuthGuard]},
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'about', component: AboutComponent },
      { path: 'company', component: CompanyComponent },
      { path: 'patient', component: PatientComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'place-order', component: PlaceOrderComponent },
      { path: 'confirmation', component: PlaceOrderDialogComponent },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' }

    ]
  }

];
