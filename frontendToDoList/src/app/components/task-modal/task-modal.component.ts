import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { TaskDTO, TaskStatus, TaskPriority } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.css'
})
export class TaskModalComponent {
  @Input() todoId: string | null = null;
  @Input() task: TaskDTO = { title: '', description: '', dueDate: '', status: TaskStatus.PENDING, priority: TaskPriority.LOW };
  @Input() isEdit = false;
  taskStatus = TaskStatus;
  taskPriority = TaskPriority;

  constructor(public activeModal: NgbActiveModal, private taskService: TaskService) {
    if (this.todoId) {
      this.task.todoId = this.todoId;
    } else if (this.isEdit && !this.task.todoId) {
      console.warn('todoId missing in edit mode, cannot proceed');
      this.activeModal.dismiss('error');
    }
  }

  save(): void {
    if (!this.todoId || !this.task.title) {
      console.error('todoId or task title is missing');
      return;
    }
    if (this.isEdit && this.task.id) {
      this.taskService.update(this.task.id, this.task).subscribe({
        next: (updatedTask) => {
          this.activeModal.close('saved');
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour de la tâche:', err);
        }
      });
    } else {
      this.task.todoId = this.todoId;
      this.taskService.create(this.task).subscribe({
        next: (newTask) => {
          this.activeModal.close('saved');
        },
        error: (err) => {
          console.error('Erreur lors de la création de la tâche:', err);
        }
      });
    }
  }
}
