import { Component, inject, input } from '@angular/core';
import { GroupPost, GroupPostComment } from '../../_models/groupPost';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass, NgIf, NgStyle } from '@angular/common';
import { TimeagoModule } from 'ngx-timeago';
import { AddCommentComponent } from '../../comments/add-comment/add-comment.component';
import { DisplayCommentComponent } from '../../comments/display-comment/display-comment.component';
import { CommentCreate, MappedComment } from '../../_models/groupEvent';
import { PostingComment } from '../../_models/common';
import { CommentType } from '../../_enums/common';
import { GroupPostService } from '../../_services/group-post.service';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ReactionType } from '../../_enums/reaction';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PostModalComponent } from '../../modals/post-modal/post-modal.component';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgClass,
    NgStyle,
    CommonModule,
    TimeagoModule,
    AddCommentComponent,
    DisplayCommentComponent,
  ],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css',
})
export class PostCardComponent {
  postService = inject(GroupPostService);
  private toastr = inject(ToastrService);
  private modalService = inject(BsModalService);
  bsModalRef: BsModalRef<PostModalComponent> =
    new BsModalRef<PostModalComponent>();
  post = input.required<GroupPost>();
  localPost?: GroupPost;
  isViewComment = false;
  commentType?: PostingComment;
  comments: MappedComment[] = [];

  totalAddedComment = 0;
  totalReactions = 0;

  ngOnChanges() {
    this.localPost = this.post();
    this.commentType = {
      typeId: this.post().id,
      typeName: CommentType.Post,
    };
    this.totalReactions = this.post().reactions.length;
  }

  loadComments() {
    if (this.post().id) {
      this.postService
        .getGroupPostComments(this.post().id)
        .pipe(map((data) => this.mapComments(data)))
        .subscribe({
          next: (data) => (this.comments = data),
        });
    }
  }

  onAddedComment($event: CommentCreate) {
    this.totalAddedComment++;
    this.loadComments();
  }

  handleViewComment() {
    if (!this.isViewComment) this.loadComments();
    this.isViewComment = true;
  }

  mapComments(data: GroupPostComment[]): MappedComment[] {
    let mappedComments: MappedComment[] = [];
    let replyMap: Record<string, MappedComment[]> = {};

    data.forEach((comment) => {
      let mappedComment: MappedComment = {
        id: comment.id,
        postingCommentTypeId: comment.groupPostId,
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

  toggleReaction() {
    this.postService.toggleReaction(this.post().id).subscribe({
      next: () => {
        if (this.post().reactionByCurrentUser) {
          this.post().reactionByCurrentUser = null;
          this.totalReactions--;
        } else {
          this.post().reactionByCurrentUser = ReactionType.Love;
          this.totalReactions++;
        }
      },
      error: () => this.toastr.error('Failed to react'),
    });
  }

  handleEditPost() {
    const initialState: ModalOptions = {
      class: 'modal-lg',
      initialState: {
        title: 'Update post',
        isUpdated: false,
        post: this.post(),
      },
    };
    this.bsModalRef = this.modalService.show(PostModalComponent, initialState);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef.content?.isUpdated) {
          if (this.bsModalRef.content?.post) {
            this.localPost = this.bsModalRef.content.post;
          }
        }
      },
    });
  }
}
