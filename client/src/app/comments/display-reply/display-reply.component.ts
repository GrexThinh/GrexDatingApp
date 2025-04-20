import { Component, input, output } from '@angular/core';
import { AddReplyComponent } from '../add-reply/add-reply.component';
import { CommonModule } from '@angular/common';
import { TimeagoModule } from 'ngx-timeago';
import { CommentCreate, MappedComment } from '../../_models/groupEvent';
import { PostingComment } from '../../_models/common';

@Component({
  selector: 'app-display-reply',
  standalone: true,
  imports: [AddReplyComponent, CommonModule, TimeagoModule],
  templateUrl: './display-reply.component.html',
  styleUrl: './display-reply.component.css',
})
export class DisplayReplyComponent {
  reply = input.required<MappedComment>();
  commentType = input.required<PostingComment | undefined>();
  addedReply = output<CommentCreate>();
  isAddReply = false;

  replyBtnHandler() {
    this.isAddReply = true;
  }

  onAddedReply($event: CommentCreate) {
    this.addedReply.emit($event);
  }
}
