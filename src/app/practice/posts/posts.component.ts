import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Post } from './post.model';
import { PostsService } from './post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  private postsSub!: Subscription;
  edittingId: string = '-';

  constructor(public postsService: PostsService, public dialog: MatDialog, private formBuilder: FormBuilder) { }

  postForm = this.formBuilder.group({
    title: '',
    content: ''
  })

  ngOnInit() {
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.posts = posts
    });
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

  enteredTitle: string = "";
  enteredContent: string = "";

  onAddPost(form: NgForm) {
    this.postsService.addPost(form.value.title, form.value.content);
    form.resetForm();
  }

  openDialog(post: Post) {
    const dialogRef = this.dialog.open(DialogEditPost, {
      data: { title: post.title, post: { ...post } },
      width: '50%',
      height: '40%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.postsService.updatePost(result.data);
      }
    });
  }

  onUpdatePost(post: Post) {
    this.postsService.updatePost(post);
  }

  onDelete(id: string) {
    this.postsService.deletePost(id);
  }
}


@Component({
  selector: 'dialog-edit-post',
  template: `
  <div mat-dialog-content style="max-height: 100%; height: 100%; display: flex; flex-flow: column nowrap;">
    <h1 mat-dialog-title>Edit Post - "{{data.title}}"</h1>
    <form (submit)="onSubmit()" [formGroup]="dialogForm" style="display: flex; flex-flow: column nowrap; flex: 1;">
      <mat-form-field appearance="outline">
        <input matInput type="text" name="title" id="title" class="form-control" placeholder="Post Title" [(ngModel)]="data.post.title" required #title="ngModel">
        <mat-error *ngIf="title.invalid">Invalid title</mat-error>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <textarea matInput rows="auto" name="content" placeholder="Post Content" [(ngModel)]="data.post.content" required #content="ngModel"></textarea>
        <mat-error *ngIf="content.invalid">Invalid content</mat-error>
      </mat-form-field>
      <div mat-dialog-actions align="end">
        <button mat-button mat-dialog-close color="warn">Cancel</button>
        <button mat-button type="submit" cdkFocusInitial color="primary">Save</button>
      </div>
    </form>
  </div>`,
  styles: [`

.mat-dialog-content {
  overflow: hidden;
}

.mat-dialog-actions {
  flex: 1;
  margin: 0;
  align-items: flex-end;
}
  `]
})
export class DialogEditPost {
  constructor(
    public dialogRef: MatDialogRef<DialogEditPost>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, post: Post }, private formBuilder: FormBuilder
  ) {
  }

  dialogForm = this.formBuilder.group({
    title: '',
    content: ''
  })

  onSubmit() {
    const newPost: Post = { id: this.data.post.id, title: this.dialogForm.value.title!, content: this.dialogForm.value.content! }
    this.dialogRef.close({ data: newPost });
  }
}