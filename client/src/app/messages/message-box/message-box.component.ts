import { Component, inject, input, output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TimeagoModule } from 'ngx-timeago';
import { MessageService } from '../../_services/message.service';
import { AccountService } from '../../_services/account.service';
import { Member } from '../../_models/member';

@Component({
  selector: 'app-message-box',
  standalone: true,
  imports: [TimeagoModule, FormsModule],
  templateUrl: './message-box.component.html',
  styleUrl: './message-box.component.css',
})
export class MessageBoxComponent {
  @ViewChild('messageForm') messageForm?: NgForm;
  @ViewChild('scrollMe') scrollContainer?: any;
  messageService = inject(MessageService);
  private accountService = inject(AccountService);
  selectedUser = input.required<Member>();
  isCloseBox = output<boolean>();
  messageContent = '';

  ngOnChanges() {
    const user = this.accountService.currentUser();
    if (!user) return;
    this.messageService.createHubConnection(user, this.selectedUser().userName);
  }

  sendMessage() {
    this.messageService
      .sendMessage(this.selectedUser().userName, this.messageContent)
      .then(() => {
        this.messageForm?.reset();
        this.scrollToBottom();
      });
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
    this.isCloseBox.emit(true);
  }
}
