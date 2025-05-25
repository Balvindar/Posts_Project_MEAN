import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { PostModel } from "src/app/model/post.model";
import { PostService } from "src/app/posts.service";
import { mimeType } from "./mime-type.validator";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    standalone: false
})

export class PostCreateComponent implements OnInit, OnDestroy{

    enteredContent = ''
    enteredTitle = ''
    private mode = 'create';
    imagePreview: string = '';
    postForm!:FormGroup
    isLoading = false;
    private postId!: string | null;
     post!: PostModel
     pdfPanelOpen = false
     private authStatusSub!: Subscription;

    constructor(public postService: PostService, private route: ActivatedRoute,
         private authService: AuthService) { }


    ngOnInit(): void {

        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
            this.isLoading = false;
        })
        this.postForm = new FormGroup({
            title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
            content: new FormControl(null, {validators: [Validators.required]}),
            image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})

        })


        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('postId')) {
                this.isLoading = true
                this.mode = 'edit';
                this.postId = paramMap.get('postId');
                this.postService.getPost(this.postId).subscribe(postData => {
                    this.isLoading = false;
                    this.post = {
                        id: postData._id,
                         title: postData.title, 
                         content: postData.content,
                         imagePath: postData.imagePath,
                         creator: postData.creator
                        }
                        this.postForm.setValue({
                            title: this.post.title,
                            content: this.post.content,
                            image: this.post.imagePath
                        })  
                })
             
            } else  {
                this.mode = 'create';
                this.postId = null;
            }
        })
    }

    onSavePost() {
        this.isLoading = true
        if (this.mode === 'create') {
            this.postService.addPost(this.postForm.value.title, this.postForm.value.content, this.postForm.value.image);
        }
        else 
           this.postService.updatePost(this.postId, this.postForm.value.title, this.postForm.value.content, this.postForm.value.image)

        this.postForm.reset();
    }

    onImagePicked(event: Event) {
        const file = (event.target as any).files[0];
        this.postForm.patchValue({
            image: file
        })
        this.postForm.get('image')?.updateValueAndValidity()
        const reader = new FileReader();
        reader.onload = () => {
            console.log('base64', reader.result);
            this.imagePreview = reader.result as string
        }
        reader.readAsDataURL(file);
        
    }

    togglePdfPanel() {
        this.pdfPanelOpen = !this.pdfPanelOpen;
      }

      ngOnDestroy(): void {
          this.authStatusSub.unsubscribe()
      }

}