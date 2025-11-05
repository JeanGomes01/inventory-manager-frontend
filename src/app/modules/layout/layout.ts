import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  imports: [Sidebar, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
