import {
  Component,
  HostListener,
  inject,
  input,
  output,
  ViewChild,
} from '@angular/core';
import {
  GroupEventCommentCreate,
  MappedGroupEventComment,
} from '../../_models/groupEvent';
import { GroupEventService } from '../../_services/group-event.service';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../_services/account.service';
import { User } from '../../_models/user';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-reply',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-reply.component.html',
  styleUrl: './add-reply.component.css',
})
export class AddReplyComponent {
  parentComment = input.required<MappedGroupEventComment>();
  @ViewChild('replyForm') replyForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event: any) {
    if (this.replyForm?.dirty) {
      $event.returnValue = true;
    }
  }
  private eventService = inject(GroupEventService);
  private toastr = inject(ToastrService);
  private accountService = inject(AccountService);
  addedReply = output<GroupEventCommentCreate>();
  currentUser: User | null = null;
  reply: GroupEventCommentCreate = new GroupEventCommentCreate();

  ngOnChanges() {
    this.currentUser = this.accountService.currentUser();
    if (this.currentUser && this.parentComment().id) {
      this.reply = {
        ...this.reply,
        groupEventId: this.parentComment().groupEventId,
        parentId: this.parentComment().id,
        senderId: this.currentUser.id,
      };
    }
  }

  addReply() {
    console.log(this.reply);
    this.eventService.createGroupEventComment(this.reply).subscribe({
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
