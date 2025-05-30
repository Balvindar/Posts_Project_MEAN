import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AngularMaterialModule } from "../angular-material.module";
import { LoginComponent } from "./login/login/login.component";
import { SignupComponent } from "./signup/signup/signup.component";
import { AuthRoutingModule } from "./auth-routing.module";


@NgModule({

    declarations: [
        LoginComponent,
        SignupComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        AngularMaterialModule,
        AuthRoutingModule
    ]

})

export class AuthModule { }