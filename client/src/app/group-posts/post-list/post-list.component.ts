import { Component, inject, input, SimpleChanges } from '@angular/core';
import { PostCardComponent } from '../post-card/post-card.component';
import { GroupPostService } from '../../_services/group-post.service';
import { GroupPost } from '../../_models/groupPost';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { FanGroup } from '../../_models/fanGroup';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [PostCardComponent, PaginationModule, FormsModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent {
  groupPostService = inject(GroupPostService);
  groupId = input.required<string | undefined>();
  createdPost = input.required<GroupPost | undefined>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['groupId'] && this.groupId()) {
      this.groupPostService.groupPostParams().fanGroupId = this.groupId() ?? '';
      this.loadPosts();
    } else {
      this.loadPosts();
    }
    if (changes['createdPost'] && this.createdPost()) {
      this.loadPosts();
    }
  }

  ngOnDestroy() {
    this.groupPostService.groupPostParams().fanGroupId = '';
  }

  loadPosts() {
    this.groupPostService.getGroupPosts();
  }
  resetFilters() {
    this.groupPostService.resetUserParams();
    this.loadPosts();
  }
  pageChanged(event: any) {
    if (this.groupPostService.groupPostParams().pageNumber !== event.page) {
      this.groupPostService.groupPostParams().pageNumber = event.page;
      this.loadPosts();
    }
  }
}
