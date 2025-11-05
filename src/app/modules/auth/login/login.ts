import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ILogin } from './login.interface';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  handleLogin() {
    const credentials: ILogin = {
      email: this.email,
      password: this.password,
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        localStorage.setItem('access_token', response.access_token);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Erro em suas credenciais. Tente novamente', err);
      },
    });
  }
}
