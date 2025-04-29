import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PaginatedResult } from '../_models/pagination';
import { setPaginatedRespone, setPaginationHeaders } from './paginationHelper';
import {
  GroupPost,
  GroupPostComment,
  GroupPostCommentCreate,
  GroupPostParams,
} from '../_models/groupPost';

@Injectable({
  providedIn: 'root',
})
export class GroupPostService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  paginatedResult = signal<PaginatedResult<GroupPost[]> | null>(null);
  groupPostParams = signal<GroupPostParams>(new GroupPostParams());

  resetUserParams() {
    this.groupPostParams.set(new GroupPostParams());
  }

  getGroupPosts() {
    let params = setPaginationHeaders(
      this.groupPostParams().pageNumber,
      this.groupPostParams().pageSize
    );

    if (this.groupPostParams().fanGroupId) {
      params = params.append('fanGroupId', this.groupPostParams().fanGroupId);
    }

    params = params.append('content', this.groupPostParams().content);
    params = params.append(
      'postStartTime',
      this.groupPostParams().postStartTime
    );
    params = params.append('postEndTime', this.groupPostParams().postEndTime);

    return this.http
      .get<GroupPost[]>(this.baseUrl + 'grouppost', {
        observe: 'response',
        params,
      })
      .subscribe({
        next: (response) => {
          setPaginatedRespone(response, this.paginatedResult);
        },
      });
  }

  createGroupPost(post: GroupPost) {
    const formData = new FormData();

    if (post.fanGroupId) {
      formData.append('fanGroupId', post.fanGroupId);
    }
    formData.append('content', post.content);
    formData.append('userId', post.userId.toString());
    formData.append('description', post.description);

    post.groupPostPhotos.forEach((photo, index) => {
      formData.append(`files`, photo.file, photo.file.name);
    });

    return this.http.post<any>(this.baseUrl + 'grouppost', formData);
  }

  updateGroupPost(post: GroupPost) {
    return this.http.put<GroupPost>(
      this.baseUrl + 'grouppost/' + post.id,
      post
    );
  }

  deleteGroupPost(post: GroupPost) {
    return this.http.delete(this.baseUrl + 'grouppost/' + post.id);
  }

  getGroupPostComments(postId: string) {
    return this.http.get<GroupPostComment[]>(
      this.baseUrl + 'grouppostcomment/' + postId
    );
  }

  createGroupPostComment(comment: GroupPostCommentCreate) {
    return this.http.post<any>(this.baseUrl + `grouppostcomment`, comment);
  }

  toggleReaction(postId: string) {
    return this.http.get<any>(
      this.baseUrl + `grouppostreaction/me/reaction/` + postId
    );
  }
}
