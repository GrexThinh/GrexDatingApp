import { CommonModule, NgClass } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import {
  AccordionComponent,
  AccordionPanelComponent,
} from 'ngx-bootstrap/accordion';
import { TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GroupService } from '../../_services/group.service';
import { FanGroup, FanGroupMember } from '../../_models/fanGroup';
import { GroupUserStatus } from '../../_enums/status';
import { GroupUserRole } from '../../_enums/role';
import { getEnumName } from '../../_helpers/enum-utils';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../_services/account.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { EventModalComponent } from '../../modals/event-modal/event-modal.component';
import { GroupEvent } from '../../_models/groupEvent';
import { EventListComponent } from '../../group-events/event-list/event-list.component';
import { PostListComponent } from '../../group-posts/post-list/post-list.component';

@Component({
  selector: 'app-group-detail',
  standalone: true,
  imports: [
    CarouselModule,
    CommonModule,
    AccordionComponent,
    AccordionPanelComponent,
    TabsModule,
    RouterLink,
    NgClass,
    EventListComponent,
    PostListComponent,
  ],
  templateUrl: './group-detail.component.html',
  styleUrl: './group-detail.component.css',
})
export class GroupDetailComponent {
  @ViewChild('staticTabs', { static: false }) staticTabs?: TabsetComponent;
  private groupService = inject(GroupService);
  private accountService = inject(AccountService);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  private modalService = inject(BsModalService);
  bsModalRef: BsModalRef<EventModalComponent> =
    new BsModalRef<EventModalComponent>();
  group?: FanGroup;
  joinedMembers: FanGroupMember[] = [];
  requestingMembers: FanGroupMember[] = [];
  member?: FanGroupMember;
  status = GroupUserStatus;
  role = GroupUserRole;
  itemsPerSlide = 1;
  singleSlideOffset = true;
  noWrap = false;
  mainPhotoUrl: string | ArrayBuffer | null = './assets/user.png';
  coverPhotoUrls = [
    {
      image: '',
    },
  ];
  events: GroupEvent[] = [];
  getRoleName = getEnumName;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const groupId = params.get('id');
      if (groupId) {
        this.loadGroup(groupId);
      }
    });
  }

  ngDoCheck() {
    this.member = this.joinedMembers.find(
      (x) => x.member.id === this.accountService.currentUser()?.id
    );
  }

  loadGroup(id: string) {
    this.groupService.getFanGroup(id).subscribe({
      next: (group) => {
        this.group = group;
        this.mainPhotoUrl =
          this.group?.photos?.find((photo) => photo.isMain)?.url ||
          './assets/user.png';
        this.coverPhotoUrls[0].image =
          this.group?.photos?.find((photo) => !photo.isMain)?.url ||
          './assets/group.png';

        this.joinedMembers =
          this.group?.members?.filter(
            (member) => member.status === this.status.Joined
          ) || [];

        this.requestingMembers =
          this.group?.members?.filter(
            (member) => member.status === this.status.Waiting
          ) || [];
      },
    });
  }

  isAdmin(): boolean {
    return this.member?.roles?.includes(this.role.Admin) || false;
  }

  isModerator(): boolean {
    return this.member?.roles?.includes(this.role.Moderator) || false;
  }

  handleUpdateStatus(status: GroupUserStatus, userId: number) {
    if (this.group) {
      this.groupService
        .updateGroupUserStatus(this.group.id, userId, status)
        .subscribe({
          next: (_) => {
            if (status === GroupUserStatus.Joined) {
              const addedMember = this.group?.members?.find(
                (x) => x.member.id === userId
              );
              if (addedMember) {
                this.joinedMembers = [addedMember, ...this.joinedMembers];
              }
            }
            this.requestingMembers = this.requestingMembers.filter(
              (x) => x.member.id !== userId
            );
            this.toastr.success('Update group user sucessfully!');
          },
          error: (err) => {
            this.toastr.error('Update group user fail!');
          },
        });
    }
  }

  handleCreateEvent() {
    const initialState: ModalOptions = {
      class: 'modal-lg',
      initialState: {
        title: 'Create an event',
        isCreated: false,
        event: new GroupEvent(),
      },
    };
    this.bsModalRef = this.modalService.show(EventModalComponent, initialState);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef.content?.isCreated) {
          this.events = [this.bsModalRef.content?.event, ...this.events];
        }
      },
    });
  }

  onSlideRangeChange(indexes: number[] | void): void {}
}
