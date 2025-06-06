import { Component, OnInit } from '@angular/core';
import { PostModel } from './model/post.model';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
 
  constructor(private authService: AuthService) {}

ngOnInit(): void {
    this.authService.autoAuthUser();
}

}
