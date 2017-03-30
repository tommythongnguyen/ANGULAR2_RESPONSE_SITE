import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx.js';

@Injectable()
export class LocalDatabaseService{
    public storeItem(name:string, value:any):Observable<any>{
        let observale= new Subject();
          setTimeout(()=>{
              //store value
              localStorage.setItem(name,JSON.stringify(value));
              observale.next(true);
              observale.complete();
          },1000);
          return  observale;
    }
    public getItemValue(name):Observable<any>{
         let observale= new Subject();
          setTimeout(()=>{
              //store value
              let value =JSON.parse(localStorage.getItem(name));
              console.log('value:',value);
              observale.next(value);
              observale.complete();
          },1000);
          return  observale;
    }
    public deleteItem(name):Observable<any>{
        let observale= new Subject();
        setTimeout(()=>{
              //store value
              localStorage.removeItem(name);
              observale.next(true);
              observale.complete();
          },1000);
          return  observale;
    }
    public clearAllItem():Observable<any>{
        let observale= new Subject();
        setTimeout(()=>{
              //store value
              localStorage.clear();
              observale.next(true);
              observale.complete();
          },1000);
          return  observale; 
    }

}
