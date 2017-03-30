export enum Error_Enum{
    'MIS_MATCH',
    'UNREGISTERED'
};
export interface IError{
    type?:any,
    message?:string
};