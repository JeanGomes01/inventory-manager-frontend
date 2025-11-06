import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ILogin } from '../../../types/login.interface';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  confirmPassword = '';
  isRegister = false;

  constructor(private authService: AuthService, private router: Router) {}

  toggleForm() {
    this.isRegister = !this.isRegister;
  }

  handleRegister() {
    if (this.password !== this.confirmPassword) {
      alert('As senhas devem ser iguais');
      return;
    }

    const registerData = {
      email: this.email,
      password: this.password,
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        localStorage.setItem('access_token', response.access_token);
        alert('Cadastro realizado com sucesso!');
        this.toggleForm();
      },
      error: (err) => {
        console.error('Erro ao cadastrar usuário', err);
        alert('Erro ao cadastrar usuário');
      },
    });
  }

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
