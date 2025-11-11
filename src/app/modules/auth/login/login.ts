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

  isLoading: boolean = false;
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

    this.isLoading = true;
    const startTime = Date.now();

    this.authService.register(registerData).subscribe({
      next: (response) => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(1500 - elapsed, 0); // mínimo de 1.5s de loading

        setTimeout(() => {
          this.isLoading = false;
          localStorage.setItem('access_token', response.access_token);
          this.successMessage = 'Cadastro realizado com sucesso!';
          this.errorMessage = '';

          setTimeout(() => {
            this.successMessage = '';
            this.toggleForm();
          }, 2000);
        }, remaining);
      },
      error: (err) => {
        console.error('Erro ao cadastrar usuário', err);
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(1500 - elapsed, 0);

        setTimeout(() => {
          this.errorMessage = 'Erro ao cadastrar usuário';
          this.successMessage = '';
          this.isLoading = false;
        }, remaining);
      },
    });
  }

  handleLogin() {
    const credentials: ILogin = {
      email: this.email,
      password: this.password,
    };

    this.isLoading = true;
    const startTime = Date.now();

    this.authService.login(credentials).subscribe({
      next: (response) => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(1500 - elapsed, 0); // 1.5s de delay mínimo

        setTimeout(() => {
          this.isLoading = false;
          localStorage.setItem('access_token', response.access_token);
          this.successMessage = 'Login realizado com sucesso!';
          this.errorMessage = '';

          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 1500);
        }, remaining);
      },
      error: (err) => {
        console.error('Erro em suas credenciais. Tente novamente', err);
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(1500 - elapsed, 0);

        setTimeout(() => {
          this.errorMessage = 'Erro em suas credenciais. Tente novamente';
          this.successMessage = '';
          this.isLoading = false;
        }, remaining);
      },
    });
  }
}
