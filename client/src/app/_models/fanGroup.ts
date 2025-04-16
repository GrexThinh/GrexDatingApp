import { GroupUserRole } from '../_enums/role';
import { GroupUserStatus } from '../_enums/status';
import { Member } from './member';
import { GroupPhoto, Photo } from './photo';

export interface FanGroup {
  id: string;
  name: string;
  description: string;
  type: string;
  location: string;
  currentUserStatus: GroupUserStatus | null;
  groupPhotos: GroupPhoto[];
  photos: Photo[];
  members: FanGroupMember[];
}

export interface FanGroupMember {
  member: Member;
  status: GroupUserStatus | null;
  roles: GroupUserRole[];
}

export class FanGroup {
  name = '';
  description = '';
  id = '';
  type = '';
  location = '';
  currentUserStatus: GroupUserStatus | null = null;
  groupPhotos: GroupPhoto[] = [];
  photos: Photo[] = [];
  members: FanGroupMember[] = [];
}

export class FanGroupParams {
  type = '';
  location = '';
  status = '';
  pageNumber = 1;
  pageSize = 5;
}
