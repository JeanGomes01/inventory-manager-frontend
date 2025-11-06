import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ILogin, ILoginResponse } from '../types/login.interface';
import { IUserResponse } from '../types/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private router: Router) {}

  login(data: ILogin): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${this.apiUrl}/auth/login`, data);
  }

  logout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  register(data: { email: string; password: string }): Observable<IUserResponse> {
    return this.http.post<IUserResponse>(`${this.apiUrl}/users`, data);
  }
}
