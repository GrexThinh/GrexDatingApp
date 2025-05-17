import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { AccountService } from './_services/account.service';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { ThemeService } from './_services/theme.service';
import { MessageBoxComponent } from './messages/message-box/message-box.component';
import { MessageGroupBoxComponent } from './messages/message-group-box/message-group-box.component';
import { GroupService } from './_services/group.service';
import { LikesService } from './_services/likes.service';
import { PresenceService } from './_services/presence.service';
import { FanGroup } from './_models/fanGroup';
import { Member } from './_models/member';
import { GroupUserStatus } from './_enums/status';
import { setPaginatedRespone } from './_services/paginationHelper';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavComponent,
    NgxSpinnerComponent,
    MessageBoxComponent,
    MessageGroupBoxComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Fan Booking';
  private accountService = inject(AccountService);
  private themeService = inject(ThemeService);
  private groupService = inject(GroupService);
  private likesService = inject(LikesService);
  private presenceService = inject(PresenceService);
  groupStatus = GroupUserStatus;
  otherUser?: Member;
  selectedGroup?: FanGroup;
  isOpenMessage = true;
  pageNumber = 1;
  pageSize = 5;
  likedMems: Member[] = [];
  joinedGroup: FanGroup[] = [];

  ngOnInit(): void {
    this.setCurrentUser();
    this.applySavedTheme();
    this.loadLikes();
    this.loadGroups();
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }

  applySavedTheme() {
    const currentTheme = this.themeService.getTheme();
    this.themeService.setTheme(currentTheme);
  }

  loadGroups() {
    this.groupService.getFanGroups().subscribe({
      next: (response) => {
        setPaginatedRespone(response, this.groupService.paginatedResult);
        this.joinedGroup = response.body ?? [];
      },
      error: (err) => console.error(err),
    });
  }

  loadLikes() {
    this.likesService
      .getLikes('liked', this.pageNumber, this.pageSize)
      .subscribe({
        next: (response) => {
          setPaginatedRespone(response, this.likesService.paginatedResult);
          this.likedMems = response.body ?? [];
        },
        error: (err) => console.error(err),
      });
  }

  isOnline = (userName: string) => {
    return computed(() =>
      this.presenceService.onlineUsers().includes(userName)
    );
  };

  toggleMessage() {
    this.isOpenMessage = !this.isOpenMessage;
  }

  getMainGroupPhoto(group: FanGroup): string {
    const mainPhoto = group?.photos?.find((photo) => photo.isMain);
    return mainPhoto?.url ?? './assets/group.png';
  }

  selectOtherUser(member: Member): void {
    this.otherUser = member;
  }

  onCloseUserBox(event: boolean) {
    this.otherUser = undefined;
  }

  selectGroup(group: FanGroup): void {
    this.selectedGroup = group;
  }

  onCloseGroupBox(event: boolean) {
    this.selectedGroup = undefined;
  }
}
