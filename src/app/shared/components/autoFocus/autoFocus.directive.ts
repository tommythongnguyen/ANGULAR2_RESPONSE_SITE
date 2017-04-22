import{
    Directive,
    ElementRef,
    OnInit,
	AfterViewChecked
} from '@angular/core';
@Directive({
    selector: `[autofocus]`
})
export class AutoFocusDirective implements AfterViewChecked {
	private _isFocus: boolean;
    constructor(private _elementRef:ElementRef){
        this._isFocus = false;  
    }
	ngAfterViewChecked() {
    	if(!this._isFocus){
            this._elementRef.nativeElement.focus();
			this._isFocus = true;
            console.log('what: ', this._elementRef.nativeElement);
    	}
    }
}
