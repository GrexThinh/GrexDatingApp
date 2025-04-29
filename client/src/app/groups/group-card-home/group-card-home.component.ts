import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FanGroup } from '../../_models/fanGroup';

@Component({
  selector: 'app-group-card-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './group-card-home.component.html',
  styleUrl: './group-card-home.component.css',
})
export class GroupCardHomeComponent {
  group = input.required<FanGroup>();
}
