import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { BehaviorSubject, forkJoin, Observable, tap } from 'rxjs';
import { AuthService } from '../utils/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private baseUrl = `${environment.apiBaseUrl}`;
  public readonly TOKEN_NAME = 'userToken';

  headerParams:any = {
    'Authorization': `Bearer ${this.authService.token}`
  }
  requestOptions = {                                                                                                                                                                                 
    headers: new HttpHeaders(this.headerParams)
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}


  //Get subscription plans
  public getSubscriptionPlans(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/subscription/plans`, this.requestOptions);
  }

  //Initiate Subscription
  public initSubscription(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/subscription/initiate`, payload, this.requestOptions);
  }
}
