import { Component, inject, input } from '@angular/core';
import { GroupEventService } from '../../_services/group-event.service';
import { ToastrService } from 'ngx-toastr';
import { GroupEvent } from '../../_models/groupEvent';
import { GroupEventUserStatus } from '../../_enums/status';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { getEnumName } from '../../_helpers/enum-utils';
import { EventCommentComponent } from '../event-comment/event-comment.component';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [DatePipe, NgClass, CommonModule, EventCommentComponent],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css',
})
export class EventCardComponent {
  isDetailList = input.required<boolean>();
  private groupEventService = inject(GroupEventService);
  private toastr = inject(ToastrService);
  event = input.required<GroupEvent>();
  status = GroupEventUserStatus;
  isViewDetailEvent = false;
  getStatusName = getEnumName;

  actEvent(status: GroupEventUserStatus) {
    if (this.event().currentUserStatus === null) {
      this.groupEventService
        .createGroupEventUser(this.event().id, status)
        .subscribe({
          next: () => {
            this.event().currentUserStatus = status;
            this.toastr.success('Act event successfully!');
          },
        });
    } else if (
      this.event().currentUserStatus === GroupEventUserStatus.Joined ||
      this.event().currentUserStatus === GroupEventUserStatus.Waiting ||
      this.event().currentUserStatus === GroupEventUserStatus.Interested
    ) {
      this.groupEventService.deleteGroupEventUser(this.event().id).subscribe({
        next: () => {
          this.event().currentUserStatus = null;
          this.toastr.success('Cancel acting event successfully!');
        },
      });
    }
  }

  handleViewDetailEvent() {
    this.isViewDetailEvent = true;
  }
}
