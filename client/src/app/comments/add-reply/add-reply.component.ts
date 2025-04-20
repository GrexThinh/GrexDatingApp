import {
  Component,
  HostListener,
  inject,
  input,
  output,
  ViewChild,
} from '@angular/core';
import {
  CommentCreate,
  GroupEventCommentCreate,
  MappedComment,
} from '../../_models/groupEvent';
import { GroupEventService } from '../../_services/group-event.service';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../_services/account.service';
import { User } from '../../_models/user';
import { FormsModule, NgForm } from '@angular/forms';
import { CommentType } from '../../_enums/common';
import { GroupPostService } from '../../_services/group-post.service';
import { PostingComment } from '../../_models/common';
import { GroupPostCommentCreate } from '../../_models/groupPost';

@Component({
  selector: 'app-add-reply',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-reply.component.html',
  styleUrl: './add-reply.component.css',
})
export class AddReplyComponent {
  parentComment = input.required<MappedComment>();
  @ViewChild('replyForm') replyForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event: any) {
    if (this.replyForm?.dirty) {
      $event.returnValue = true;
    }
  }
  private eventService = inject(GroupEventService);
  private postService = inject(GroupPostService);
  private toastr = inject(ToastrService);
  private accountService = inject(AccountService);
  addedReply = output<CommentCreate>();
  currentUser: User | null = null;
  reply: CommentCreate = new CommentCreate();
  commentType = input.required<PostingComment | undefined>();

  ngOnChanges() {
    this.currentUser = this.accountService.currentUser();
    if (this.currentUser && this.parentComment().id) {
      const type = this.commentType();
      if (type) {
        this.reply = {
          ...this.reply,
          parentId: this.parentComment().id,
          postingCommentTypeId: type.typeId,
          senderId: this.currentUser.id,
        };
      }
    }
  }

  addReply() {
    console.log(this.reply);

    if (this.commentType()?.typeName === CommentType.Event) {
      const payload: GroupEventCommentCreate = {
        ...this.reply,
        groupEventId: this.reply.postingCommentTypeId,
      };
      this.eventService.createGroupEventComment(payload).subscribe({
        next: (_) => {
          this.toastr.success('Reply added successfully!');
          this.addedReply.emit(this.reply);
          this.replyForm?.reset(this.reply);
        },
        error: (_) => {
          this.toastr.error('Failed to add reply');
        },
      });
    } else if (this.commentType()?.typeName === CommentType.Post) {
      const payload: GroupPostCommentCreate = {
        ...this.reply,
        groupPostId: this.reply.postingCommentTypeId,
      };
      this.postService.createGroupPostComment(payload).subscribe({
        next: (_) => {
          this.toastr.success('Reply added successfully!');
          this.addedReply.emit(this.reply);
          this.replyForm?.reset(this.reply);
        },
        error: (_) => {
          this.toastr.error('Failed to add reply');
        },
      });
    }
  }
}
