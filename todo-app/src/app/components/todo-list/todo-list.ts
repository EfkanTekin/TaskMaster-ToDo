import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService, ToDoItemDto } from '../../services/todo';
import { HeaderComponent } from '../header/header';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TodoDialogComponent } from '../todo-dialog/todo-dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    MatCardModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    MatPaginatorModule
  ],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss'
})
export class TodoListComponent implements OnInit, AfterViewInit {
  todos: ToDoItemDto[] = [];
  dataSource = new MatTableDataSource<ToDoItemDto>([]);
  searchTerm = '';
  displayedColumns = ['isCompleted', 'title', 'description', 'createdAt', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private todoService: TodoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTodos();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  loadTodos(): void {
    this.todoService.getAll().subscribe({
      next: (data) => {
        this.todos = data;
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      },
      error: () => this.snackBar.open('Görevler yüklenemedi.', 'Kapat', { duration: 3000 })
    });
  }

  filterTodos(): void {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  toggleComplete(todo: ToDoItemDto): void {
    const updated = { title: todo.title, description: todo.description, isCompleted: !todo.isCompleted };
    this.todoService.update(todo.id, updated).subscribe({
      next: () => this.loadTodos(),
      error: () => this.snackBar.open('Durum güncellenemedi.', 'Kapat', { duration: 3000 })
    });
  }

  openAddDialog(): void {
    const ref = this.dialog.open(TodoDialogComponent, { width: '400px' });
    ref.afterClosed().subscribe((res) => {
      if (res) {
        this.todoService.create(res).subscribe({
          next: () => {
            this.snackBar.open('Görev eklendi.', 'Tamam', { duration: 3000 });
            this.loadTodos();
          }
        });
      }
    });
  }

  openEditDialog(todo: ToDoItemDto): void {
    const ref = this.dialog.open(TodoDialogComponent, { width: '400px', data: todo });
    ref.afterClosed().subscribe((res) => {
      if (res) {
        this.todoService.update(todo.id, { ...res, isCompleted: todo.isCompleted }).subscribe({
          next: () => {
            this.snackBar.open('Görev güncellendi.', 'Tamam', { duration: 3000 });
            this.loadTodos();
          }
        });
      }
    });
  }

  deleteTodo(id: string): void {
    if (confirm('Bu görevi silmek istediğinize emin misiniz?')) {
      this.todoService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Görev silindi.', 'Tamam', { duration: 3000 });
          this.loadTodos();
        }
      });
    }
  }
}
