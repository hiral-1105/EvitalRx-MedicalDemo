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
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateTabVisibilityAndIndex(event.url);
    });
    this.updateTabVisibilityAndIndex(this.router.url);
  };

  updateTabVisibilityAndIndex(url: string) {
    this.showTabs = !url.includes('/checkout') &&
                    !url.includes('/place-order') &&
                    !url.includes('/confirmation');


    if (url.includes('dashboard')) {
      this.currentTabIndex = 0;
    } else if (url.includes('patient')) {
      this.currentTabIndex = 1;
    } else if (url.includes('about')) {
      this.currentTabIndex = 2;
    } else if (url.includes('company')) {
      this.currentTabIndex = 3;
    } else {
      this.currentTabIndex = 0;
    }
  };

  onTabChange(index: number) {
    switch (index) {
      case 0:
        this.router.navigate(['/dashboard']);
        break;
      case 1:
        this.router.navigate(['/patient']);
        break;
      case 2:
        this.router.navigate(['/about']);
        break;
      case 3:
        this.router.navigate(['/company']);
        break;
    }
  };
}
