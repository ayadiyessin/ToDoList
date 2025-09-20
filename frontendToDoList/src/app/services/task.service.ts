import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { TaskDTO, TaskStatus, TaskPriority } from '../models/task.model';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks/todolist/{todoId}`;

  constructor(private http: HttpClient) {}

  getTasks(todoId: string): Observable<TaskDTO[]> {
    return this.http.get<TaskDTO[]>(this.apiUrl.replace('{todoId}', todoId)).pipe(
      catchError(this.handleError)
    );
  }
  create(task: TaskDTO): Observable<TaskDTO> {
    if (!task.todoId) {
      throw new Error('todoId is required for creating a task');
    }
    return this.http.post<TaskDTO>(this.apiUrl.replace('{todoId}', task.todoId), task).pipe(
      catchError(this.handleError)
    );
  }

  update(taskId: string, task: TaskDTO): Observable<TaskDTO> {
    if (!task.todoId) {
      throw new Error('todoId is required for updating a task');
    }
    return this.http.put<TaskDTO>(`${environment.apiUrl}/tasks/${taskId}`, task).pipe(
      catchError(this.handleError)
    );
  }

  delete(taskId: string, todoId: string): Observable<void> {
    if (!todoId) {
      throw new Error('todoId is required for deleting a task');
    }
    return this.http.delete<void>(`${environment.apiUrl}/tasks/${taskId}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erreur API :', error);
    return throwError(() => new Error('Une erreur s\'est produite. Veuillez réessayer plus tard.'));
  }
}
