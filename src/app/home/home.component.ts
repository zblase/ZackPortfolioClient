import { HttpClient } from '@angular/common/http';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import * as fileSaver from 'file-saver';
import { environment } from 'src/environments/environment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageDialogComponent } from './image-dialog/image-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  pokediaImgs: string[] = ['IMG_3490.PNG', 'IMG_3491.PNG', 'IMG_3492.PNG', 'IMG_3493.PNG', 'IMG_3494.PNG', 'IMG_3495.PNG', 'IMG_3496.PNG'];

  constructor(private http: HttpClient, public dialog: MatDialog) { }

  ngOnInit() {
    
  }

  downloadResume(ext: string) {
    fileSaver.saveAs(environment.apiUrl + 'resume-files/ZackBlaseResume' + ext, 'ZackBlaseResume')
  }

  openImageDialog(images: string[]) {
    this.dialog.open(ImageDialogComponent, {
      data: images,
      width: '90%',
      maxWidth: '900px',
      height: '90%',
      maxHeight: '750px'
    });
  }
}