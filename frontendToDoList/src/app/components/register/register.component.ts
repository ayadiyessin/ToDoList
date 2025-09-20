import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RegisterRequest } from '../../models/auth.model';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerRequest: RegisterRequest = { username: '', email: '', password: '' };
  errorMessage: string = '';
  isEmailValid: boolean = true;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.isEmailValid) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }
    this.checkEmailAvailability().then((exists) => {
      if (exists) {
        Swal.fire({
          icon: 'error',
          title: 'Email Already Taken',
          text: 'This email is already registered. Please use a different email.',
          confirmButtonText: 'OK'
        });
      } else {
        this.authService.register(this.registerRequest).subscribe({
          next: () => this.router.navigate(['/dashboard']),
          error: (err) => {
            this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
          }
        });
      }
    });
  }

  validateEmail(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.isEmailValid = emailRegex.test(this.registerRequest.email);
    if (!this.isEmailValid && this.registerRequest.email) {
      this.errorMessage = 'Please enter a valid email address.';
    } else if (this.errorMessage === 'Please enter a valid email address.') {
      this.errorMessage = '';
    }
  }

  private checkEmailAvailability(): Promise<boolean> {
    return new Promise((resolve) => {
      this.authService.checkEmail(this.registerRequest.email).subscribe({
        next: (response) => resolve(response.exists),
        error: () => resolve(false)
      });
    });
  }
}
