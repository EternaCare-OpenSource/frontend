import { Injectable, signal } from '@angular/core';

export interface CurrentUser {
  id: number;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly CURRENT_USER_KEY = 'currentUser';

  readonly currentUser = signal<CurrentUser | null>(this.loadCurrentUser());

  private loadCurrentUser(): CurrentUser | null {
    const stored = localStorage.getItem(this.CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  setCurrentUser(user: CurrentUser): void {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  getCurrentUser(): CurrentUser | null {
    return this.currentUser();
  }

  getToken(): string | null {
    const user = this.currentUser();
    return user ? `Bearer user-${user.id}-token` : null;
  }

  clearCurrentUser(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this.currentUser.set(null);
  }

  hasUser(): boolean {
    return this.currentUser() !== null;
  }
}
