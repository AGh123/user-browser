import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { UserCard } from '../../shared/components/user-card/user-card';
import { UsersService } from '../../shared/services/users-service';
import { LoadingBar } from '../../shared/components/loading-bar/loading-bar';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    UserCard,
    LoadingBar,
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {
  usersService = inject(UsersService);
  search = new FormControl('');
  searchValue = signal<string>('');

  ngOnInit(): void {
    this.usersService.getUsers();

    this.search.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.searchValue.set((this.search.value ?? '').trim());
        if (!this.searchValue()) {
          this.usersService.clearSelectedUser();
          this.usersService.getUsers();
        } else {
          const id = Number(this.searchValue());
          this.usersService.getUserById(id);
        }
      });
  }

  readonly visibleUsers = computed(() => {
    if (this.searchValue()) {
      const id = Number(this.searchValue());
      if (Number.isNaN(id)) return [];

      const selectedUser = this.usersService.selectedUser();
      return selectedUser ? [selectedUser] : [];
    }

    return this.usersService.users();
  });

  onPageChange(event: PageEvent): void {
    const nextPage = event.pageIndex + 1;
    this.usersService.getUsers(nextPage, event.pageSize);
  }
}
