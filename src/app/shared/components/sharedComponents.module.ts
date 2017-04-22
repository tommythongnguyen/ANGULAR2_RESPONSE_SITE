import {NgModule} from '@angular/core';
import{CommonModule} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DynamicCreationModule } from './dynamic-component-creation';

//import {AutoFocusDirective} from './autoFocus';
import {LoadingDirective} from './loading';
import{ModalHeaderComponent, ModalFooterComponent,ModalBodyComponent, ModalComponent} from'./modal';
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
import {YoutubePlayerComponent} from './youtube-player';
import { Ng2ComboboxComponent, ComboboxFooterComponent} from './combobox';
import { DropdownComponent } from './dropdown';
import { PanelComponent, PanelDemoComponent } from './panel';
import { AccordionComponent, AccordionTabComponent} from './accordion';
import { TooltipDirective} from './tooltip';
//------import directives-----------
import { TemplateFactoryDirective } from './template-factory';

//------import Pipes---------------
import { ItemFilterPipe } from './pipes';
const sharedDirective:any[]=[
    //AutoFocusDirective,
    LoadingDirective,

    ModalHeaderComponent,
    ModalFooterComponent,
    ModalComponent,
    ModalBodyComponent,

    PageTitleComponent,
    JumbotronComponent,
    
    CarouselComponent,

    ImageGalleryComponent,

    FlexImagesComponent,

    SlideShowComponent,

    TabsComponent, TabComponent,TabContentComponent,

    CardComponent,

    OverlayComponent, 

    AudioPlayerComponent,

    VideoPlaylerComponent,

    YoutubePlayerComponent,

    Ng2ComboboxComponent, ComboboxFooterComponent,

    DropdownComponent,

    PanelComponent, PanelDemoComponent,

    TemplateFactoryDirective,

    AccordionComponent, AccordionTabComponent,

    TooltipDirective,

    ItemFilterPipe
];
const importModules:any[]=[
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    DynamicCreationModule.forRoot()
];
@NgModule({
    declarations:sharedDirective,
    imports:importModules,
    exports:sharedDirective
})
export class SharedComponentModule{}