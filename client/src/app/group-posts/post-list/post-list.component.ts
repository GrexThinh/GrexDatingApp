import { Component, inject, input, SimpleChanges } from '@angular/core';
import { PostCardComponent } from '../post-card/post-card.component';
import { GroupPostService } from '../../_services/group-post.service';
import { GroupPost } from '../../_models/groupPost';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [PostCardComponent],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent {
  groupPostService = inject(GroupPostService);
  createdPost = input.required<GroupPost | undefined>();

  // ngOnInit(): void {
  //   this.loadPosts();
  // }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['createdPost']) {
      this.loadPosts();
    }
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
