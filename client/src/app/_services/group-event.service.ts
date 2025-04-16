import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PaginatedResult } from '../_models/pagination';
import { setPaginatedRespone, setPaginationHeaders } from './paginationHelper';
import {
  GroupEvent,
  GroupEventComment,
  GroupEventCommentCreate,
  GroupEventParams,
} from '../_models/groupEvent';
import { GroupEventUserStatus } from '../_enums/status';

@Injectable({
  providedIn: 'root',
})
export class GroupEventService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  paginatedResult = signal<PaginatedResult<GroupEvent[]> | null>(null);
  groupParams = signal<GroupEventParams>(new GroupEventParams());

  resetUserParams() {
    this.groupParams.set(new GroupEventParams());
  }

  getGroupEvents() {
    let params = setPaginationHeaders(
      this.groupParams().pageNumber,
      this.groupParams().pageSize
    );

    params = params.append('name', this.groupParams().name);
    params = params.append('location', this.groupParams().location);
    params = params.append('eventStartTime', this.groupParams().eventStartTime);
    params = params.append('eventEndTime', this.groupParams().eventEndTime);

    if (this.groupParams().status !== 'All') {
      params = params.append('status', this.groupParams().status);
    }

    return this.http
      .get<GroupEvent[]>(this.baseUrl + 'groupevent', {
        observe: 'response',
        params,
      })
      .subscribe({
        next: (response) => {
          setPaginatedRespone(response, this.paginatedResult);
        },
      });
  }

  // getFanGroup(groupId: string) {
  //   return this.http.get<GroupEvent>(this.baseUrl + 'fangroup/' + groupId);
  // }

  createGroupEvent(event: GroupEvent) {
    const formData = new FormData();

    formData.append('name', event.name);
    formData.append('location', event.location);
    formData.append('description', event.description);
    formData.append('eventStartTime', event.startEndTime[0].toISOString());
    formData.append('eventEndTime', event.startEndTime[1].toISOString());

    event.groupEventPhotos.forEach((photo, index) => {
      formData.append(`files`, photo.file, photo.file.name);
    });

    return this.http.post<any>(this.baseUrl + 'groupevent', formData);
  }

  updateGroupEvent(event: GroupEvent) {
    return this.http.put<GroupEvent>(
      this.baseUrl + 'groupevent/' + event.id,
      event
    );
  }

  deleteGroupEvent(event: GroupEvent) {
    return this.http.delete(this.baseUrl + 'groupevent/' + event.id);
  }

  createGroupEventUser(eventId: string, status: GroupEventUserStatus) {
    return this.http.post<any>(
      this.baseUrl + `groupeventuser/${eventId}/${status}`,
      null
    );
  }

  deleteGroupEventUser(eventId: string) {
    return this.http.delete<any>(this.baseUrl + 'groupeventuser/' + eventId);
  }

  updateGroupEventUserStatus(eventId: string, userId: number, status: number) {
    const payload = {
      EventId: eventId,
      UserId: userId,
      Status: status,
    };
    return this.http.post<any>(this.baseUrl + 'groupeventuser/status', payload);
  }

  // updateGroupUserRole(eventId: string, userId: number, roles: GroupUserRole[]) {
  //   const payload = {
  //     GroupId: eventId,
  //     UserId: userId,
  //     Roles: roles,
  //   };
  //   return this.http.post<any>(this.baseUrl + 'fangroupuser/role', payload);
  // }

  getGroupEventComments(eventId: string) {
    return this.http.get<GroupEventComment[]>(
      this.baseUrl + 'groupeventcomment/' + eventId
    );
  }

  createGroupEventComment(comment: GroupEventCommentCreate) {
    return this.http.post<any>(this.baseUrl + `groupeventcomment`, comment);
  }
}
