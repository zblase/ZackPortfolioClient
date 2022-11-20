import { HttpClient } from '@angular/common/http';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  downloadResume(ext: string) {
    //var blob = new Blob()
    var test = fileSaver.saveAs('http://localhost:3000/resume-files/ZackBlaseResume' + ext, 'idk')
    console.dir(test);
    return


    this.http.get('http://localhost:3000/resume-files/ZackBlaseResume' + ext, {responseType: 'arraybuffer'}).subscribe((response) => {
      let blob:any = new Blob([response], { type: 'text/json; charset=utf-8' });
      const url= window.URL.createObjectURL(blob);
window.open(url);
fileSaver.saveAs(blob, 'employees.json');
    }, (error) => {
      console.error(error);
    })
		//return this.http.get('http://localhost:8080/employees/download', {responseType: 'arraybuffer'});
  }
}