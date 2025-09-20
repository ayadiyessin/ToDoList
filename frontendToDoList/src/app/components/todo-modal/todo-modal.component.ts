import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { TodoListDTO } from '../../models/todo-list.model';
import { TodoListService } from '../../services/todo-list.service';

@Component({
  selector: 'app-todo-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule],
  templateUrl: './todo-modal.component.html',
  styleUrl: './todo-modal.component.css'
})
export class TodoModalComponent {
  @Input() todo: TodoListDTO = { title: '', description: '' };
  @Input() isEdit = false;

  constructor(public activeModal: NgbActiveModal, private todoListService: TodoListService) {}

  save(): void {
    if (this.isEdit && this.todo.id) {
      this.todoListService.update(this.todo.id, this.todo).subscribe({
        next: () => this.activeModal.close('saved'),
        error: (err) => console.error('Erreur lors de la modification:', err)
      });
    } else {
      this.todoListService.create(this.todo).subscribe({
        next: () => this.activeModal.close('saved'),
        error: (err) => console.error('Erreur lors de lajout:', err)
      });
    }
  }
}
