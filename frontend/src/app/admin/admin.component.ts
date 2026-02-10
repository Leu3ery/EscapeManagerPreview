import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';

interface Lead {
  id: number;
  name: string;
  email: string;
  company: string;
  lang: string;
  created_at: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  leads: Lead[] = [];
  loading = false;
  error = '';
  loginError = '';
  loginLoading = false;
  token: string | null = null;

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.token = this.getToken();
    if (this.token) {
      this.fetchLeads();
    }
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem('admin_token');
  }

  private setToken(token: string | null): void {
    if (typeof window === 'undefined') return;
    if (token) {
      window.localStorage.setItem('admin_token', token);
    } else {
      window.localStorage.removeItem('admin_token');
    }
  }

  login(form: NgForm): void {
    if (form.invalid || this.loginLoading) return;
    this.loginLoading = true;
    this.loginError = '';

    const payload = {
      username: form.value.username,
      password: form.value.password,
    };

    this.http.post<{ token: string }>('/api/login', payload).subscribe({
      next: (res) => {
        this.token = res.token;
        this.setToken(res.token);
        this.loginLoading = false;
        form.resetForm();
        this.fetchLeads();
      },
      error: () => {
        this.loginLoading = false;
        this.loginError = 'Invalid credentials.';
      },
    });
  }

  fetchLeads(): void {
    this.loading = true;
    this.error = '';

    const token = this.token ?? this.getToken();
    if (!token) {
      this.loading = false;
      this.error = 'Please login first.';
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.get<{ items: Lead[] }>('/api/leads', { headers }).subscribe({
      next: (response) => {
        this.leads = response.items;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load leads.';
        this.loading = false;
        this.token = null;
        this.setToken(null);
      },
    });
  }
}
