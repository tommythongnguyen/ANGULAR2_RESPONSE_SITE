import { Http, Response} from '@angular/http';
import { Injectable, Inject, InjectionToken } from '@angular/core';
import {Observable } from 'rxjs/Observable';

export const API_URL = new InjectionToken<string>('api_url');

@Injectable()
export class DashboardHttpService{
	
	constructor(@Inject(Http) private _http, @Inject(API_URL) private _api) { 
		console.log('any: ', this._api);
	}
	public getDashboardData(album:string):Observable<any[]>{
		return this._http.get(this._api + album + '.json')
			.map((res: Response) => res.json().response)
			.delay(1000)
			.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}
}