import { Component, HostListener, inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FanGroup } from '../../_models/fanGroup';
import { ToastrService } from 'ngx-toastr';
import { GroupService } from '../../_services/group.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-group-edit',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './group-edit.component.html',
  styleUrl: './group-edit.component.css',
})
export class GroupEditComponent {
  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  private groupService = inject(GroupService);
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);
  group?: FanGroup;
  mainPhotoUrl: string | ArrayBuffer | null = './assets/user.png';
  coverPhotoUrl: string | ArrayBuffer | null = './assets/group.png';

  typeOptions = ['Badminton', 'Football', 'Others'];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const groupId = params.get('id');
      if (groupId) {
        this.loadGroup(groupId);
      }
    });
  }

  loadGroup(id: string) {
    this.groupService.getFanGroup(id).subscribe({
      next: (group) => {
        this.group = group;
        this.mainPhotoUrl =
          this.group?.photos?.find((photo) => photo.isMain)?.url ||
          './assets/user.png';
        this.coverPhotoUrl =
          this.group?.photos?.find((photo) => !photo.isMain)?.url ||
          './assets/group.png';
      },
    });
  }

  updateGroup() {
    if (this.group) {
      this.groupService.updateGroup(this.group).subscribe({
        next: (_) => {
          this.toastr.success('Group updated successfully!');
          this.editForm?.reset(this.group);
        },
        error: (err) => {
          this.toastr.error('Group updated fail!');
        },
      });
    }
  }

  handleUploadFile(file: File, isMainImage: boolean = false) {
    if (this.group) {
      if (isMainImage) {
        const existingMainImageIndex = this.group.groupPhotos.findIndex(
          (photo) => photo.isMainImage
        );
        if (existingMainImageIndex !== -1) {
          this.group.groupPhotos[existingMainImageIndex] = {
            file,
            isMainImage,
          };
        } else {
          this.group.groupPhotos.push({ file, isMainImage });
        }
      } else {
        this.group.groupPhotos.push({ file, isMainImage: false });
      }
    }
  }

  onFileChange(event: any, isMainImage: boolean = false) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (isMainImage) {
            this.mainPhotoUrl = reader.result;
          } else {
            this.coverPhotoUrl = reader.result;
          }
        };
        reader.readAsDataURL(file);

        this.handleUploadFile(file, isMainImage);
      });
    }
  }
}
