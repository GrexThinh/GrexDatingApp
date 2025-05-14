import { Component, inject, input, output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AccountService } from '../../_services/account.service';
import { FanGroup } from '../../_models/fanGroup';
import { TimeagoModule } from 'ngx-timeago';
import { GroupMessageService } from '../../_services/group-message.service';

@Component({
  selector: 'app-message-group-box',
  standalone: true,
  imports: [TimeagoModule, FormsModule],
  templateUrl: './message-group-box.component.html',
  styleUrl: './message-group-box.component.css',
})
export class MessageGroupBoxComponent {
  @ViewChild('messageForm') messageForm?: NgForm;
  @ViewChild('scrollMe') scrollContainer?: any;
  messageService = inject(GroupMessageService);
  private accountService = inject(AccountService);
  selectedGroup = input.required<FanGroup>();
  isCloseGroupBox = output<boolean>();
  messageContent = '';

  ngOnChanges() {
    const user = this.accountService.currentUser();
    if (!user) return;
    const groupId = this.selectedGroup().id;
    this.messageService.createHubConnection(user, groupId);
  }

  sendMessage() {
    const groupId = this.selectedGroup().id;
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

  closeBox() {
    this.isCloseGroupBox.emit(true);
  }
}
