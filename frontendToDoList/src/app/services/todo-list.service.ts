import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TodoListDTO } from '../models/todo-list.model';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TodoListService {

  constructor(private http: HttpClient, private router: Router) {}
  getAll(): Observable<TodoListDTO[]> {
    return this.http.get<TodoListDTO[]>(`${environment.apiUrl}/todolists`);
  }
  getById(id: string): Observable<TodoListDTO> {
    return this.http.get<TodoListDTO>(`${environment.apiUrl}/todolists/${id}`).pipe();
  }

  create(todo: TodoListDTO): Observable<TodoListDTO> {
    return this.http.post<TodoListDTO>(`${environment.apiUrl}/todolists`, todo);
  }

  update(id: string, todo: TodoListDTO): Observable<TodoListDTO> {
    return this.http.put<TodoListDTO>(`${environment.apiUrl}/todolists/${id}`, todo);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/todolists/${id}`);
  }
}
