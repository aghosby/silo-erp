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

  public getPagedData$(
    endpoint: string,
    pageNo?: number,
    pageSize?: number,
    searchParam?: string,
    filters?: any
  ): Observable<any> {
    // Build query params
    const params: { [k: string]: any } = { page: pageNo ?? 1, limit: pageSize ?? 10 };
    if (searchParam) params['search'] = searchParam;
    Object.assign(params, filters || {});

    // Build full URL
    const url = buildUrlWithParams(`${endpoint}`, params);

    // Return Observable from HTTP GET
    return this.http.get<any>(url, this.requestOptions);
  }

  /*************** LEAD RELATED ACTIONS ***************/

  //Create a new lead
  public createLead(info: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createLead`, info, this.requestOptions);
  }

  //Get the list of all Leads
  public getLeads(pageNo?:number, pageSize?:number, searchParam?:string, filters?:any): Observable<any> {
    const url = `${this.baseUrl}/fetchLeads`;
    return this.getPagedData$(url, pageNo, pageSize, searchParam, filters);
  }

  //Update Lead
  public updateLead(payload: any, leadId: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updateLead/${leadId}`, payload, this.requestOptions);
  }

  //Delete lead
  public deleteLead(leadId: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteLead/${leadId}`, this.requestOptions);
  }

  /*************** AGENT RELATED ACTIONS ***************/

  //Create a new agent
  public createAgent(info: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/addEmployee`, info, this.requestOptions);
  }

  //Get the list of all Agents
  public getAgents(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/fetchAgents`, this.requestOptions);
  }

}
