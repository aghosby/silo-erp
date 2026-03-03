import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { BehaviorSubject, forkJoin, Observable, tap } from 'rxjs';
import { AuthService } from '../utils/auth.service';
import { buildUrlWithParams } from '@helpers/query-params.helper';

@Injectable({
  providedIn: 'root'
})
export class CrmService {

  private baseUrl = `${environment.apiBaseUrl}`;
  public readonly TOKEN_NAME = 'userToken';

  headerParams:any = {
    'Authorization': this.authService.token
  }
  requestOptions = {                                                                                                                                                                                 
    headers: new HttpHeaders(this.headerParams)
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}
