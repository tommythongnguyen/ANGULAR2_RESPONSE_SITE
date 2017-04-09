import {Component, ElementRef, ViewChild, ContentChild, AfterViewInit, 
        AfterViewChecked,Input, Output, Renderer2, EventEmitter, ViewEncapsulation, 
        OnDestroy, OnChanges, SimpleChanges} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ElementCalculation } from '../../dom';

import { OverlayComponent } from '../overlay';
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
    styleUrls: [
        '../overlay/overlay.component.scss',
        './modal.component.scss'
    ],
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
                             [loading]="visible" appendTo="body" (onBeforeClose)="closeModal()">

            <div class="modal-container {{size}}" #overlay  [style.height.px]="height"  >
                <div class="modal-header-container">
                    <h4 class="modal-title">
                        <h5 *ngIf="!header">Modal title</h5>
                        <ng-content select="modal-header"></ng-content>    
                    </h4>
                    <button type="button" *ngIf="dismissable" class="close closeBtn" aria-label="Close" (click)="closeModal()">&times;</button>
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
export class ModalComponent extends OverlayComponent {
    @Output()onCloseModal: EventEmitter<any> = new EventEmitter<any>();

    @ContentChild(ModalHeaderComponent) header;
    @ContentChild(ModalFooterComponent)footer;

    @Input() dismissable: boolean = true;//default value
    @Input() footerAlign: FOOTER_POSITION = 'flex-start';

    constructor( public _renderer2: Renderer2, public _domCalculation: ElementCalculation) {
        super(_renderer2, _domCalculation);
    }
 
    closeModal(): any {
        this.onCloseModal.emit(false);
    }
}