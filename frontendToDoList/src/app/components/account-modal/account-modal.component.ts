import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { RegisterRequest } from '../../models/auth.model';

@Component({
  selector: 'app-account-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule],
  templateUrl: './account-modal.component.html',
  styleUrl: './account-modal.component.css'
})
export class AccountModalComponent {
  @Input() account: RegisterRequest = { username: '', email: '', password: '' };
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(public activeModal: NgbActiveModal) {}

  save(): void {
    if (this.account.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }
    if (!this.account.username || !this.account.email || !this.account.password) {
      this.errorMessage = 'All fields are required!';
      return;
    }
    this.errorMessage = '';
    this.activeModal.close(this.account);
  }

  cancel(): void {
    this.activeModal.dismiss('cancel');
  }
}
