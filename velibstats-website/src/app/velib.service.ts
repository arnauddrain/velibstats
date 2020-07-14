import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class VelibService {
  static url = 'https://mr9bhbf75b.execute-api.us-east-1.amazonaws.com/dev/velibstats';

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse): Observable<any> {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }

  retrieveData(username: string, password: string): Observable<any> {
    return this.http.post(VelibService.url, {
      username, password
    }).pipe(
      catchError(this.handleError)
    );
  }
}
