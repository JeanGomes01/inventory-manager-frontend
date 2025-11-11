import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Sidebar } from '../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-layout',
  imports: [Sidebar, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout implements OnInit {
  userName: string | null = null;

  isMenuOpen = false;

  ngOnInit(): void {
    this.userName = localStorage.getItem('user_name');
  }

  constructor(private authService: AuthService) {}

  logout() {
    localStorage.clear();
    this.authService.logout();
  }
}
