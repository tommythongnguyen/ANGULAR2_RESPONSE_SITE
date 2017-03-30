import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, AfterContentInit, ContentChild} from '@angular/core';
import { LoadingDirective } from '../loading';
export interface IThumbnail{
	url: string;
	alt?: string;
}

export class ThumbnailGalleryHeaderComponent{}
@Component({
	selector: 'thumbs-gallery',
	styleUrls:['./gallery.component.scss'],
	template:`
		<section class="gallery-container" [loading]="showLoading" spinner="show">
			<section class="thumbs-gallery-header">{{header}}</section>
		
			<article class="gallery-images" class="row">
				<span *ngFor="let image of list" class="{{colums}}">
					<img  src="{{image.url}}" class="img-thumbnail rounded float-right img-fluid" alt="image.alt" (click)="selectThumbNail(image)">
				</span>
			</article>
		</section>
	`,
	changeDetection:ChangeDetectionStrategy.OnPush
})
export class ThumbnailGalleryComponent implements OnInit {
	@Input() showLoading: boolean = false;
	@Input() list: IThumbnail[] = [];
	@Input() colums: string;
	@Input() extClass: string;
	@Input() header: string = "Gallery";
	@Output() onSelect: EventEmitter<IThumbnail> = new EventEmitter<IThumbnail>();
	constructor() {}

	ngOnInit() {}
	selectThumbNail(image:IThumbnail):void{
		this.onSelect.emit(image);
	}
}