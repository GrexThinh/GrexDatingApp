import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  inject,
  input,
  output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { GroupPost } from '../../_models/groupPost';
import { GroupPostService } from '../../_services/group-post.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../_models/user';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.css',
})
export class PostCreateComponent {
  @ViewChild('createForm') createForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event: any) {
    if (this.createForm?.dirty) {
      $event.returnValue = true;
    }
  }
  groupPostService = inject(GroupPostService);
  private toastr = inject(ToastrService);
  currentUser = input.required<User | null>();
  groupId = input.required<string | undefined>();
  createdPost = output<GroupPost>();
  post: GroupPost = new GroupPost();
  photoUrls: (string | ArrayBuffer | null)[] = [];

  ngOnChanges() {
    const userId = this.currentUser()?.id;
    if (userId) {
      this.post.userId = userId;
    }
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

  createPost() {
    console.log(this.post);
    if (this.groupId()) this.post.fanGroupId = this.groupId();
    this.groupPostService.createGroupPost(this.post).subscribe({
      next: (_) => {
        this.toastr.success('Post created successfully!');
        this.createdPost.emit(this.post);
        this.createForm?.reset(this.post);
        this.photoUrls = [];
      },
      error: (_) => {
        this.toastr.error('Failed to create post');
      },
    });
  }

  cancelPost() {
    this.createForm?.reset(this.post);
    this.photoUrls = [];
  }
}
