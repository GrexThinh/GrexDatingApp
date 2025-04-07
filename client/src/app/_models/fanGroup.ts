import { GroupPhoto, Photo } from './photo';

export interface FanGroup {
  id: string;
  name: string;
  description: string;
  type: string;
  location: string;
  groupPhotos: GroupPhoto[];
  photos: Photo[];
}

export class FanGroupParams {
  type = '';
  location = '';
  minNumberOfMembers = 1;
  pageNumber = 1;
  pageSize = 5;
}
