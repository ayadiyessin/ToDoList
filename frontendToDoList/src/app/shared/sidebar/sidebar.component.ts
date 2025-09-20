import { Component, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RegisterRequest } from '../../models/auth.model';
import { AccountModalComponent } from '../../components/account-modal/account-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  companyName = 'TodoApp';
  userName: string | null = null;
  isCollapsed = false;

  navItems = [
    { icon: 'bi bi-list-ul', label: 'To-Do List', route: '/dashboard' },
  ];

  constructor(
    private modalService: NgbModal,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userName = this.authService.getUsername();
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    sidebar?.classList.toggle('show', !this.isCollapsed);
  }

  openAccountModal(): void {
    const initialAccount: RegisterRequest = {
      username: this.authService.getUsername() || 'currentUser',
      email: this.authService.getEmail() || 'user@example.com',
      password: ''
    };
    const modalRef = this.modalService.open(AccountModalComponent);
    modalRef.componentInstance.account = { ...initialAccount };

    modalRef.result.then(
      (result: RegisterRequest) => {
        if (result) {
          console.log('Account updated:', result);
          this.authService.setAuthData({ token: this.authService.getToken() || '', email: result.email, username: result.username });
          this.userName = result.username;
        }
      },
      (reason) => {
        console.log('Modal closed:', reason);
      }
    );
  }
}
