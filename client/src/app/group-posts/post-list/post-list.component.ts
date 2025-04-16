import { Component } from '@angular/core';
import { PostCardComponent } from "../post-card/post-card.component";
import { PostCreateComponent } from "../post-create/post-create.component";

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [PostCardComponent, PostCreateComponent],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent {

}
