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
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  isRegister = false;

  successMessage = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  toggleForm() {
    this.isRegister = !this.isRegister;
  }

  handleRegister() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'As senhas devem ser iguais';
      this.successMessage = '';
      return;
    }

    const registerData = {
      name: this.name,
      email: this.email,
      password: this.password,
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        localStorage.setItem('access_token', response.access_token);
        this.successMessage = 'Cadastro realizado com sucesso !';
        this.errorMessage = '';

        setTimeout(() => {
          this.successMessage = '';
          this.toggleForm();
        }, 2000);
      },
      error: (err) => {
        console.error('Erro ao cadastrar usuário', err);
        this.errorMessage = 'Erro ao cadastrar usuário';
        this.successMessage = '';
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
        this.successMessage = 'Login realizado com sucesso !';
        this.errorMessage = '';

        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1500);
      },
      error: (err) => {
        console.error('Erro em suas credenciais. Tente novamente', err);
        this.errorMessage = 'Erro em suas credenciais. Tente novamente';
        this.successMessage = '';
      },
    });
  }
}
