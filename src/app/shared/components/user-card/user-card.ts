import { Component, input, output } from '@angular/core';
import { UserInterface } from '../../interfaces/user-interface';

@Component({
  selector: 'app-user-card',
  imports: [],
  templateUrl: './user-card.html',
  styleUrl: './user-card.scss',
})
export class UserCard {
  user = input.required<UserInterface>();
  cardClick = output<void>();
}
