import { inject, Injectable, signal } from '@angular/core';
import { FanGroup, FanGroupParams } from '../_models/fanGroup';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PaginatedResult } from '../_models/pagination';
import { setPaginatedRespone, setPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  paginatedResult = signal<PaginatedResult<FanGroup[]> | null>(null);
  groupParams = signal<FanGroupParams>(new FanGroupParams());

  resetUserParams() {
    this.groupParams.set(new FanGroupParams());
  }

  getFanGroups() {
    let params = setPaginationHeaders(
      this.groupParams().pageNumber,
      this.groupParams().pageSize
    );

    params = params.append(
      'minNumberOfMembers',
      this.groupParams().minNumberOfMembers
    );

    params = params.append('location', this.groupParams().location);

    if (this.groupParams().type !== 'All') {
      params = params.append('type', this.groupParams().type);
    }

    return this.http
      .get<FanGroup[]>(this.baseUrl + 'fangroup', {
        observe: 'response',
        params,
      })
      .subscribe({
        next: (response) => {
          setPaginatedRespone(response, this.paginatedResult);
        },
      });
  }

  createGroup(group: FanGroup) {
    const formData = new FormData();

    formData.append('name', group.name);
    formData.append('description', group.description);
    formData.append('type', group.type);
    formData.append('location', group.location);

    group.groupPhotos.forEach((photo, index) => {
      formData.append(
        `groupPhotos[${index}].file`,
        photo.file,
        photo.file.name
      );
      formData.append(
        `groupPhotos[${index}].isMainImage`,
        String(photo.isMainImage)
      );
    });

    return this.http.post<FanGroup>(this.baseUrl + 'fangroup', formData);
  }

  updateGroup(group: FanGroup) {
    return this.http.put<FanGroup>(this.baseUrl + 'fangroup', group).pipe();
  }

  deleteGroup(group: FanGroup) {
    return this.http
      .delete(this.baseUrl + 'fangroup/' + group.id)
      .pipe
      // tap(() => {
      //   this.groups.update((groups) =>
      //     groups.map((m) => {
      //       if (m.photos.includes(photo)) {
      //         m.photos = m.photos.filter((x) => x.id !== photo.id);
      //       }
      //       return m;
      //     })
      //   );
      // })
      ();
  }
}
