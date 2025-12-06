import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environmentProduction } from '../../../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];   // viene del Set<String> roles del back
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles?: string[]; // opcional, ej: ["DOCTOR"] o ["PATIENT"]
}

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private readonly baseUrl = `${environmentProduction.carelinkProviderApiBaseUrl}/auth`;

  constructor(private readonly http: HttpClient) {}

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, payload);
  }

  register(payload: RegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, payload);
  }
}
