import { Component, computed, inject } from '@angular/core';
import { PostCreateComponent } from '../group-posts/post-create/post-create.component';
import { PostListComponent } from '../group-posts/post-list/post-list.component';
import { AccountService } from '../_services/account.service';
import { GroupPost } from '../_models/groupPost';
import { GroupService } from '../_services/group.service';
import { GroupEventService } from '../_services/group-event.service';
import { EventCardComponent } from '../group-events/event-card/event-card.component';
import { RouterLink } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { GroupEvent } from '../_models/groupEvent';
import { EventModalComponent } from '../modals/event-modal/event-modal.component';
import { GroupCardHomeComponent } from '../groups/group-card-home/group-card-home.component';
import { GroupUserStatus } from '../_enums/status';
import { LikesService } from '../_services/likes.service';
import { PresenceService } from '../_services/presence.service';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    PostCreateComponent,
    PostListComponent,
    EventCardComponent,
    RouterLink,
    GroupCardHomeComponent,
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css',
})
export class PostsComponent {
  accountService = inject(AccountService);
  groupService = inject(GroupService);
  eventService = inject(GroupEventService);
  likesService = inject(LikesService);
  private presenceService = inject(PresenceService);
  private modalService = inject(BsModalService);
  bsModalRef: BsModalRef<EventModalComponent> =
    new BsModalRef<EventModalComponent>();
  groupStatus = GroupUserStatus;
  createdPost?: GroupPost;
  isOpenMessage = true;
  pageNumber = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.groupService.groupParams().type = 'All';
    this.groupService.groupParams().status = 'All';
    this.eventService.groupParams().status = 'All';
    this.loadLikes();
    this.loadEvents();
    this.loadGroups();
  }

  loadGroups() {
    this.groupService.getFanGroups();
  }

  loadEvents() {
    this.eventService.getGroupEvents();
  }

  loadLikes() {
    this.likesService.getLikes('liked', this.pageNumber, this.pageSize);
  }

  isOnline = (userName: string) =>
    computed(() => this.presenceService.onlineUsers().includes(userName));

  toggleMessage() {
    this.isOpenMessage = !this.isOpenMessage;
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
          this.loadEvents();
        }
      },
    });
  }

  onCreatedPost($event: GroupPost) {}
}
