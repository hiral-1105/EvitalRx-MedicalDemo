import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { MatTabsModule } from '@angular/material/tabs';
import { filter } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
CommonModule,
    RouterModule,
    HeaderComponent,
    MatTabsModule,],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  currentTabIndex: number = 0;
  showTabs: boolean = true;
  constructor(private router: Router) {}
  ngOnInit() {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Hide tabs on specific routes
        this.showTabs = !event.url.includes('/checkout');
        this.showTabs = !event.url.includes('/place-order');
        this.updateTabIndex();
      }
    });
    this.updateTabIndex();
  }

  updateTabIndex() {
    const url = this.router.url;
    switch (true) {
      case url.includes('patient'):
        this.currentTabIndex = 3; // Index of "Patient_Data" tab
        break;
      case url.includes('about'):
        this.currentTabIndex = 1; // Index of "About" tab
        break;
      case url.includes('company'):
        this.currentTabIndex = 2; // Index of "Company" tab
        break;
      default:
        this.currentTabIndex = 0; // Index of "Dashboard" tab
        break;
    }

  }
  onTabChange(index: number) {

    switch (index) {
      case 0:
        this.router.navigate(['/dashboard']);
        break;
      case 1:
        this.router.navigate(['/about']);
        break;
      case 2:
        this.router.navigate(['/company']);
        break;
      case 3:
        this.router.navigate(['/patient']);
        break;
    }
  }
}
