import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { inject, Injectable } from "@angular/core";


// old way to use canActivate
// @Injectable()
// export class AuthGuard implements CanActivate {
//     constructor(private authService: AuthService, private router: Router) {}
//     canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
//         const isAuth = this.authService.getIsAuth();
//         if (!isAuth) {
//             this.router.navigate(['/login']);
//         }
//         return isAuth;
//     }
    
// }

// new way to use canActivate
export const AuthGuard: CanActivateFn = ( route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
  Observable<boolean | UrlTree> 
  | Promise<boolean | UrlTree> 
  | boolean 
  | UrlTree => {

    const isAuth = inject(AuthService).getIsAuth();
    if (!isAuth) {
        inject(Router).navigate(['/auth/login']);
    }
    return isAuth;

};