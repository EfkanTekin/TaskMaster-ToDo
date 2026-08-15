import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ToDoItemDto {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'https://localhost:7293/api/ToDo';

  constructor(private http: HttpClient) { }

  getAll(): Observable<ToDoItemDto[]> {
    return this.http.get<ToDoItemDto[]>(this.apiUrl);
  }

  getById(id: string): Observable<ToDoItemDto> {
    return this.http.get<ToDoItemDto>(`${this.apiUrl}/${id}`);
  }

  create(request: { title: string; description?: string }): Observable<any> {
    return this.http.post(this.apiUrl, request);
  }

  update(id: string, request: { title: string; description?: string; isCompleted: boolean }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, request);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
