import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { stringify } from "querystring";
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http
      .get<{ message: string, posts: any }>(
        'http://localhost:3000/api/posts'
      )
      .pipe(map((postData) => {
        return postData.posts.map((post: { title: any; content: any; _id: any; }) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        });
      }))
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: '', title: title, content: content };
    this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
    .subscribe(res => {
      post.id = res.postId;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
    });
  }

  updatePost(post: Post) {
    this.http.put('http://localhost:3000/api/posts/' + post.id, post)
    .subscribe(response => {
      const index = this.posts.findIndex((p) => p.id == post.id);
      this.posts.splice(index, index, post);
      this.postsUpdated.next([...this.posts]);
    });
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
    .subscribe(() => {
      const updatedPosts = this.posts.filter(post => {
        post.id !== postId;
      });
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts])
    });
  }
}