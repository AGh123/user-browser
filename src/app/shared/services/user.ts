import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import {
  PaginatedUserResponseInterface,
  UserInterface,
} from '../interfaces/user';

@Injectable({ providedIn: 'root' })
export class User {
  private http = inject(HttpClient);
  private currentPage = signal(1);
  private totalPages = signal<number | null>(null);
  private isLoading = signal(false);
  private loadedUsers = signal<UserInterface[]>([]);
  private pageCache = new Set<number>();

  readonly users = computed(() => this.loadedUsers());
  readonly loading = computed(() => this.isLoading());
  readonly hasMore = computed(() =>
    this.totalPages() ? this.currentPage() < this.totalPages()! : true
  );

  loadNextPage() {
    const page = this.currentPage();
    const perPage = 20;

    if (this.pageCache.has(page)) return;

    this.isLoading.set(true);

    this.http
      .get<PaginatedUserResponseInterface>(
        `https://reqres.in/api/users?page=${page}&per_page=${perPage}`
      )
      .pipe(
        tap((res) => {
          this.pageCache.add(res.page);
          this.totalPages.set(res.total_pages);
          this.currentPage.set(res.page + 1);
          this.loadedUsers.set([...this.loadedUsers(), ...res.data]);
        })
      )
      .subscribe({
        complete: () => this.isLoading.set(false),
        error: () => this.isLoading.set(false),
      });
  }

  getUserById(id: number) {
    return this.http.get<{ data: User }>(`https://reqres.in/api/users/${id}`);
  }
}
