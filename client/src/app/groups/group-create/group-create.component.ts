import { Component, HostListener, inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FanGroup } from '../../_models/fanGroup';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { NgFor } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { GroupService } from '../../_services/group.service';

@Component({
  selector: 'app-group-create',
  standalone: true,
  imports: [FormsModule, FileUploadModule, NgFor],
  templateUrl: './group-create.component.html',
  styleUrl: './group-create.component.css',
})
export class GroupCreateComponent {
  @ViewChild('createForm') createForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event: any) {
    if (this.createForm?.dirty) {
      $event.returnValue = true;
    }
  }
  private groupService = inject(GroupService);
  private toastr = inject(ToastrService);

  mainPhotoUrl: string | ArrayBuffer | null = './assets/user.png';
  coverPhotoUrl: string | ArrayBuffer | null = './assets/group.png';

  hasBaseDropZoneOver = false;
  group: FanGroup = new FanGroup();

  typeOptions = ['Badminton', 'Football', 'Others'];

  handleUploadFile(file: File, isMainImage: boolean = false) {
    if (isMainImage) {
      const existingMainImageIndex = this.group.groupPhotos.findIndex(
        (photo) => photo.isMainImage
      );
      if (existingMainImageIndex !== -1) {
        this.group.groupPhotos[existingMainImageIndex] = { file, isMainImage };
      } else {
        this.group.groupPhotos.push({ file, isMainImage });
      }
    } else {
      this.group.groupPhotos.push({ file, isMainImage: false });
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

  createGroup() {
    console.log(this.group);
    this.groupService.createGroup(this.group).subscribe({
      next: (_) => {
        this.toastr.success('Group created successfully!');
        this.createForm?.reset(this.group);
      },
      error: (_) => {
        this.toastr.error('Failed to create group');
      },
    });
  }
}
