import { Component, inject, input, output, SimpleChanges } from '@angular/core';
import { GroupEventService } from '../../_services/group-event.service';
import { ToastrService } from 'ngx-toastr';
import { GroupEvent, GroupEventUser } from '../../_models/groupEvent';
import { GroupEventUserStatus } from '../../_enums/status';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { getEnumName } from '../../_helpers/enum-utils';
import { EventCommentComponent } from '../event-comment/event-comment.component';
import { GroupEventUserRole } from '../../_enums/role';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { EventModalComponent } from '../../modals/event-modal/event-modal.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [
    DatePipe,
    NgClass,
    CommonModule,
    EventCommentComponent,
    TooltipModule,
  ],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css',
})
export class EventCardComponent {
  isDetailList = input.required<boolean>();
  private groupEventService = inject(GroupEventService);
  private toastr = inject(ToastrService);
  private modalService = inject(BsModalService);
  private router = inject(Router);
  event = input.required<GroupEvent>();
  status = GroupEventUserStatus;
  isViewDetailEvent = false;
  evtUsers: GroupEventUser[] = [];
  role = GroupEventUserRole;
  getStatusName = getEnumName;
  getRoleName = getEnumName;
  bsModalRef: BsModalRef<EventModalComponent> =
    new BsModalRef<EventModalComponent>();
  updatedEvent = output<GroupEvent>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isDetailList']) {
      if (this.isDetailList()) {
        this.groupEventService.getGroupEventUsers(this.event().id).subscribe({
          next: (data) => {
            this.evtUsers = data;
          },
        });
      }
    }
  }

  handleClickIncomingEvent() {
    this.router.navigate(['/groups', this.event()?.fanGroupId], {
      queryParams: { tab: 'Events', eventId: this.event().id },
      queryParamsHandling: 'merge',
    });
  }

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

  isHappeningEvent() {
    const currentDate = new Date();
    const startDate = new Date(this.event().eventStartTime);
    const endDate = new Date(this.event().eventEndTime);
    return currentDate >= startDate && currentDate <= endDate;
  }

  isIncomingEvent() {
    const currentDate = new Date();
    const startDate = new Date(this.event().eventStartTime);
    return currentDate < startDate;
  }

  handleEditEvent() {
    const initialState: ModalOptions = {
      class: 'modal-lg',
      initialState: {
        title: 'Update event',
        isUpdated: false,
        event: this.event(),
      },
    };
    this.bsModalRef = this.modalService.show(EventModalComponent, initialState);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef.content?.isUpdated) {
          if (this.bsModalRef.content?.event)
            this.updatedEvent.emit(this.bsModalRef.content.event);
        }
      },
    });
  }

  handleViewDetailEvent() {
    this.isViewDetailEvent = true;
  }
}
