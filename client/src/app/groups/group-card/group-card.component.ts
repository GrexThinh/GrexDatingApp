import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FanGroup } from '../../_models/fanGroup';
import { GroupService } from '../../_services/group.service';
import { GroupUserStatus } from '../../_enums/status';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-group-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './group-card.component.html',
  styleUrl: './group-card.component.css',
})
export class GroupCardComponent {
  private groupService = inject(GroupService);
  private toastr = inject(ToastrService);
  group = input.required<FanGroup>();
  statusOptions = GroupUserStatus;

  getMainPhotoUrl(): string {
    return (
      this.group().photos?.find((photo: any) => photo.isMain)?.url ||
      './assets/user.png'
    );
  }

  hasJoined() {
    return this.group().currentUserStatus == GroupUserStatus.Joined;
  }

  toggleJoin() {
    if (
      this.group().currentUserStatus === null ||
      this.group().currentUserStatus === GroupUserStatus.Rejected
    ) {
      this.groupService.createGroupUser(this.group().id).subscribe({
        next: () => {
          this.group().currentUserStatus = GroupUserStatus.Waiting;
          this.toastr.success('Request joining group successfully!');
        },
      });
    } else if (
      this.group().currentUserStatus === GroupUserStatus.Joined ||
      this.group().currentUserStatus === GroupUserStatus.Waiting
    ) {
      this.groupService.deleteGroupUser(this.group().id).subscribe({
        next: () => {
          this.group().currentUserStatus = null;
          this.toastr.success('Cancel joining group successfully!');
        },
      });
    }
  }
}
