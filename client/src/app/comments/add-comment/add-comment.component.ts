import {
  Component,
  HostListener,
  inject,
  input,
  output,
  ViewChild,
} from '@angular/core';
import { GroupEventService } from '../../_services/group-event.service';
import { FormsModule, NgForm } from '@angular/forms';
import {
  CommentCreate,
  GroupEventCommentCreate,
} from '../../_models/groupEvent';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../_services/account.service';
import { User } from '../../_models/user';
import { PostingComment } from '../../_models/common';
import { CommentType } from '../../_enums/common';
import { GroupPostService } from '../../_services/group-post.service';
import { GroupPostCommentCreate } from '../../_models/groupPost';

@Component({
  selector: 'app-add-comment',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-comment.component.html',
  styleUrl: './add-comment.component.css',
})
export class AddCommentComponent {
  commentType = input.required<PostingComment | undefined>();
  @ViewChild('commentForm') commentForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event: any) {
    if (this.commentForm?.dirty) {
      $event.returnValue = true;
    }
  }
  private eventService = inject(GroupEventService);
  private postService = inject(GroupPostService);
  private toastr = inject(ToastrService);
  private accountService = inject(AccountService);
  addedComment = output<CommentCreate>();
  currentUser: User | null = null;
  comment: CommentCreate = new CommentCreate();

  ngOnChanges() {
    this.currentUser = this.accountService.currentUser();
    if (!this.currentUser) return;
    const type = this.commentType();
    if (type) {
      this.comment = {
        ...this.comment,
        postingCommentTypeId: type.typeId,
        senderId: this.currentUser.id,
      };
    }
  }

  addComment() {
    console.log(this.comment);
    if (this.commentType()?.typeName === CommentType.Event) {
      const payload: GroupEventCommentCreate = {
        ...this.comment,
        groupEventId: this.comment.postingCommentTypeId,
      };
      this.eventService.createGroupEventComment(payload).subscribe({
        next: (_) => {
          this.toastr.success('Comment added successfully!');
          this.commentForm?.reset(this.comment);
          this.addedComment.emit(this.comment);
        },
        error: (_) => {
          this.toastr.error('Failed to add comment');
        },
      });
    } else if (this.commentType()?.typeName === CommentType.Post) {
      const payload: GroupPostCommentCreate = {
        ...this.comment,
        groupPostId: this.comment.postingCommentTypeId,
      };
      this.postService.createGroupPostComment(payload).subscribe({
        next: (_) => {
          this.toastr.success('Comment added successfully!');
          this.commentForm?.reset(this.comment);
          this.addedComment.emit(this.comment);
        },
        error: (_) => {
          this.toastr.error('Failed to add comment');
        },
      });
    }
  }
}
