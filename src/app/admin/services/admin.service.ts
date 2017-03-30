import{Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';

import {LocalDatabaseService} from './localDatabase.service';
import {IError, Error_Enum} from './error.interface';

export interface ICredential{
    email:string;
    password:string;
    rememberMe?:boolean
}
@Injectable()
export class AdminService{
    private activeUser:ICredential;
    private _isLogined:boolean=false;
    constructor(private _localDatabase: LocalDatabaseService){}
    
    register(credential:ICredential):Observable<any>{
        if(!(credential.email && credential.password)) return;
        return Observable.forkJoin( this._localDatabase.storeItem('user',credential),
                                    this._localDatabase.storeItem('isRegistered',true),
                                    this._localDatabase.storeItem('isLogined',true)
                                  );
    }
    login(credential:ICredential):Observable<any>{
        let result = new Subject();
        let user =  this._localDatabase.getItemValue('user');
        return user.flatMap(registeredUser=>{
                if(registeredUser){
                    if(credential.email === registeredUser.email && credential.password === registeredUser.password){
                        this.activeUser = registeredUser;
                        return this._localDatabase.storeItem('isLogined',true);
                    }else{
                        setTimeout(()=>{
                            result.error({type:Error_Enum.MIS_MATCH, message:'username or password does not match'});
                        },0)
                    }
                }
                else{
                  setTimeout(()=>{
                    result.error({type:Error_Enum.UNREGISTERED, message:'Unregistered User'});
                  },0)
                }
                return result;
             });
    }
    logout():Observable<any>{
        return this._localDatabase.storeItem('isLogined',false);
    }
    isRegisteredUser():Observable<boolean>{
        return this._localDatabase.getItemValue('isRegistered');
    }
    isPreservedLogin():Observable<boolean>{
        return this._localDatabase.getItemValue('rememberMe');
    }
    isLogined():Observable<any>{
        return this._localDatabase.getItemValue('isLogined');
    }

    
}