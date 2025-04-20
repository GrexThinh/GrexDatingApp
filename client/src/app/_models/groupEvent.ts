import { GroupEventUserRole } from '../_enums/role';
import { GroupEventUserStatus } from '../_enums/status';
import { Member } from './member';
import { GroupEventPhoto, Photo } from './photo';

export interface GroupEvent {
  id: string;
  name: string;
  description: string;
  location: string;
  photos: Photo[];
  groupEventPhotos: GroupEventPhoto[];
  createDate: string;
  updateDate: string;
  eventStartTime: string;
  eventEndTime: string;
  startEndTime: Date[];
  currentUserStatus: GroupEventUserStatus | null;
}

export interface GroupEventMember {
  member: Member;
  status: GroupEventUserStatus | null;
  roles: GroupEventUserRole[];
}

export interface GroupEventComment {
  id: string;
  groupEventId: string;
  description?: string;
  createDate: string;
  updateDate: string;
  sendDate: string;
  content: string;
  senderId: number;
  parentId?: string;
  senderDeleted: boolean;
  sender: Member;
}

export interface GroupEventUser {
  id: string;
  groupEventId: string;
  description?: string;
  createDate: string;
  updateDate: string;
  userId: number;
  user: Member;
  joinDate: string;
  status: GroupEventUserStatus;
  roles: GroupEventUserRole[];
}

export class GroupEvent {
  id = '';
  name = '';
  description = '';
  location = '';
  createDate = '';
  updateDate = '';
  eventStartTime = '';
  eventEndTime = '';
  photos: Photo[] = [];
  groupEventPhotos: GroupEventPhoto[] = [];
  startEndTime: Date[] = [];
  members: GroupEventMember[] = [];
  currentUserStatus: GroupEventUserStatus | null = null;
}

export class GroupEventParams {
  name = '';
  location = '';
  status = '';
  eventStartTime = '';
  eventEndTime = '';
  startEndTime = [];
  pageNumber = 1;
  pageSize = 5;
}

export class GroupEventCommentCreate {
  groupEventId = '';
  content = '';
  senderId = 0;
  parentId: string | undefined = undefined;
}

// export interface MappedGroupEventComment {
//   id: string;
//   groupEventId: string;
//   senderId: number;
//   senderDeleted: boolean;
//   senderPhotoUrl: string;
//   name: string;
//   sendDate: string;
//   content: string;
//   reply: MappedGroupEventComment[];
// }

export class CommentCreate {
  postingCommentTypeId = '';
  content = '';
  senderId = 0;
  parentId: string | undefined = undefined;
}

export interface MappedComment {
  id: string;
  postingCommentTypeId: string;
  senderId: number;
  senderDeleted: boolean;
  senderPhotoUrl: string;
  name: string;
  sendDate: string;
  content: string;
  reply: MappedComment[];
}
