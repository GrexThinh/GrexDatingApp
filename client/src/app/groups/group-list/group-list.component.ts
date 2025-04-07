import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { GroupCardComponent } from '../group-card/group-card.component';
import { RouterLink } from '@angular/router';
import { GroupService } from '../../_services/group.service';

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [FormsModule, PaginationModule, GroupCardComponent, RouterLink],
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.css',
})
export class GroupListComponent {
  groupService = inject(GroupService);
  typeOptions = ['Badmintion', 'Football', 'Others'];

  constructor() {
    this.groupService.groupParams().type = 'All';
  }

  ngOnInit(): void {
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
