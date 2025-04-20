import { Component, inject, input } from '@angular/core';
import { DisplayCommentComponent } from '../../comments/display-comment/display-comment.component';
import { AddCommentComponent } from '../../comments/add-comment/add-comment.component';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { GroupEventService } from '../../_services/group-event.service';
import {
  CommentCreate,
  GroupEventComment,
  MappedComment,
} from '../../_models/groupEvent';
import { CommentType } from '../../_enums/common';
import { PostingComment } from '../../_models/common';

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
  comments: MappedComment[] = [];
  commentType?: PostingComment;

  ngOnChanges() {
    this.loadComments();
    this.commentType = {
      typeId: this.eventId(),
      typeName: CommentType.Event,
    };
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

  onAddedComment($event: CommentCreate) {
    this.loadComments();
  }

  mapComments(data: GroupEventComment[]): MappedComment[] {
    let mappedComments: MappedComment[] = [];
    let replyMap: Record<string, MappedComment[]> = {};

    data.forEach((comment) => {
      let mappedComment: MappedComment = {
        id: comment.id,
        postingCommentTypeId: comment.groupEventId,
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

    function assignReplies(comment: MappedComment) {
      if (replyMap[comment.id]) {
        comment.reply = replyMap[comment.id];
        comment.reply.forEach(assignReplies);
      }
    }

    mappedComments.forEach(assignReplies);

    return mappedComments;
  }
}
