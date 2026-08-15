import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-profile-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './profile-dialog.html',
  styleUrl: './profile-dialog.scss'
})
export class ProfileDialogComponent implements OnInit {
  profileData = {
    username: '',
    email: '',
    newPassword: '',
    profilePicture: ''
  };
  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<ProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.profileData.username = this.data.username || '';
      this.profileData.email = this.data.email || '';
      this.profileData.profilePicture = this.data.profilePicture || '';
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileData.profilePicture = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSave(): void {
    if (this.isLoading) return;
    this.isLoading = true;

    this.authService.updateProfile(this.profileData).subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open('Profil güncellendi.', 'Tamam', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open(err.error?.message || 'Güncelleme hatası!', 'Kapat', { duration: 3000 });
      }
    });
  }
}
