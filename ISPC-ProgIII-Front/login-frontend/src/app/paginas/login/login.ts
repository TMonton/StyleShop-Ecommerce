import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading = false;
  errorMessage = '';

  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [false],
  });

  // 🔥 LOGIN GOOGLE (recibe code)
  ngOnInit() {
    const code = this.route.snapshot.queryParamMap.get('code');

    if (code) {
      this.http.post<any>('http://localhost:8000/api/google-login/', { code }).subscribe({
        next: (res) => {
          console.log('LOGIN RESPONSE:', res);


          // 🔐 guardar TODO
          localStorage.setItem('access', res.access);
          localStorage.setItem('refresh', res.refresh);
          localStorage.setItem('user', JSON.stringify(res.user));

          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('ERROR GOOGLE', err);
          this.errorMessage = 'Error con Google';
        },
      });
    }
  }

  // 🔐 LOGIN NORMAL
  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const { username, password, remember } = this.loginForm.value;

    this.http.post<any>('http://localhost:8000/api/login/', { username, password }).subscribe({
      next: (response) => {

        // 🔥 guardar tokens SIEMPRE (clave para refresh)
        localStorage.setItem('access', response.access);
        localStorage.setItem('refresh', response.refresh);
        localStorage.setItem('user', JSON.stringify(response.user));

        this.router.navigate(['/home']);
      },
      error: () => {
        this.errorMessage = 'Credenciales incorrectas';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  // 🔥 REDIRECCIÓN GOOGLE
  loginGoogle() {
    const clientId = '139048359755-g8i9chj72k6t55gl8e1kd3vdjam2gqrq.apps.googleusercontent.com';

    const redirectUri = 'http://localhost:4200/login';

    const url =
      'https://accounts.google.com/o/oauth2/v2/auth' +
      `?client_id=${clientId}` +
      `&redirect_uri=${redirectUri}` +
      `&response_type=code` +
      `&scope=openid email profile` +
      `&prompt=select_account`;

    window.location.href = url;
  }
}