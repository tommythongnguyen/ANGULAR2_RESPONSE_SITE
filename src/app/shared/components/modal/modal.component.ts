import {Component, ElementRef, ViewChild, ContentChild, AfterViewInit, 
        AfterViewChecked,Input, Output, Renderer2, EventEmitter, ViewEncapsulation, 
        OnDestroy, OnChanges, SimpleChanges} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ElementCalculation } from '../../dom';

type FOOTER_POSITION= 'flex-start' | 'center' | 'flex-end';
@Component({
    selector:'modal-header',
    styles:[`
        section.header{
            font-size: 18px;
            color: dimgrey;
            margin-top:5px;
            padding-left:10px;
            border-bottom: solid lightgray 2px;
        }
    `],
   template:`
    <section class="header">
       <ng-content></ng-content>
    </section>`

})
export class ModalHeaderComponent{
    
}

@Component({
    selector:'modal-body', 
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
         <div role="dialog" [style.display]="visible ? 'block' : 'none'" [@modalState]="visible? 'show':'hide'" 
                             [loading]="visible" appendTo="body" (onBeforeClose)="onClose()">

            <div class="modal-container {{_size}}" #modal  [style.height.px]="height"  >
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
                    <button *ngIf="!footer" class="btn btn-info closeBtn" (click)="onClose()">Close</button>
                    <ng-content select="modal-footer"></ng-content>
                </div> 
            </div>
        </div>
    `
})
export class ModalComponent implements AfterViewChecked, OnDestroy, OnChanges{
    private _isFistTime: boolean = true;
    private _needCentering: boolean = false;
    private _size = 'modal-md';
    private _initialPosition:boolean =false;

    public shown:boolean=false;
   
    private startDragListener: Function;
    private onDragListener: Function;
    private endDragListener: Function;

    private _lastPageX: number;
    private _lastPageY: number;
    private _dragging: boolean = false;

    @Output()onCloseModal: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('modal')modal: ElementRef;
    @ContentChild(ModalHeaderComponent) header;
    @ContentChild(ModalFooterComponent)footer;

    @Input() dismissable: boolean = true;//default value
    @Input() draggable: boolean = true;
    @Input() footerAlign: FOOTER_POSITION = 'flex-start';
    @Input() visible: boolean = false;
    @Input() height: number;//custom height
    @Input() set size(value: string) {
        if(value ==='lg'){
            this._size = "modal-lg";
        }else if(value ==='sm'){
            this._size = 'modal-sm';
        }
    }
    get size():string{
        return this._size;
    }

    constructor( public _renderer2: Renderer2, public _domCalculation: ElementCalculation) { }

    ngOnChanges(changes:SimpleChanges){
        if (changes['visible'] && changes['visible'].currentValue && this._isFistTime){
            this._isFistTime = false;
            this._needCentering = true;
        }
    }
   
    //---this is phase when the view is already checked and all bindings has been resolved
    ngAfterViewChecked() {
        if (this._needCentering) {
            this.centerModal(this.modal.nativeElement);
            this.registerEvents();
            this._needCentering = false;
        }
    }
    onClose():any{
        this.onCloseModal.emit(false);
    }
     
    registerEvents():void{
        this.startDragListener = this._renderer2.listen(this.modal.nativeElement, 'mousedown', this.startDrag.bind(this));
        this.onDragListener    = this._renderer2.listen(this.modal.nativeElement, 'mousemove', this.onDrag.bind(this));
        this.endDragListener   = this._renderer2.listen(this.modal.nativeElement, 'mouseup', this.endDrag.bind(this));
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

            this._renderer2.setStyle(this.modal.nativeElement, 'left', leftPos+'px');
            this._renderer2.setStyle(this.modal.nativeElement, 'top', topPos+'px');

            this._lastPageX = $event.pageX;
            this._lastPageY = $event.pageY;
        }
    }

    endDrag(){
        this._dragging = false;
        this.onDragListener();
    }
   
    public centerModal(element: HTMLElement) {
        let width = this._domCalculation.getOuterWidth(element);
        let height = this._domCalculation.getOuterHeight(element);
        let viewport = this._domCalculation.getViewport();
        let left = (viewport.width - width)/2;
        let top =(viewport.height - height)/2; 
        this._renderer2.setStyle(element,'left',left+'px');
        this._renderer2.setStyle(element,'top',top +'px');
    }

    destroyEventListener(listenerFn: Function) {
        if (listenerFn) {
            listenerFn();
        }
    }

    ngOnDestroy() {
        this.destroyEventListener(this.startDragListener);
        this.destroyEventListener(this.onDragListener);
        this.destroyEventListener(this.endDragListener);
    }
}