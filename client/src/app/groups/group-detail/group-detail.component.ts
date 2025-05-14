import { CommonModule, NgClass } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import {
  AccordionComponent,
  AccordionPanelComponent,
} from 'ngx-bootstrap/accordion';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
import { PostCreateComponent } from '../../group-posts/post-create/post-create.component';
import { GroupPost } from '../../_models/groupPost';
import { IncomingEventListComponent } from '../../group-events/incoming-event-list/incoming-event-list.component';
import { EventDetailComponent } from '../../group-events/event-detail/event-detail.component';
import { GroupMessageComponent } from '../../group-messages/group-message/group-message.component';
import { GroupMessageService } from '../../_services/group-message.service';
import { HubConnectionState } from '@microsoft/signalr';

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
    PostCreateComponent,
    IncomingEventListComponent,
    EventDetailComponent,
    GroupMessageComponent,
  ],
  templateUrl: './group-detail.component.html',
  styleUrl: './group-detail.component.css',
})
export class GroupDetailComponent {
  @ViewChild('groupTabs', { static: true }) groupTabs?: TabsetComponent;
  private groupService = inject(GroupService);
  private groupMessageService = inject(GroupMessageService);
  accountService = inject(AccountService);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  private modalService = inject(BsModalService);
  private router = inject(Router);
  createdPost?: GroupPost;
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
  activeTab?: TabDirective;
  selectedEventId: string | null = null;
  getRoleName = getEnumName;

  ngOnInit(): void {
    let groupId: string | null = null;
    this.route.paramMap.subscribe((params) => {
      groupId = params.get('id');
      if (groupId) {
        this.loadGroup(groupId);
      }
    });

    this.route.queryParams.subscribe({
      next: (params) => {
        params['tab'] && this.selectTab(params['tab']);
        if (params['tab'] === 'Events' && params['eventId']) {
          this.selectedEventId = params['eventId'];
        } else {
          this.selectedEventId = null;
          if (params['tab'] === 'Messages') {
            const user = this.accountService.currentUser();
            if (!user || !groupId) return;
            if (
              this.groupMessageService.hubConnection?.state ===
              HubConnectionState.Connected
            ) {
              this.groupMessageService.hubConnection.stop().then(() => {
                if (!groupId) return;
                this.groupMessageService.createHubConnection(user, groupId);
              });
            } else this.groupMessageService.createHubConnection(user, groupId);
          }
        }
      },
    });
  }

  ngDoCheck() {
    this.member = this.joinedMembers.find(
      (x) => x.member.id === this.accountService.currentUser()?.id
    );
  }

  selectTab(heading: string) {
    if (this.groupTabs) {
      const messageTab = this.groupTabs.tabs.find((x) => x.heading === heading);
      if (messageTab) messageTab.active = true;
    }
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: this.activeTab.heading },
      queryParamsHandling: 'merge',
    });
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

  onCreatedPost($event: GroupPost) {
    this.createdPost = $event;
  }
  onSlideRangeChange(indexes: number[] | void): void {}
}
