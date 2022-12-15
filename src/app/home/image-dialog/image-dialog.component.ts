import { Component, Inject } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AnimationEvent } from "@angular/animations";

interface ImageItem {
  url: string;
  state: string;
}

const imgSlide = trigger('imgSlide', [
  state('void', style({left: 'calc(100% + 160px)', opacity: 0.25, scale: 0.85})),
  state('right', style({left: 'calc(90%)', opacity: 0.25, scale: 0.85})),
  state('mid', style({left: 'calc(50%)'})),
  state('left', style({left: 'calc(10%)', opacity: 0.25, scale: 0.85})),
  state('hideLeft', style({left: '-165px', opacity: 0.25, scale: 0.85})),
  transition(':enter', animate('0.25s')),
  transition('* <=> mid', animate('0.25s')),
  transition('left <=> hideLeft', animate('0.25s')),
  transition(':leave', animate('0.25s'))
]);

const currImage = trigger('currImage', [
  state('active', style({scale: 1.35, opacity: 0.6})),
  state('inactive', style({scale: 1, opacity: 0.25})),
  transition('* <=> *', animate('0.1s')),
])

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.css'],
  animations: [imgSlide, currImage]
})
export class ImageDialogComponent {

  currImgs: ImageItem[] = [];
  dots: string[] = [];
  currMid = 0;
  disableShift = false;

  constructor(public dialogRef: MatDialogRef<ImageDialogComponent>, @Inject(MAT_DIALOG_DATA) public images: string[]) {
    this.currImgs = [
      {
        url: images[0],
        state: 'mid'
      },
      {
        url: images[1],
        state: 'right'
      }
    ];

    this.dots.push('active');
    for (let i = 1; i < images.length; i++) {
      this.dots.push('inactive');
    }
  }

  captureStartEvent(event: AnimationEvent) {
    this.disableShift = true;
  }

  captureDoneEvent(event: AnimationEvent) {
    this.disableShift = false;
  }

  shiftRight() {
    this.currMid++;
    if (this.currImgs.length < this.images.length) {
      this.currImgs.push({
        url: this.images[this.currImgs.length],
        state: 'hideRight'
      });

      this.currImgs[this.currMid + 1].state = 'right';
    }
    
    this.currImgs[this.currMid].state = 'mid';
    this.currImgs[this.currMid - 1].state = 'left';

    if (this.currMid > 1) {
      this.currImgs[this.currMid - 2].state = 'hideLeft';
    }

    this.dots[this.currMid] = 'active';
    this.dots[this.currMid - 1] = 'inactive';
  }

  shiftLeft() {
    this.currMid--;

    if (this.currMid > 0) {
      this.currImgs[this.currMid - 1].state = 'left';
    }
    this.currImgs[this.currMid].state = 'mid';
    this.currImgs[this.currMid+1].state = 'right';

    if (this.currMid < this.images.length - 2) {
      this.currImgs.pop();
    }

    this.dots[this.currMid] = 'active';
    this.dots[this.currMid + 1] = 'inactive';
  }
}
