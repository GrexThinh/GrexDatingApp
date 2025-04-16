import {
  Component,
  EventEmitter,
  input,
  Input,
  output,
  Output,
} from '@angular/core';
import { AddReplyComponent } from '../add-reply/add-reply.component';
import { DisplayReplyComponent } from '../display-reply/display-reply.component';
import { CommonModule } from '@angular/common';
import { TimeagoModule } from 'ngx-timeago';
import {
  GroupEventCommentCreate,
  MappedGroupEventComment,
} from '../../_models/groupEvent';

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
  comment = input.required<MappedGroupEventComment>();
  addedComment = output<GroupEventCommentCreate>();
  addedReply = output<GroupEventCommentCreate>();
  isAddReply = false;

  replyBtnHandler() {
    this.isAddReply = true;
  }

  onAddedReply($event: GroupEventCommentCreate) {
    this.addedReply.emit($event);
  }
}
