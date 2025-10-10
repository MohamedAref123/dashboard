import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 4000) {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: [`toast-${type}`] // 👈 dynamic CSS class
    });
  }

  success(message: string, duration = 3000) {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 4000) {
    this.show(message, 'error', duration);
  }

  info(message: string, duration = 3000) {
    this.show(message, 'info', duration);
  }

  /**
   * 👇 NEW METHOD: Show clickable toast that navigates to a route
   */
  showNavigation(message: string, route: string, type: 'success' | 'error' | 'info' = 'info', duration = 5000) {
    const snackRef = this.snackBar.open(message, 'View', {
      duration,
      panelClass: [`toast-${type}`, 'toast-clickable']
    });

    // 👇 When the user clicks the "View" action
    snackRef.onAction().subscribe(() => {
      this.router.navigateByUrl(route);
    });
  }
}
