import { Component, inject } from '@angular/core';
import { PostCreateComponent } from '../group-posts/post-create/post-create.component';
import { PostListComponent } from '../group-posts/post-list/post-list.component';
import { AccountService } from '../_services/account.service';
import { GroupPost } from '../_models/groupPost';
import { GroupService } from '../_services/group.service';
import { GroupCardComponent } from '../groups/group-card/group-card.component';
import { GroupEventService } from '../_services/group-event.service';
import { EventCardComponent } from '../group-events/event-card/event-card.component';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    PostCreateComponent,
    PostListComponent,
    GroupCardComponent,
    EventCardComponent,
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css',
})
export class PostsComponent {
  accountService = inject(AccountService);
  groupService = inject(GroupService);
  eventService = inject(GroupEventService);
  createdPost?: GroupPost;
  isOpenMessage = true;
  onCreatedPost($event: GroupPost) {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.groupService.groupParams().type = 'All';
    this.groupService.groupParams().status = 'All';
    this.eventService.groupParams().status = 'All';
    this.loadEvents();
    this.loadGroups();
  }

  loadGroups() {
    this.groupService.getFanGroups();
  }

  loadEvents() {
    this.eventService.getGroupEvents();
  }

  toggleMessage() {
    this.isOpenMessage = !this.isOpenMessage;
  }
}
