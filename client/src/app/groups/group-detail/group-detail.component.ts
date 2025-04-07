import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import {
  AccordionComponent,
  AccordionPanelComponent,
} from 'ngx-bootstrap/accordion';
import { TabsModule } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-group-detail',
  standalone: true,
  imports: [
    CarouselModule,
    CommonModule,
    AccordionComponent,
    AccordionPanelComponent,
    TabsModule,
  ],
  templateUrl: './group-detail.component.html',
  styleUrl: './group-detail.component.css',
})
export class GroupDetailComponent {
  itemsPerSlide = 2;
  singleSlideOffset = true;
  noWrap = false;

  slidesChangeMessage = '';

  slides = [
    {
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWwh016mg6snHN1iSI6d4y0DICMUO1_BbvtTvhuy28g3ob5tAFWv2kAhb-L5x31OfQaXY&usqp=CAU',
    },
    {
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmdJuxl1begd-_7d-4bGc6aLHVrEYIpBGWzJ0CjEuZXXKpo--AEjMQOdYFaf38hv5lFeU&usqp=CAU',
    },
    {
      image:
        'https://t3.ftcdn.net/jpg/02/70/35/00/360_F_270350073_WO6yQAdptEnAhYKM5GuA9035wbRnVJSr.jpg',
    },
  ];

  onSlideRangeChange(indexes: number[] | void): void {
    this.slidesChangeMessage = `Slides have been switched: ${indexes}`;
  }
}
