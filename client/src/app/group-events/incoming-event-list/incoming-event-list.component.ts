import { Component, inject } from '@angular/core';
import { GroupEventService } from '../../_services/group-event.service';
import { GroupEvent } from '../../_models/groupEvent';
import { EventCardComponent } from '../event-card/event-card.component';

@Component({
  selector: 'app-incoming-event-list',
  standalone: true,
  imports: [EventCardComponent],
  templateUrl: './incoming-event-list.component.html',
  styleUrl: './incoming-event-list.component.css',
})
export class IncomingEventListComponent {
  eventService = inject(GroupEventService);
  events: GroupEvent[] = [];

  ngOnInit(): void {
    this.loadIncomingEvents();
  }

  loadIncomingEvents() {
    this.eventService.getIncomingGroupEvents().subscribe({
      next: (data) => {
        this.events = data;
      },
    });
  }
}
