// import{
//     Directive,
//     ElementRef,
//     OnInit,
//     AfterContentChecked
// } from '@angular/core';
// @Directive({
//     selector: `[autofocus]`
// })
// export class AutoFocusDirective implements AfterContentChecked {
// 	private _isFocus: boolean;
//     constructor(private _elementRef:ElementRef){
//         this._isFocus = false;  
//     }
//     ngAfterContentChecked() {
//     	if(!this._isFocus){
//             this._elementRef.nativeElement.focus();
// 			this._isFocus = true;
//             console.log('what: ', this._elementRef.nativeElement);
//     	}
//     }
// }
