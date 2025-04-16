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
import { GroupEventCommentCreate } from '../../_models/groupEvent';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../_services/account.service';
import { User } from '../../_models/user';

@Component({
  selector: 'app-add-comment',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-comment.component.html',
  styleUrl: './add-comment.component.css',
})
export class AddCommentComponent {
  eventId = input.required<string>();
  @ViewChild('commentForm') commentForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event: any) {
    if (this.commentForm?.dirty) {
      $event.returnValue = true;
    }
  }
  private eventService = inject(GroupEventService);
  private toastr = inject(ToastrService);
  private accountService = inject(AccountService);
  addedComment = output<GroupEventCommentCreate>();
  currentUser: User | null = null;
  comment: GroupEventCommentCreate = new GroupEventCommentCreate();

  ngOnChanges() {
    this.currentUser = this.accountService.currentUser();
    if (!this.currentUser) return;
    this.comment = {
      ...this.comment,
      groupEventId: this.eventId(),
      senderId: this.currentUser.id,
    };
  }

  addComment() {
    console.log(this.comment);
    this.eventService.createGroupEventComment(this.comment).subscribe({
      next: (_) => {
        this.toastr.success('Comment added successfully!');
        this.addedComment.emit(this.comment);
        this.commentForm?.reset(this.comment);
      },
      error: (_) => {
        this.toastr.error('Failed to add comment');
      },
    });
  }
}
