import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {registrationConfig} from '../../registration/app-registration.config';
import {UserDataRequest} from '../userDataRequest';
import {JwtAuthData} from '../jwt-auth-data';
import {AlertService} from '../../alert/alert.service';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Router} from '@angular/router';
import {SecureStorageService} from './secure-storage.service';
import {User} from '../../page/model/user';
const TOKEN_KEY = 'accessToke';
const TOKEN_EXPIRATION_KEY = 'accessTokeExpiresIn';
const USER_ID = 'userId';
const IS_ADMIN_KEY = 'isAdmin';
const USER = 'user';

@Injectable({
  providedIn: 'root'
})
export class AuthService{

  private accessToke: string;
  private authStatusListener = new Subject<boolean>();
  private adminListener = new Subject<boolean>();
  private userCreationListener = new Subject<boolean>();
  private userLoggedInListener = new Subject<User>();
  private isAuthenticated = false;
  private userId: number;
  private user: User;
  private isAdmin = false;
  // @ts-ignore
  private tokenTimer: NodeJS.Timer;

  constructor(private httpClient: HttpClient,
              private alert: AlertService,
              private router: Router,
              private secureStorage: SecureStorageService) { }

  IsAdmin(): boolean {
    if (this.secureStorage.getItem(IS_ADMIN_KEY) === true){
      return true;
    }
    return false;
  }

  getUser(): User {
    if(this.user)
      return this.user;
    return this.secureStorage.getItem(USER);
}
  getUserLoggedInListener(): Observable<User> {
    return this.userLoggedInListener;
  }
  getUserCreationListener(): Observable<boolean> {
    return this.userCreationListener.asObservable();
  }
  IsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  getUserId(): number {
    return this.userId;
  }

  getAdminListener(): Observable<boolean> {
    return this.adminListener.asObservable();
  }
  getAuthStatus(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  getAccessToke(): string{
    return this.accessToke;
  }

  createUser(authData: UserDataRequest, doLoginAfter: boolean): void {
    // tslint:disable-next-line:max-line-length
    const signupEndpoint = registrationConfig.APP_ENDPOINT + registrationConfig.registration.API.VERSION + registrationConfig.registration.API.SIGN_UP;
    this.httpClient.post(signupEndpoint, authData)
      .subscribe((responseData: JwtAuthData)  => {
        this.userCreationListener.next(true);
        if (doLoginAfter){
          this.doInternalLogin(responseData);
        }
      }, error => {
        if (error.status === 409){
          this.userCreationListener.next(false);
          this.alert.errorNotification('E-mail address is reserved  please try another email');
        }
        this.userCreationListener.next(false);
      });
  }

 /* private navigate(jwtAuthData: JwtAuthData): void{
    const adminRole = jwtAuthData.roles.find( value => value === 'admin');
    if(adminRole){
      this.router.navigate(['/admin']);
    }else{
      this.router.navigate(['/user']);
    }
  }*/

  login(authData: UserDataRequest): void {
    // tslint:disable-next-line:max-line-length
    const loginEndPoint = registrationConfig.APP_ENDPOINT + registrationConfig.registration.API.VERSION + registrationConfig.registration.API.LOGIN;
    this.httpClient.post<JwtAuthData>(loginEndPoint, authData)
      .subscribe(responseData  => {
        if (responseData.accessToken){
            this.doInternalLogin(responseData);
        }
      }, error => {
        console.log(error);
        this.alert.errorNotification('Invalid Email or Password');
      });
  }

  logout(): void{
    this.tokensCleanup();
    this.router.navigate(['/registration/login']);
  }

  private doInternalLogin(responseData: JwtAuthData): void {

    this.storeResponse(responseData);

    const adminRole = responseData.roles.find( value => value === 'admin');
    // this.registerExpirationLogin( responseData.expiresIn);

    if (adminRole){
      this.isAdmin = true;
      this.adminListener.next(this.isAdmin);
      this.router.navigate(['/admin']);
    }else{
      this.router.navigate(['user']);
    }
  }

  private storeResponse(responseData: JwtAuthData): void {
    this.storeToLocalStorage(responseData);
    this.userId = responseData.user.id;
    this.user = responseData.user;
    this.accessToke = responseData.accessToken;

    this.isAuthenticated = true;
    this.authStatusListener.next(true);
  }

  private storeToLocalStorage(responseData: JwtAuthData): void{
    const now = new Date();
    const expirationDate = new Date(now.getTime() + responseData.expiresIn);
    const adminRole = responseData.roles.find( value => value === 'admin');

    this.secureStorage.setItem(TOKEN_KEY, responseData.accessToken);
    this.secureStorage.setItem(TOKEN_EXPIRATION_KEY, expirationDate.toISOString());
    this.secureStorage.setItem(USER_ID, responseData.user.id);
    this.secureStorage.setItem(USER, responseData.user);

    if (adminRole){
      this.secureStorage.setItem(IS_ADMIN_KEY, true);
    }else{
      this.secureStorage.setItem(IS_ADMIN_KEY, false);
    }
  }

  private cleanLocalStorage(): void {
    this.secureStorage.clear();
  }

  private tokensCleanup(): void {
    this.cleanLocalStorage();
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
  }

  private registerExpirationLogin(expiresIn: number): void {
    const expirationDate = new Date(new Date().getTime() + expiresIn);
    const expiresAfter = new Date();
    const diffTime = Math.abs(expiresAfter.getTime() - expirationDate.getTime());

    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, diffTime);
  }

  getAuthData(): {accessToken, expiresIn: Date, isAdmin, userId, user}{
    const accessToken = this.secureStorage.getItem(TOKEN_KEY);
    const expirationDate = this.secureStorage.getItem(TOKEN_EXPIRATION_KEY);
    const isAdmin = this.secureStorage.getItem(IS_ADMIN_KEY);
    const userId = this.secureStorage.getItem(USER_ID);
    const user = this.secureStorage.getItem(USER);
    if (!accessToken || !expirationDate) {
      return;
    }
    return {accessToken, expiresIn: new Date(expirationDate), isAdmin, userId, user
    };
  }

  doAutoLogin(): void {
    const authInformation = this.getAuthData();
    if (!authInformation){
      return;
    }
    const nowDate = new Date();
    const isTokenInFuture = authInformation.expiresIn > nowDate;
    if (isTokenInFuture){
      this.accessToke = authInformation.accessToken;
      this.isAuthenticated = true;
      this.isAdmin = authInformation.isAdmin;
      this.userId = authInformation.userId;
    }
  }

}
