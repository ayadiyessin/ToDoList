import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { TaskDTO, TaskStatus, TaskPriority } from '../../models/task.model';
import { FilterByStatusPipe } from '../../pipes/filter-by-status.pipe';

@Component({
  selector: 'app-shematique-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule, FilterByStatusPipe],
  templateUrl: './shematique-modal.component.html',
  styleUrl: './shematique-modal.component.css'
})
export class ShematiqueModalComponent {
  @Input() tasks: TaskDTO[] = [];
  viewMode: 'kanban' = 'kanban';
  taskStatus = TaskStatus; 

  constructor(public activeModal: NgbActiveModal) {}

  switchView(mode: 'kanban'): void {
    this.viewMode = mode;
  }

  onDrop(event: DragEvent, status: TaskStatus): void {
    event.preventDefault();
    const taskId = event.dataTransfer?.getData('taskId');
    if (taskId) {
      const task = this.tasks.find(t => t.id === taskId);
      if (task && task.status !== undefined) {
        task.status = status;
      }
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDragStart(event: DragEvent, taskId: string): void {
    event.dataTransfer?.setData('taskId', taskId);
  }

  getPriorityClass(priority: TaskPriority | undefined): string {
    if (priority === undefined) return '';
    switch (priority) {
      case 'LOW': return 'bg-low';
      case 'MEDIUM': return 'bg-medium';
      case 'HIGH': return 'bg-high';
      default: return '';
    }
  }

  getPriorityColor(priority: TaskPriority | undefined): string {
    if (priority === undefined) return '#6c757d';
    switch (priority) {
      case 'LOW': return '#6c757d';
      case 'MEDIUM': return '#ffc107';
      case 'HIGH': return '#dc3545';
      default: return '#6c757d';
    }
  }

  getStatusClass(status: TaskStatus | undefined): string {
    if (status === undefined) return '';
    switch (status) {
      case 'PENDING': return 'bg-pending';
      case 'IN_PROGRESS': return 'bg-in-progress';
      case 'COMPLETED': return 'bg-completed';
      default: return '';
    }
  }
}
