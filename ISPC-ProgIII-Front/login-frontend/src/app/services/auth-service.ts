import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  isLoggedIn(): boolean {
    const token = localStorage.getItem('access') || sessionStorage.getItem('access');
    return !!token;
  }

  getToken() {
    return localStorage.getItem('access') || sessionStorage.getItem('access');
  }
  
  logout() {
    localStorage.removeItem('access');
    sessionStorage.removeItem('access');
  }
}