import { Component, HostListener, inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GroupEvent } from '../../_models/groupEvent';
import { CommonModule } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { GroupEventService } from '../../_services/group-event.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-event-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, BsDatepickerModule],
  templateUrl: './event-modal.component.html',
  styleUrl: './event-modal.component.css',
})
export class EventModalComponent {
  @ViewChild('createForm') createForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event: any) {
    if (this.createForm?.dirty) {
      $event.returnValue = true;
    }
  }
  bsModalRef = inject(BsModalRef);
  private eventService = inject(GroupEventService);
  private toastr = inject(ToastrService);
  title = '';
  isCreated = false;
  event = new GroupEvent();
  photoUrl: string | ArrayBuffer | null = './assets/group.png';

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.photoUrl = reader.result;
        };
        reader.readAsDataURL(file);
        this.event.groupEventPhotos.push({ file });
      });
    }
  }

  submitEvent() {
    console.log(this.event);
    this.eventService.createGroupEvent(this.event).subscribe({
      next: (_) => {
        this.toastr.success('Event created successfully!');
        this.isCreated = true;
        this.bsModalRef.hide();
        this.createForm?.reset(this.event);
      },
      error: (err) => {
        this.toastr.error('Event created fail!');
      },
    });
  }
}
