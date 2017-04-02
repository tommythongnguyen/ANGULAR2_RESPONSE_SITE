import {NgModule} from '@angular/core';
import{CommonModule} from '@angular/common';
//import {AutoFocusDirective} from './autoFocus';
import {LoadingDirective} from './loading';
import{TnHeaderComponent, TnFooterComponent,TnModalComponent, TnBodyComponent} from'./modal';
import { PageTitleComponent, JumbotronComponent } from './jumbotron';
import { CarouselComponent } from './carousel';
import { ImageGalleryComponent} from './imageGallery';
import { FlexImagesComponent } from './flexImages';
import { SlideShowComponent } from './slideShow';
import { TabsComponent, TabComponent, TabContentComponent } from './tabs';
import { CardComponent } from './card';
import { OverlayComponent } from './overlay';
import { AudioPlayerComponent } from './audio-player';
import { VideoPlaylerComponent } from './video-player';
const sharedDirective:any[]=[
    //AutoFocusDirective,
    LoadingDirective,

    TnHeaderComponent,
    TnFooterComponent,
    TnModalComponent,
    TnBodyComponent,

    PageTitleComponent,
    JumbotronComponent,
    
    CarouselComponent,

    ImageGalleryComponent,

    FlexImagesComponent,

    SlideShowComponent,

    TabsComponent,
    TabComponent,
    TabContentComponent,

    CardComponent,

    OverlayComponent, 

    AudioPlayerComponent,

    VideoPlaylerComponent
];
const importModules:any[]=[
    CommonModule
];
@NgModule({
    declarations:sharedDirective,
    imports:importModules,
    exports:sharedDirective
})
export class SharedComponentModule{}