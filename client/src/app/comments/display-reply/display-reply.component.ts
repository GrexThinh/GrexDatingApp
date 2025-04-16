import { Component, input, Input, output } from '@angular/core';
import { AddReplyComponent } from '../add-reply/add-reply.component';
import { CommonModule } from '@angular/common';
import { TimeagoModule } from 'ngx-timeago';
import {
  GroupEventCommentCreate,
  MappedGroupEventComment,
} from '../../_models/groupEvent';

@Component({
  selector: 'app-display-reply',
  standalone: true,
  imports: [AddReplyComponent, CommonModule, TimeagoModule],
  templateUrl: './display-reply.component.html',
  styleUrl: './display-reply.component.css',
})
export class DisplayReplyComponent {
  reply = input.required<MappedGroupEventComment>();
  addedReply = output<GroupEventCommentCreate>();
  isAddReply = false;

  replyBtnHandler() {
    this.isAddReply = true;
  }

  onAddedReply($event: GroupEventCommentCreate) {
    this.addedReply.emit($event);
  }
}
