import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent implements OnInit {
  userProfile: any = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.restoreUserFromStorage();
    this.loadProfile();
  }

  restoreUserFromStorage(): void {
    const token = localStorage.getItem('jwt_token');
    const cachedPhoto = localStorage.getItem('profilePicture');

    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const decodedJson = JSON.parse(atob(payloadBase64));

        const username =
          decodedJson['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
          decodedJson['name'] ||
          decodedJson['unique_name'] ||
          decodedJson['sub'] ||
          decodedJson['username'] ||
          'Kullanıcı';

        this.userProfile = {
          username: username,
          profilePicture: cachedPhoto || null
        };
      } catch (e) {
        console.error('Token okunamadı:', e);
      }
    }
  }

  loadProfile(): void {
    this.authService.getProfile().subscribe({
      next: (data: any) => {
        if (data) {
          this.userProfile = data;
          if (data.profilePicture) {
            localStorage.setItem('profilePicture', data.profilePicture);
          }
          this.cdr.detectChanges(); 
        }
      },
      error: () => {
        if (!this.userProfile) {
          this.restoreUserFromStorage();
        }
      }
    });
  }
  

  openProfile(): void {
    const dialogRef = this.dialog.open(ProfileDialogComponent, {
      width: '450px',
      data: this.userProfile
    });

    dialogRef.afterClosed().subscribe((updated) => {
      if (updated) this.loadProfile();
    });
  }

  goHome(): void {
    this.router.navigate(['/todo']);
  }

  logout(): void {
    this.authService.logout();
    this.userProfile = null;
    this.router.navigate(['/login']);
  }
}
