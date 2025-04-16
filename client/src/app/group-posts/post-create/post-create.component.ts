import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.css',
})
export class PostCreateComponent {
  createPost() {
    throw new Error('Method not implemented.');
  }
  photoUrls: (string | ArrayBuffer | null)[] = [];

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.photoUrls.push(reader.result);
        };
        reader.readAsDataURL(file);

        // this.group.groupPhotos.push({ file, isMainImage: false });
      });
    }
  }
}
