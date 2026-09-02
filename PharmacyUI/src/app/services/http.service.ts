import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  get<T>(endpoint: string, params?: HttpParams): Observable<T>;
  get<T>(baseUrl: string, path: string, params?: HttpParams): Observable<T>;
  get<T>(endpointOrBaseUrl: string, pathOrParams?: string | HttpParams, params?: HttpParams): Observable<T> {
    const isBaseUrlCall = typeof pathOrParams === 'string';
    const url = isBaseUrlCall
      ? this.buildUrl(endpointOrBaseUrl, pathOrParams)
      : this.buildUrl(this.apiUrl, endpointOrBaseUrl);
    const requestParams = isBaseUrlCall ? params : pathOrParams;

    return this.http.get<T>(url, { params: requestParams });
  }

  post<T>(endpoint: string, body: unknown): Observable<T>;
  post<T>(baseUrl: string, path: string, body: unknown): Observable<T>;
  post<T>(endpointOrBaseUrl: string, pathOrBody: string | unknown, body?: unknown): Observable<T> {
    const isBaseUrlCall = typeof body !== 'undefined';
    const url = isBaseUrlCall
      ? this.buildUrl(endpointOrBaseUrl, pathOrBody as string)
      : this.buildUrl(this.apiUrl, endpointOrBaseUrl);
    const requestBody = isBaseUrlCall ? body : pathOrBody;

    return this.http.post<T>(url, requestBody);
  }

  put<T>(endpoint: string, body: unknown): Observable<T>;
  put<T>(baseUrl: string, path: string, body: unknown): Observable<T>;
  put<T>(endpointOrBaseUrl: string, pathOrBody: string | unknown, body?: unknown): Observable<T> {
    const isBaseUrlCall = typeof body !== 'undefined';
    const url = isBaseUrlCall
      ? this.buildUrl(endpointOrBaseUrl, pathOrBody as string)
      : this.buildUrl(this.apiUrl, endpointOrBaseUrl);
    const requestBody = isBaseUrlCall ? body : pathOrBody;

    return this.http.put<T>(url, requestBody);
  }

  delete<T>(endpoint: string): Observable<T>;
  delete<T>(baseUrl: string, path: string): Observable<T>;
  delete<T>(endpointOrBaseUrl: string, path?: string): Observable<T> {
    const url = path
      ? this.buildUrl(endpointOrBaseUrl, path)
      : this.buildUrl(this.apiUrl, endpointOrBaseUrl);

    return this.http.delete<T>(url);
  }

  private buildUrl(baseUrl: string, path: string): string {
    return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  }
}
