import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {registrationConfig} from '../../registration/app-registration.config';
import {AuthDataRequest} from '../authDataRequest';
import {JwtAuthData} from '../jwt-auth-data';
import {AlertService} from '../../alert/alert.service';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Router} from '@angular/router';
import {AuthConstants} from '../auth-constants';
import {SecureStorageService} from './secure-storage.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService{

  private accessToke: string;
  private authStatusListener = new Subject<boolean>();
  private adminListener = new Subject<boolean>();
  private isAuthenticated = false;
  private userId: number;
  private isAdmin = false;
  // @ts-ignore
  private tokenTimer: NodeJS.Timer;

  constructor(private httpClient: HttpClient,
              private alert: AlertService,
              private router: Router,
              private secureStorage: SecureStorageService) { }

  IsAdmin(): boolean {
    if (this.secureStorage.getItem(AuthConstants.IS_ADMIN_KEY)){
      return true;
    }
    return false;
  }
  IsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  getUserId(): number {
    return this.userId;
  }

  getAdminListener(): Observable<boolean> {
    return this.adminListener;
  }
  getAuthStatus(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  getAccessToke(): string{
    return this.accessToke;
  }

  createUser(authData: AuthDataRequest): void {
    // tslint:disable-next-line:max-line-length
    const signupEndpoint = registrationConfig.APP_ENDPOINT + registrationConfig.registration.API.VERSION + registrationConfig.registration.API.SIGN_UP;
    this.httpClient.post(signupEndpoint, authData)
      .subscribe(responseData => {
        console.log(responseData);
      }, error => {
        if (error.status === 409){
          console.log(error);
          this.alert.errorNotification('E-mail address is reserved  please try another email');
        }
      });
  }

  login(authData: AuthDataRequest): void {
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
    this.router.navigate(['/']);
  }

  private doInternalLogin(responseData: JwtAuthData): void {

    this.storeResponse(responseData);

    const adminRole = responseData.roles.find( value => value === 'admin');
    this.registerExpirationLogin(responseData.expiresIn);

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
    this.alert.successNotification('Logged In Successfully');
    this.isAuthenticated = true;
    this.authStatusListener.next(true);
  }

  private storeToLocalStorage(responseData: JwtAuthData): void{
    const now = new Date();
    const expirationDate = new Date(now.getTime() + responseData.expiresIn);
    this.secureStorage.setItem(AuthConstants.TOKEN_KEY, responseData.accessToken);
    this.secureStorage.setItem(AuthConstants.TOKEN_EXPIRATION_KEY, expirationDate.toISOString());
    this.secureStorage.setItem(AuthConstants.USER_ID, responseData.user.id);
    this.secureStorage.setItem(AuthConstants.IS_ADMIN_KEY, String(this.isAdmin));
  }

  private cleanLocalStorage(): void {
    this.secureStorage.clear();
  }

  private tokensCleanup(): void {
    this.cleanLocalStorage();
    this.alert.successNotification('Logout Successfully');
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
  }

  private registerExpirationLogin(expiresIn: number): void {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expiresIn);
  }

  getAuthData(): {accessToken, expiresIn: Date, isAdmin, userId}{
    const accessToken = this.secureStorage.getItem(AuthConstants.TOKEN_KEY);
    const expirationDate = this.secureStorage.getItem(AuthConstants.TOKEN_EXPIRATION_KEY);
    const isAdmin = this.secureStorage.getItem(AuthConstants.IS_ADMIN_KEY);
    const userId = this.secureStorage.getItem(AuthConstants.USER_ID);

    if (!accessToken && expirationDate) {
      return ;
    }
    return {accessToken, expiresIn: new Date(expirationDate), isAdmin, userId
    };
  }

  doAutoLogin(): void {
    const authInformation = this.getAuthData();
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
