import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss'
})
export class NotFoundComponent {
  constructor(private router: Router) { }

  goHome() {
    this.router.navigate(['/todo']);
  }
}
