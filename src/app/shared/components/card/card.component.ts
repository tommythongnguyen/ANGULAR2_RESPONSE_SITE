import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
export interface ICard{
	img: string;
	text?: string;
	title?: string;
	alt?: string;
}
@Component({
	selector: 'card',
	styleUrls:['./card.component.scss'],
	template: `
		<div class="card">
			<div class="inner-card">
			  <img class="card-img-top" src="{{card.img}}" alt="card.alt" (click)="selectCard()">
			  <div class="card-block">
			    <p class="card-title">{{card.title}}</p>
			    <p class="card-text">{{card.text}}</p>
			  </div>
			</div>
		</div>
	`
})
export class CardComponent implements OnInit {
	@Input() card: ICard;
	@Input('classes') extraClasses: string;
	@Output() onSelectCard: EventEmitter<ICard> = new EventEmitter<ICard>();
	constructor() {}

	ngOnInit() {}
	selectCard(){
		this.onSelectCard.emit(this.card);
	}
}