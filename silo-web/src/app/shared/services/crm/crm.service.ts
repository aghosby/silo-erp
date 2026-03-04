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

  /*************** CONTACT RELATED ACTIONS ***************/

  //Create a new contact
  public createContact(info: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createContact`, info, this.requestOptions);
  }

  //Get the list of all Contacts
  public getContacts(pageNo?:number, pageSize?:number, searchParam?:string, filters?:any): Observable<any> {
    const url = `${this.baseUrl}/fetchContacts`;
    return this.getPagedData$(url, pageNo, pageSize, searchParam, filters);
  }

  //Update Contact
  public updateContact(payload: any, contactId: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updateContact/${contactId}`, payload, this.requestOptions);
  }

  //Delete Contact
  public deleteContact(contactId: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteContact/${contactId}`, this.requestOptions);
  }

  /*************** DEAL RELATED ACTIONS ***************/

  //Create a new deal
  public createDeal(info: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createDeal`, info, this.requestOptions);
  }

  //Get the list of all Deals
  public getDeals(pageNo?:number, pageSize?:number, searchParam?:string, filters?:any): Observable<any> {
    const url = `${this.baseUrl}/fetchDeals`;
    return this.getPagedData$(url, pageNo, pageSize, searchParam, filters);
  }

  //Update Deal
  public updateDeal(payload: any, dealId: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updateContact/${dealId}`, payload, this.requestOptions);
  }

  //Delete Deal
  public deleteDeal(dealId: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteContact/${dealId}`, this.requestOptions);
  }

  /*************** AGENT RELATED ACTIONS ***************/

  //Create a new agent
  public createAgent(info: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/addEmployee`, info, this.requestOptions);
  }

  //Get the list of all Agents
  public getAgents(pageNo?:number, pageSize?:number, searchParam?:string, filters?:any): Observable<any> {
    const url = `${this.baseUrl}/fetchAgents`;
    return this.getPagedData$(url, pageNo, pageSize, searchParam, filters);
  }

  /*************** TICKET RELATED ACTIONS ***************/

  //Create a new ticket
  public createTicket(info: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createTicket`, info, this.requestOptions);
  }

  //Get the list of all tickets
  public getTickets(pageNo?:number, pageSize?:number, searchParam?:string, filters?:any): Observable<any> {
    const url = `${this.baseUrl}/fetchTickets`;
    return this.getPagedData$(url, pageNo, pageSize, searchParam, filters);
  }

  //Update Ticket
  public updateTicket(payload: any, dealId: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updateTicket/${dealId}`, payload, this.requestOptions);
  }

  //Delete Deal
  public deleteTicket(dealId: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteTicket/${dealId}`, this.requestOptions);
  }

}
