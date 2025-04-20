import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { GroupCardComponent } from '../group-card/group-card.component';
import { RouterLink } from '@angular/router';
import { GroupService } from '../../_services/group.service';
import { GroupUserStatus } from '../../_enums/status';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [
    FormsModule,
    PaginationModule,
    GroupCardComponent,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.css',
})
export class GroupListComponent {
  groupService = inject(GroupService);
  typeOptions = ['Badminton', 'Football', 'Others'];
  statusOptions = GroupUserStatus;

  constructor() {}

  ngOnInit(): void {
    this.groupService.groupParams().type = 'All';
    this.groupService.groupParams().status = 'All';
    this.loadGroups();
  }

  loadGroups() {
    this.groupService.getFanGroups();
  }
  resetFilters() {
    this.groupService.resetUserParams();
    this.loadGroups();
  }
  pageChanged(event: any) {
    if (this.groupService.groupParams().pageNumber !== event.page) {
      this.groupService.groupParams().pageNumber = event.page;
      this.loadGroups();
    }
  }
}
