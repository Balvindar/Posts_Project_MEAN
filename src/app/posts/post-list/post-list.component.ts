import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { PostModel } from "../../model/post.model";
import { PostService } from "../../posts.service";
import { PageEvent } from "@angular/material/paginator";
import { AuthService } from "../../auth/auth.service";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {

    posts: PostModel[] = []
    isLoading = false
    totalPosts = 0;
    postsPerPage = 1;
    currentPage = 1;
    pageSizeOptions = [1, 2, 5, 10]
    userId!: string | null;
    userIsAuthenticated = false;

    private postsSub!: Subscription;
    private authStatusSub!: Subscription;


    constructor(public postService: PostService, private authService: AuthService) { }

    ngOnInit() {
        this.isLoading = true
        this.postService.getPosts(this.postsPerPage, this.currentPage);
         this.userId = this.authService.getUserId();
        this.postsSub = this.postService.getPostUpdateListner().subscribe((postData: {posts: PostModel[], postCount: number}) => {
            this.isLoading = false
            this.totalPosts = postData.postCount;
            this.posts = postData.posts
        })
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
            this.userId = this.authService.getUserId();
        })
    }


    ngOnDestroy(): void {
        this.postsSub.unsubscribe();
        this.authStatusSub.unsubscribe();
    }

    onDelete(postId: any) {
        this.isLoading = true
        console.log('postid', postId)
        this.postService.deletePost(postId).subscribe(() => {
            this.postService.getPosts(this.postsPerPage, this.currentPage)
        }, error => {
            this.isLoading = false
        });
    }

    onChangedPage(pageData: PageEvent) {
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.postsPerPage = pageData.pageSize;
        this.postService.getPosts(this.postsPerPage,  this.currentPage);
    }

}