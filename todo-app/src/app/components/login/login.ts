import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  isRegisterMode = false;
  isLoading = false;

  loginData = { username: '', password: '' };
  registerData = { username: '', email: '', password: '' };

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
  }

  onLogin() {
    if (this.isLoading) return;
    this.isLoading = true;

    this.authService.login(this.loginData).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.authService.saveToken(res.token);
        this.router.navigate(['/todo']);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.snackBar.open(err.error?.message || 'Giriş başarısız!', 'Kapat', { duration: 3000 });
      }
    });
  }

  onRegister() {
    if (this.isLoading) return;
    this.isLoading = true;

    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open('Kayıt başarılı! Lütfen e-postanızı doğrulayın ve giriş yapın.', 'Tamam', { duration: 5000 });
        this.isRegisterMode = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.snackBar.open(err.error?.message || 'Kayıt başarısız!', 'Kapat', { duration: 3000 });
      }
    });
  }
}
