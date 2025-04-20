import { Component, input, output } from '@angular/core';
import { AddReplyComponent } from '../add-reply/add-reply.component';
import { DisplayReplyComponent } from '../display-reply/display-reply.component';
import { CommonModule } from '@angular/common';
import { TimeagoModule } from 'ngx-timeago';
import { CommentCreate, MappedComment } from '../../_models/groupEvent';
import { PostingComment } from '../../_models/common';

@Component({
  selector: 'app-display-comment',
  standalone: true,
  imports: [
    AddReplyComponent,
    DisplayReplyComponent,
    CommonModule,
    TimeagoModule,
  ],
  templateUrl: './display-comment.component.html',
  styleUrl: './display-comment.component.css',
})
export class DisplayCommentComponent {
  comment = input.required<MappedComment>();
  commentType = input.required<PostingComment | undefined>();
  addedComment = output<CommentCreate>();
  addedReply = output<CommentCreate>();
  isAddReply = false;

  replyBtnHandler() {
    this.isAddReply = true;
  }

  onAddedReply($event: CommentCreate) {
    this.addedReply.emit($event);
  }
}
