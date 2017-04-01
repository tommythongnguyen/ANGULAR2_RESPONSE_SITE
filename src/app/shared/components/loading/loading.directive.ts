import { Directive, ElementRef, Renderer2, OnInit, Output, OnDestroy, Input, OnChanges, SimpleChanges, EventEmitter} from '@angular/core';

@Directive({
    selector: '[loading]',
})
export class LoadingDirective implements OnDestroy, OnChanges{
    public loadingMask: HTMLDivElement;
    public spinnerIcon: HTMLSpanElement;
    private _maskClickListener: Function;
    constructor(private _renderer: Renderer2, private _elementRef: ElementRef) { }
    @Input() appendTo: string = "self"; //or body
    @Input() loading: boolean = false;
    @Input() spinner: string = "show";//hide will hide the spinner
    @Output() onBeforeClose: EventEmitter<any> = new EventEmitter<any>();
   
    ngOnChanges(changes: SimpleChanges) {
        if (changes['loading']) {
            if (changes['loading'].currentValue) {
                if (this.loadingMask) {
                    this.showLoadingMask();
                } else {
                    this.createLoadingMask();
                    if(this.spinner !=="hide" && !this.spinnerIcon){
                        this.createAndAppendSpinner();     
                    }
                }
            } else {
                this.hideLoadingMask();
            }
        }
    }
    createAndAppendSpinner(){
        //create spinning icon
        this.spinnerIcon = this._renderer.createElement('span');
        this._renderer.addClass(this.spinnerIcon, 'loading-icon');

        //add loadingSpan to loadingMask
        this._renderer.appendChild(this.loadingMask, this.spinnerIcon);       
    }
    createLoadingMask(){
        console.log('create loading mask');
        //create loadingMask
        this.loadingMask = this._renderer.createElement('div');
        this._renderer.addClass(this.loadingMask, 'loading-mask');
        if (this.appendTo === 'body'){
            this._renderer.setStyle(this.loadingMask,'position','fixed');
        }
       //show Loading Mask
        this.showLoadingMask(); 
        this.registerEventListeners(); 
    }

    showLoadingMask():void{
        if(this.appendTo ==='body'){
            this._renderer.appendChild(document.body, this.loadingMask);   
        }else{//default append to host element
            //add the relative position to host element
            this._renderer.addClass(this._elementRef.nativeElement, 'hostPosition');

            //append the loadingMask to it host element
            this._renderer.appendChild(this._elementRef.nativeElement, this.loadingMask);
        }    
        
    }

    hideLoadingMask():void{
        if(this.loadingMask){
            this._renderer.removeChild(this.loadingMask.parentNode, this.loadingMask); 
        } 
    }

    registerEventListeners(){
        this._maskClickListener = this._renderer.listen(this.loadingMask, "click", this.emitEvent.bind(this));
    }
    emitEvent($event:any){
        this.onBeforeClose.emit({});
    }
    ngOnDestroy(){
        this.hideLoadingMask();
        this.loadingMask = null;
    }


}