import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { finalize, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  UserInterface,
  PaginatedUserResponseInterface,
  SingleUserResponseInterface,
} from '../interfaces/user-interface';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/users`;

  readonly users = signal<UserInterface[]>([]);
  readonly selectedUser = signal<UserInterface | null>(null);

  readonly currentPage = signal<number>(1);
  readonly pageSize = signal<number>(6);
  readonly total = signal<number>(0);
  readonly loading = signal<boolean>(false);

  private readonly pageCache = new Map<string, UserInterface[]>();
  private readonly userCache = new Map<number, UserInterface>();

  getUsers(page = this.currentPage(), perPage = this.pageSize()): void {
    const key = `${page}:${perPage}`;
    const cached = this.pageCache.get(key);

    if (cached) {
      this.users.set(cached);
      this.currentPage.set(page);
      this.pageSize.set(perPage);
      return;
    }

    this.loading.set(true);
    const params = new HttpParams()
      .set('page', String(page))
      .set('per_page', String(perPage));

    this.http
      .get<PaginatedUserResponseInterface>(this.baseUrl, { params })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          this.pageCache.set(key, res.data);
          res.data.forEach((u) => this.userCache.set(u.id, u));
          this.users.set(res.data);
          this.currentPage.set(res.page);
          this.pageSize.set(res.per_page);
          this.total.set(res.total);
        },
        error: () => this.users.set([]),
      });
  }

  getUserById(id: number | string): void {
    const userId = Number(id);

    if (Number.isNaN(userId)) {
      this.selectedUser.set(null);
      return;
    }

    const cached = this.userCache.get(userId);
    if (cached) {
      this.selectedUser.set(cached);
      return;
    }

    this.loading.set(true);
    this.http
      .get<SingleUserResponseInterface>(`${this.baseUrl}/${userId}`)
      .pipe(
        map((res) => res.data),
        tap((user) => this.userCache.set(user.id, user)),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (user) => this.selectedUser.set(user),
        error: () => this.selectedUser.set(null),
      });
  }

  clearSelectedUser(): void {
    this.selectedUser.set(null);
  }
}
