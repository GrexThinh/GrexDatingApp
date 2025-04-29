import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { GroupPostService } from '../../_services/group-post.service';
import { GroupPost } from '../../_models/groupPost';

@Component({
  selector: 'app-post-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './post-modal.component.html',
  styleUrl: './post-modal.component.css',
})
export class PostModalComponent {
  @ViewChild('postForm') postForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event: any) {
    if (this.postForm?.dirty) {
      $event.returnValue = true;
    }
  }
  bsModalRef = inject(BsModalRef);
  private postService = inject(GroupPostService);
  private toastr = inject(ToastrService);
  title = '';
  isCreated = false;
  isUpdated = false;

  post = new GroupPost();
  photoUrls: (string | ArrayBuffer | null)[] = [];

  ngOnInit() {
    this.photoUrls.push(this.post.photos[0].url ?? './assets/group.png');
  }

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.photoUrls.push(reader.result);
        };
        reader.readAsDataURL(file);
        this.post.groupPostPhotos.push({ file });
      });
    }
  }

  submitEvent() {
    console.log(this.post);
    this.postService.updateGroupPost(this.post).subscribe({
      next: (_) => {
        this.toastr.success('Post updated successfully!');
        this.isUpdated = true;
        this.bsModalRef.hide();
        this.postForm?.reset(this.post);
      },
      error: (err) => {
        this.toastr.error('Post updated fail!');
      },
    });
  }
}
