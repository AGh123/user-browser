import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsersService } from '../../shared/services/users-service';
import { extractIdFromSlug } from '../../shared/utils/slug';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { LoadingBar } from '../../shared/components/loading-bar/loading-bar';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-details',
  imports: [MatIconModule, MatTooltip, LoadingBar, RouterLink],
  templateUrl: './user-details.html',
  styleUrl: './user-details.scss',
})
export class UserDetails implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  usersService = inject(UsersService);
  private router = inject(Router);
  private location = inject(Location);

  ngOnInit(): void {
    const slug = this.activatedRoute.snapshot.paramMap.get('slug');
    const id = extractIdFromSlug(slug!);

    if (!id) {
      this.router.navigateByUrl('/users');
      return;
    }

    this.usersService.getUserById(id);
  }

  back(): void {
    if (history.length > 1) this.location.back();
    else this.router.navigateByUrl('/users');
  }
}
