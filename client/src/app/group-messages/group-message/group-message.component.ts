import { Component, inject, input, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TimeagoModule } from 'ngx-timeago';
import { GroupMessageService } from '../../_services/group-message.service';
import { User } from '../../_models/user';

@Component({
  selector: 'app-group-message',
  standalone: true,
  imports: [TimeagoModule, FormsModule],
  templateUrl: './group-message.component.html',
  styleUrl: './group-message.component.css',
})
export class GroupMessageComponent {
  @ViewChild('messageForm') messageForm?: NgForm;
  @ViewChild('scrollMe') scrollContainer?: any;
  messageService = inject(GroupMessageService);
  currentUser = input.required<User | null>();
  groupId = input.required<string | undefined>();
  messageContent = '';

  sendMessage() {
    const groupId = this.groupId();
    if (groupId) {
      this.messageService.sendMessage(groupId, this.messageContent).then(() => {
        this.messageForm?.reset();
        this.scrollToBottom();
      });
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    }
  }
}
