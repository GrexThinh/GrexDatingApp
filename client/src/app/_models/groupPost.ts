import { ReactionType } from '../_enums/reaction';
import { FanGroup } from './fanGroup';
import { Member } from './member';
import { GroupPostPhoto, Photo } from './photo';

export interface GroupPost {
  id: string;
  content: string;
  description: string;
  photos: Photo[];
  groupPostPhotos: GroupPostPhoto[];
  createDate: string;
  updateDate: string;
  userId: number;
  user: Member;
  fanGroupId?: string;
  fanGroup?: FanGroup;
  comments: GroupPostComment[];
  reactions: GroupPostReaction[];
  reactionByCurrentUser: ReactionType | null;
}

export interface GroupPostComment {
  id: string;
  groupPostId: string;
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

export interface GroupPostReaction {
  id: string;
  groupPostId: string;
  description?: string;
  createDate: string;
  updateDate: string;
  reactionDate: string;
  reacterId: number;
  reacter: Member;
}

export class GroupPost {
  id = '';
  description = '';
  content = '';
  createDate = '';
  updateDate = '';
  userId = -1;
  photos: Photo[] = [];
  groupPostPhotos: GroupPostPhoto[] = [];
}

export class GroupPostParams {
  fanGroupId = '';
  content = '';
  postStartTime = '';
  postEndTime = '';
  startEndTime = [];
  pageNumber = 1;
  pageSize = 5;
}

export class GroupPostCommentCreate {
  groupPostId = '';
  content = '';
  senderId = 0;
  parentId: string | undefined = undefined;
}

export interface MappedGroupPostComment {
  id: string;
  groupPostId: string;
  senderId: number;
  senderDeleted: boolean;
  senderPhotoUrl: string;
  name: string;
  sendDate: string;
  content: string;
  reply: MappedGroupPostComment[];
}
