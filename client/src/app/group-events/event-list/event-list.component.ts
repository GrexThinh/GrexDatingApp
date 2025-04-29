import { Component, inject, input } from '@angular/core';
import { GroupEventService } from '../../_services/group-event.service';
import { GroupEventUserStatus } from '../../_enums/status';
import { EventCardComponent } from '../event-card/event-card.component';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { GroupEvent } from '../../_models/groupEvent';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [
    EventCardComponent,
    FormsModule,
    BsDatepickerModule,
    PaginationModule,
  ],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css',
})
export class EventListComponent {
  groupEventService = inject(GroupEventService);
  statusOptions = GroupEventUserStatus;

  ngOnInit(): void {
    this.groupEventService.groupParams().status = 'All';
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
  onUpdateEvent($event: GroupEvent) {
    this.loadEvents();
  }
}
