import { Component, inject, input } from '@angular/core';
import { EventCardComponent } from '../event-card/event-card.component';
import { GroupEventService } from '../../_services/group-event.service';
import { GroupEvent } from '../../_models/groupEvent';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [EventCardComponent, RouterLink],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.css',
})
export class EventDetailComponent {
  eventId = input.required<string>();
  groupEventService = inject(GroupEventService);
  event?: GroupEvent;

  ngOnChanges() {
    this.loadEvents();
  }

  loadEvents() {
    this.groupEventService.getGroupEventById(this.eventId()).subscribe({
      next: (data) => (this.event = data),
    });
  }
}
