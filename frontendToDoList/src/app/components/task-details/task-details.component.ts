import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { TaskDTO, TaskStatus, TaskPriority } from '../../models/task.model';
import { TodoListService } from '../../services/todo-list.service';
import { TodoListDTO } from '../../models/todo-list.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskModalComponent } from '../../components/task-modal/task-modal.component';
import Swal from 'sweetalert2';
import { ShematiqueModalComponent } from '../shematique-modal/shematique-modal.component';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.css'
})
export class TaskDetailsComponent implements OnInit {
  tasks: TaskDTO[] = [];
  todoId: string | null = null;
  loading = true;
  todoTitle: string | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 3;
  sortKey: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  searchTerm: string = '';

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private todoListService: TodoListService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.todoId = this.route.snapshot.paramMap.get('id');
    if (this.todoId) {
      this.loadTodoAndTasks();
    } else {
      console.error('todoId is null or undefined');
    }
  }

  loadTodoAndTasks(): void {
    this.loading = true;
    if (this.todoId) {
      this.todoListService.getById(this.todoId).subscribe({
        next: (todo: TodoListDTO) => {
          this.todoTitle = todo.title;
          this.taskService.getTasks(this.todoId!).subscribe({
            next: (data: TaskDTO[]) => {
              this.tasks = data;
              this.applyFiltersAndSort();
              this.loading = false;
            },
            error: (err) => {
              console.error('Erreur lors du chargement des tâches:', err);
              this.loading = false;
            }
          });
        },
        error: (err) => {
          console.error('Erreur lors du chargement de la Todo List:', err);
          this.loading = false;
        }
      });
    }
  }

  applyFiltersAndSort(): void {
    let result = [...this.tasks];
    if (this.searchTerm) {
      result = result.filter(task =>
        task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (task.description?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false)
      );
    }
    if (this.sortKey) {
      result.sort((a, b) => {
        let aValue = a[this.sortKey as keyof TaskDTO] ?? '';
        let bValue = b[this.sortKey as keyof TaskDTO] ?? '';
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return this.sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        return 0;
      });
    }
    this.tasks = result;
    this.currentPage = 1;
  }

  getPaginatedTasks(): TaskDTO[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.tasks.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.tasks.length / this.itemsPerPage);
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.getTotalPages() }, (_, i) => i + 1);
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
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

  addTask(): void {
    if (!this.todoId) {
      console.error('Cannot add task: todoId is undefined');
      return;
    }
    const modalRef = this.modalService.open(TaskModalComponent);
    modalRef.componentInstance.todoId = this.todoId;
    modalRef.componentInstance.isEdit = false;

    modalRef.result.then((result) => {
      if (result === 'saved') {
        this.loadTodoAndTasks();
      }
    }).catch((error) => {
      console.log('Modal dismissed:', error);
    });
  }

  editTask(taskId: string): void {
    if (!this.todoId) {
      console.error('Cannot edit task: todoId is undefined');
      return;
    }
    const taskToEdit = this.tasks.find(task => task.id === taskId);
    if (taskToEdit) {
      const modalRef = this.modalService.open(TaskModalComponent);
      modalRef.componentInstance.todoId = this.todoId;
      modalRef.componentInstance.task = { ...taskToEdit, todoId: this.todoId };
      modalRef.componentInstance.isEdit = true;

      modalRef.result.then((result) => {
        if (result === 'saved') {
          this.loadTodoAndTasks();
        }
      }).catch((error) => {
        console.log('Modal dismissed:', error);
      });
    }
  }

  deleteTask(taskId: string): void {
    if (!this.todoId) {
      console.error('Cannot delete task: todoId is undefined');
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.taskService.delete(taskId, this.todoId!).subscribe({
          next: () => {
            this.loadTodoAndTasks();
            Swal.fire('Deleted!', 'The task has been deleted.', 'success');
          },
          error: (err) => {
            console.error('Erreur lors de la suppression:', err);
            Swal.fire('Error!', 'Failed to delete the task.', 'error');
          }
        });
      }
    });
  }

  navigateToDashboard(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/dashboard']);
  }
  openShematiqueModal(): void {
    const modalRef = this.modalService.open(ShematiqueModalComponent);
    modalRef.componentInstance.tasks = this.tasks;
  }
}
