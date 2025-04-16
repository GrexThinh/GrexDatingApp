import { Component, inject, input } from '@angular/core';
import { GroupEventService } from '../../_services/group-event.service';
import { GroupEventUserStatus } from '../../_enums/status';
import { EventCardComponent } from '../event-card/event-card.component';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [EventCardComponent, FormsModule, BsDatepickerModule],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css',
})
export class EventListComponent {
  isDetailList = input.required<boolean>();
  groupEventService = inject(GroupEventService);
  statusOptions = GroupEventUserStatus;

  constructor() {
    this.groupEventService.groupParams().status = 'All';
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents() {
    this.groupEventService.getGroupEvents();
  }
  resetFilters() {
    this.groupEventService.resetUserParams();
    this.loadEvents();
  }
  pageChanged(event: any) {
    if (this.groupEventService.groupParams().pageNumber !== event.page) {
      this.groupEventService.groupParams().pageNumber = event.page;
      this.loadEvents();
    }
  }
}
