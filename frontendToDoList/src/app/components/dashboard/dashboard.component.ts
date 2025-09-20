import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TodoListDTO } from '../../models/todo-list.model';
import { TodoListService } from '../../services/todo-list.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TodoModalComponent } from '../../components/todo-modal/todo-modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  todos: TodoListDTO[] = [];
  filteredTodos: TodoListDTO[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 3;
  sortKey: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  loading = true;

  constructor(private todoListService: TodoListService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.loading = true;
    this.todoListService.getAll().subscribe({
      next: (data: TodoListDTO[]) => {
        this.todos = data;
        this.filteredTodos = [...this.todos];
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des todos:', err);
        this.loading = false;
      }
    });
  }

  addTodo(): void {
    const modalRef = this.modalService.open(TodoModalComponent);
    modalRef.componentInstance.todo = { title: '', description: '' };
    modalRef.componentInstance.isEdit = false;

    modalRef.result.then((result) => {
      if (result === 'saved') {
        this.loadTodos();
      }
    }).catch((error) => {
      console.log('Modal dismissed:', error);
    });
  }

  editTodo(id: string): void {
    const todoToEdit = this.todos.find(todo => todo.id === id);
    if (todoToEdit) {
      const modalRef = this.modalService.open(TodoModalComponent);
      modalRef.componentInstance.todo = { ...todoToEdit };
      modalRef.componentInstance.isEdit = true;

      modalRef.result.then((result) => {
        if (result === 'saved') {
          this.loadTodos();
        }
      }).catch((error) => {
        console.log('Modal dismissed:', error);
      });
    }
  }

  deleteTodo(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to undo this action!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.todoListService.delete(id).subscribe({
          next: () => {
            this.loadTodos();
            Swal.fire({
              position: 'bottom-end',
              icon: 'success',
              title: 'Deleted!',
              showConfirmButton: false,
              timer: 2000
            });
          },
          error: (err) => {
            console.error('Erreur lors de la suppression:', err);
            Swal.fire(
              'Erreur !',
              'Une erreur s\'est produite lors de la suppression.',
              'error'
            );
          }
        });
      }
    });
  }

  onSearch(): void {
    this.applyFiltersAndSort();
    this.currentPage = 1;
  }

  sort(key: string): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
    this.applyFiltersAndSort();
  }

  applyFiltersAndSort(): void {
    let result = [...this.todos];
    if (this.searchTerm) {
      result = result.filter(todo =>
        todo.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (todo.description?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false)
      );
    }
    if (this.sortKey) {
      result.sort((a, b) => {
        let aValue = a[this.sortKey as keyof TodoListDTO] ?? '';
        let bValue = b[this.sortKey as keyof TodoListDTO] ?? '';
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return this.sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        return 0;
      });
    }
    this.filteredTodos = result;
  }

  getPaginatedTodos(): TodoListDTO[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredTodos.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredTodos.length / this.itemsPerPage);
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.getTotalPages() }, (_, i) => i + 1);
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }

}
