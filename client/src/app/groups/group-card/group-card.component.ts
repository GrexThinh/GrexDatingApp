import { Component, computed, inject, input } from '@angular/core';
import { LikesService } from '../../_services/likes.service';
import { PresenceService } from '../../_services/presence.service';
import { RouterLink } from '@angular/router';
import { FanGroup } from '../../_models/fanGroup';

@Component({
  selector: 'app-group-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './group-card.component.html',
  styleUrl: './group-card.component.css',
})
export class GroupCardComponent {
  private likeService = inject(LikesService);
  private presenceService = inject(PresenceService);
  group = input.required<FanGroup>();

  getMainPhotoUrl(): string {
    return (
      this.group().photos?.find((photo: any) => photo.isMain)?.url ||
      './assets/user.png'
    );
  }

  hasLiked() {
    return true;
  }
  toggleLike() {
    throw new Error('Method not implemented.');
  }

  // hasLiked = computed(() =>
  //   this.likeService.likeIds().includes(this.group().id)
  // );

  // isOnline = computed(() =>
  //   this.presenceService.onlineUsers().includes(this.group().userName)
  // );

  // toggleLike() {
  //   this.likeService.toggleLike(this.group().id).subscribe({
  //     next: () => {
  //       if (this.hasLiked()) {
  //         this.likeService.likeIds.update((ids) =>
  //           ids.filter((x) => x !== this.group().id)
  //         );
  //       } else {
  //         this.likeService.likeIds.update((ids) => [...ids, this.group().id]);
  //       }
  //     },
  //   });
  // }
}
