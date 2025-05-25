import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, Subject } from "rxjs";
import { PostModel } from "./model/post.model"
import { apiUrl } from "../environment/environment"
import { Router } from "@angular/router";


const BACKEND_URL = apiUrl + '/posts/'

@Injectable({
    providedIn: 'root'
})

export class PostService {

    private posts: PostModel[] = [];
    private postUpdated = new Subject<{ posts: PostModel[], postCount: number }>();


    constructor(private http: HttpClient, private route: Router) { }

    // fetching posts
    getPosts(postsPerPage: number, currentPage: number) {
        const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`

        this.http.get<{ message: string, posts: any, maxPosts: number }>(BACKEND_URL + queryParams)
            .pipe(
                map(postData => {
                    return {
                        posts: postData.posts.map((post: any) => { // transforming data
                            console.log('Before transforming', post)
                            return {
                                title: post.title,
                                content: post.content,
                                id: post._id,
                                imagePath: post.imagePath,
                                creator: post.creator
                            }
                        }), maxPosts: postData.maxPosts
                    }
                }))
            .subscribe((transformedPostData) => {
                console.log(transformedPostData)
                this.posts = transformedPostData.posts;
                this.postUpdated.next({ posts: [...this.posts], postCount: transformedPostData.maxPosts })
            })
    }

    // subject for post change
    getPostUpdateListner() {
        return this.postUpdated.asObservable();
    }


    getPost(postId: string | null) {
        return this.http.get<
            {
                _id: string,
                title: string,
                content: string,
                imagePath: string,
                creator: string
            }>(BACKEND_URL + postId);
    }


    // adding posts
    addPost(title: string, content: string, image: File) {

        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title)


        this.http.post<{ message: string, post: PostModel }>(BACKEND_URL, postData)
            .subscribe(responseData => {
                this.route.navigate(['/']);
            })
    }


    // update post
    updatePost(postId: string | null, title: string, content: string, image: File | string) {

        let postData: PostModel | FormData;

        if (typeof (image) === 'object') {
            postData = new FormData();
            postData.append("id", postId as any);
            postData.append("title", title);
            postData.append("content", content);
            postData.append("image", image, title);
        } else {

            postData = {
                id: postId,
                title: title,
                content: content,
                imagePath: image,
                creator: ''
            }
        }

        this.http.put(BACKEND_URL + postId, postData).subscribe(response => {

            this.route.navigate(['/']);
        })

    }

    // deleting post
    deletePost(postId: string) {
        return this.http.delete(BACKEND_URL + postId);
    }
}