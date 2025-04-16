import { Component, inject, input } from '@angular/core';
import { DisplayCommentComponent } from '../../comments/display-comment/display-comment.component';
import { AddCommentComponent } from '../../comments/add-comment/add-comment.component';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { GroupEventService } from '../../_services/group-event.service';
import {
  GroupEventComment,
  GroupEventCommentCreate,
  MappedGroupEventComment,
} from '../../_models/groupEvent';

@Component({
  selector: 'app-event-comment.',
  standalone: true,
  imports: [DisplayCommentComponent, AddCommentComponent, CommonModule],
  templateUrl: './event-comment.component.html',
  styleUrl: './event-comment.component.css',
})
export class EventCommentComponent {
  eventId = input.required<string>();
  eventService = inject(GroupEventService);
  comments: MappedGroupEventComment[] = [];

  ngOnChanges() {
    this.loadComments();
  }

  loadComments() {
    if (this.eventId()) {
      this.eventService
        .getGroupEventComments(this.eventId())
        .pipe(map((data) => this.mapComments(data)))
        .subscribe({
          next: (data) => (this.comments = data),
        });
    }
  }

  onAddedComment($event: GroupEventCommentCreate) {
    this.loadComments();
  }

  mapComments(data: GroupEventComment[]): MappedGroupEventComment[] {
    let mappedComments: MappedGroupEventComment[] = [];
    let replyMap: Record<string, MappedGroupEventComment[]> = {};

    data.forEach((comment) => {
      let mappedComment: MappedGroupEventComment = {
        id: comment.id,
        groupEventId: comment.groupEventId,
        senderId: comment.senderId,
        senderPhotoUrl: comment.sender.photoUrl,
        name: comment.sender.knownAs,
        sendDate: comment.sendDate,
        content: comment.content,
        senderDeleted: false,
        reply: [],
      };

      if (comment.parentId) {
        if (!replyMap[comment.parentId]) {
          replyMap[comment.parentId] = [];
        }
        replyMap[comment.parentId].push(mappedComment);
      } else {
        mappedComments.push(mappedComment);
      }
    });

    function assignReplies(comment: MappedGroupEventComment) {
      if (replyMap[comment.id]) {
        comment.reply = replyMap[comment.id];
        comment.reply.forEach(assignReplies);
      }
    }

    mappedComments.forEach(assignReplies);

    console.log(mappedComments);

    return mappedComments;
  }
}
