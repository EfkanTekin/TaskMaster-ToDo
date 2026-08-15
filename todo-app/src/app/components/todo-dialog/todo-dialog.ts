import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-todo-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './todo-dialog.html',
  styleUrl: './todo-dialog.scss'
})
export class TodoDialogComponent {
  todoData = {
    title: '',
    description: ''
  };
  isEdit = false;

  constructor(
    public dialogRef: MatDialogRef<TodoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.todoData = { title: data.title || '', description: data.description || '' };
      this.isEdit = true;
    }
  }

  onSave(): void {
    if (!this.todoData.title.trim()) return;
    this.dialogRef.close(this.todoData);
  }
}
