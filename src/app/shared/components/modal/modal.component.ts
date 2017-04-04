import {Component, ViewContainerRef, ElementRef, ViewChild, ContentChild, AfterViewInit, AfterViewChecked,Input, Output, Renderer2, EventEmitter, ViewEncapsulation, OnDestroy} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ElementCalculation } from '../../dom';


type MODAL_WIDTH = 'sm' | 'md' | 'lg';
type FOOTER_POSITION= 'flex-start' | 'center' | 'flex-end';
@Component({
    selector:'modal-header',
   template:`<ng-content></ng-content>`
})
export class ModalHeaderComponent{
    
}

@Component({
    selector:'modal-body',
    styles:[`
        :host{
            font-size: 18px;
            color: dimgrey;
            border:solid red 1px;
        }
    `],
    template:'<ng-content></ng-content>'
})
export class ModalBodyComponent{}

@Component({
    selector:'modal-footer',
    template:'<ng-content></ng-content>'
})
export class ModalFooterComponent{}

@Component({
    selector:'modal-cmp',
    exportAs:'modal',
    styleUrls: ['./modal.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
    animations: [
        trigger('modalState', [
            state('show', style({ opacity: 1 })),
            state('hide', style({ opacity: 0 })),
            transition('show <=> hide', animate('500ms ease-in-out')),
        ])
    ],
    template:`
         <div role="dialog" [style.display]="visible ? 'block' : 'none'"
            [@modalState]="visible? 'show':'hide'" [loading]="visible" appendTo="body" (onBeforeClose)="onClose()">
            <div class="modal-container" #modal  [style.height.px]="height" (mousedown)="startDrag($event)" (mouseup)="endDrag($event)" >
                <div class="modal-header-container">
                    <h4 class="modal-title">
                        <h5 *ngIf="!header">Modal title</h5>
                        <ng-content select="modal-header"></ng-content>    
                    </h4>
                    <button type="button" *ngIf="dismissable" class="close closeBtn" aria-label="Close" (click)="onClose()">&times;</button>
                </div>

                <div class="modal-body-container">
                    <ng-content select="modal-body"></ng-content>
                </div>
                <div class="modal-footer-container" [style.justifyContent]="footerAlign">
                    <button *ngIf="!footer" class="btn btn-info" (click)="onClose()">Close</button>
                    <ng-content select="modal-footer"></ng-content>
                </div> 
            </div>
        </div>
    `
})
export class ModalComponent implements AfterViewInit, AfterViewChecked, OnDestroy{
    private isFistTime: boolean = true;
    private _width = 'modal-md';
    private _visible:boolean =false;
    private _hostElement:HTMLElement;
    private _initialPosition:boolean =false;

    public shown:boolean=false;
    public modalMask: HTMLDivElement;
    private modalMaskClickListener: Function;
    private modalDragListener: Function;

    private _lastPageX: number;
    private _lastPageY: number;
    private _dragging: boolean = false;

    @Output()onBeforeShow:EventEmitter<any>= new EventEmitter<any>();
    @Output()onAfterShow:EventEmitter<any>= new EventEmitter<any>();
    @Output()onCloseModal: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('modal')modal: ElementRef;
    @ContentChild(ModalHeaderComponent) header;
    @ContentChild(ModalFooterComponent)footer;

    @Input() dismissable: boolean = true;//default value
    @Input() draggable: boolean = true;
    @Input() footerAlign: FOOTER_POSITION = 'flex-start';
    @Input() backdrop: boolean = true;
    @Input() height: number;//custom height
    @Input() set width(value: string) {
        if(value ==='lg'){
            this._width = "modal-lg";
        }else if(value ==='sm'){
            this._width = 'modal-sm';
        }else{
            this._width = 'modal-md';
        }
    }
    get width():string{
        return this._width;
    }

    @Input()get visible():boolean{
        return this._visible;
    }
    set visible(value:boolean){
        this._visible =value;
        if(value){
            //just sent value to show later in the afterViewChecked Lifecycle hook
            this.shown =value;
            this.onBeforeShow.emit({});
        }
    }
    constructor(
        public _viewContainRef:ViewContainerRef, 
        public _elementRef:ElementRef, 
        public _renderer: Renderer2,
        public _domCalculation: ElementCalculation) { }

    ngAfterViewInit(){ //this lifecycle hook only run at the time ; so it is good to create mask
        //add width to modal
        this._renderer.addClass(this.modal.nativeElement, this.width);

        this.onAfterShow.emit({});
        this.registerEvents();
    }
   
    //---this is phase when the view is already checked and all bindings has been resolved
    ngAfterViewChecked() {
        if (this.shown) {//since this cycle will be checked every single changeDectection, will only show if shown is true
           // this.showModalMask();
            this.onAfterShow.emit({});
            this.shown = false;

            if (this.isFistTime) {
                //adjust modal position
                this.centerPositionModal(this.modal.nativeElement);
                this.isFistTime = false;
            }
        }
    }

    ngOnDestroy() {
        if (this.modalDragListener){
            this.modalDragListener();
            this.modalDragListener = null;
        }
    }

    onClose():any{
        console.log('click');
        this.onCloseModal.emit(false);
    }
     
    registerEvents():void{
        this.modalDragListener = this._renderer.listen(this.modal.nativeElement,'mousemove',this.onDrag.bind(this))
    }
    startDrag($event:any):void{
        if(this.draggable && $event.buttons && $event.buttons ===1){//left button 
            this._dragging = true;
            this._lastPageX = $event.pageX;
            this._lastPageY = $event.pageY;
        }
    }

    onDrag($event):void{
        if(this._dragging){
            let diffX = $event.pageX - this._lastPageX;
            let diffY = $event.pageY - this._lastPageY;

            let leftPos = parseInt(this.modal.nativeElement.style.left) +diffX;
            let topPos = parseInt(this.modal.nativeElement.style.top) + diffY;

            this._renderer.setStyle(this.modal.nativeElement, 'left', leftPos+'px');
            this._renderer.setStyle(this.modal.nativeElement, 'top', topPos+'px');

            this._lastPageX = $event.pageX;
            this._lastPageY = $event.pageY;
        }
    }

    endDrag(){
        this._dragging = false;
        this.modalDragListener = null;
    }
   
    public centerPositionModal(element:HTMLElement){
        let width = this._domCalculation.getOuterWidth(element);
        let height = this._domCalculation.getOuterHeight(element);
        let viewport = this._domCalculation.getViewport();
        let left = (viewport.width - width)/2;
        let top =(viewport.height - height)/2; 
        this._renderer.setStyle(element,'left',left+'px');
        this._renderer.setStyle(element,'top',top +'px');
    }
}