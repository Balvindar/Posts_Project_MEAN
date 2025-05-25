import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { apiUrl } from "src/environment/environment";


const BACKEND_URL = apiUrl + '/users/'

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    token!: string
    private isAuthenticated = false;
    private userId!: string | null;
    private authStatusListener = new Subject<boolean>();
    tokenTimer: any;
    constructor(private http: HttpClient, private router: Router) { }

    createUser(email: string, password: string) {
        const authData: AuthData = {
            email: email,
            password: password
        }
        this.http.post(BACKEND_URL + 'signup', authData)
            .subscribe((response) => {
               this.router.navigate(['/auth/login']);
            }, error => {
                this.authStatusListener.next(false);
            })
    }

    login(email: string, password: string) {
        const authData: AuthData = {
            email: email,
            password: password
        }
        this.http.post<{ token: string, expiresIn: number, userId: string }>(BACKEND_URL + 'login', authData)
            .subscribe((response) => {
                const token = response.token;
                this.token = token;
                if (token) {
                    const expireInDuration = response.expiresIn;
                    this.setAuthTimer(expireInDuration);
                    this.isAuthenticated = true;
                    this.userId = response.userId;
                    this.authStatusListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expireInDuration * 1000);
                    this.saveAuthData(token, expirationDate, this.userId);
                    this.router.navigate(['/']);
                }

            }, error => {
                this.authStatusListener.next(false);
            })
    }

    logOut() {
        this.token = '';
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.userId = '';
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);

    }

    getToken() {
        return this.token;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    getUserId() {
        return this.userId;
    }


    autoAuthUser() {
        const authInformation = this.getAuthData();
        if (!authInformation)
            return;
        const now = new Date();
        const expiresIn = authInformation?.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0) {
            this.token = authInformation?.token;
            this.isAuthenticated = true;
            this.userId = authInformation?.userId;
            this.setAuthTimer(expiresIn / 1000); //converting milliseconds to seconds
            this.authStatusListener.next(true);
        }
    }
    private saveAuthData(token: string, expirationDate: Date, userId: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration')
        localStorage.removeItem('userId');
    }

    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');

        if (!token || !expirationDate)
            return;

        return {
            token: token,
            expirationDate: new Date(expirationDate),
            userId: userId
        }
    }

    private setAuthTimer(duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logOut();
        }, duration * 1000)
    }
}