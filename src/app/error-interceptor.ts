import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { catchError, throwError } from "rxjs";
import { ErrorComponent } from "./error/error.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private matDialog: MatDialog) {}
    intercept(req: HttpRequest<any>, next: HttpHandler) {

        return next.handle(req).pipe(catchError((error: HttpErrorResponse) => {
            console.log(error);
            let errorMessage = 'An unknown error accured!';
            if (error.error) {
                errorMessage = error.error.message;
            } 
            this.matDialog.open(ErrorComponent, {
                data: {
                    message: errorMessage
                }
            });
            return throwError(error);
        }));
    }
    
}