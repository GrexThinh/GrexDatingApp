import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginatedResult } from '../_models/pagination';
import { setPaginatedRespone, setPaginationHeaders } from './paginationHelper';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';
import { User } from '../_models/user';
import { Group } from '../_models/group';
import { GroupMessage } from '../_models/groupMessage';

@Injectable({
  providedIn: 'root',
})
export class GroupMessageService {
  baseUrl = environment.apiUrl;
  hubUrl = environment.hubsUrl;
  private http = inject(HttpClient);
  hubConnection?: HubConnection;
  paginatedResult = signal<PaginatedResult<GroupMessage[]> | null>(null);
  messageThread = signal<GroupMessage[]>([]);

  createHubConnection(user: User, groupId: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'groupmessage?group=' + groupId, {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch((error) => console.log(error));

    this.hubConnection.on('ReceiveMessageThread', (messages) => {
      this.messageThread.set(messages);
    });

    this.hubConnection.on('NewMessage', (message) => {
      this.messageThread.update((messages) => [...messages, message]);
    });

    this.hubConnection.on('UpdatedGroup', (group: Group) => {
      if (group.connections.some((x) => x.username === user.username)) {
        this.messageThread.update((messages) => {
          messages.forEach((message) => {
            if (!message.dateRead) {
              message.dateRead = new Date(Date.now());
            }
          });
          return messages;
        });
      }
    });
  }

  stopHubConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop().catch((error) => console.log(error));
    }
  }

  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = setPaginationHeaders(pageNumber, pageSize);

    params = params.append('Container', container);

    return this.http
      .get<GroupMessage[]>(this.baseUrl + 'messages', {
        observe: 'response',
        params,
      })
      .subscribe({
        next: (response) => setPaginatedRespone(response, this.paginatedResult),
      });
  }

  getMessageThread(username: string) {
    return this.http.get<GroupMessage[]>(
      this.baseUrl + 'groupmessage/thread/' + username
    );
  }

  async sendMessage(groupId: string, content: string) {
    const payload = {
      fanGroupId: groupId,
      content: content,
    };
    return this.hubConnection?.invoke('SendMessage', payload);
  }

  deleteMessage(id: number) {
    return this.http.delete<GroupMessage>(this.baseUrl + 'groupmessage/' + id);
  }
}
