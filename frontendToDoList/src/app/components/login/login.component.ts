import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LoginRequest } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginRequest: LoginRequest = { email: '', password: '' };
  errorMessage: string = '';
  isEmailValid: boolean = true; 

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.isEmailValid) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }
    this.authService.login(this.loginRequest).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.errorMessage = err.error?.message || 'Login failed. Please try again.';
      }
    });
  }

  validateEmail(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.isEmailValid = emailRegex.test(this.loginRequest.email);
    if (!this.isEmailValid && this.loginRequest.email) {
      this.errorMessage = 'Please enter a valid email address.';
    } else if (this.errorMessage === 'Please enter a valid email address.') {
      this.errorMessage = '';
    }
  }
}
