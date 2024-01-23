import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { IconComponent } from './icon/icon.component';
import { RadioGroupDirective } from './app-radio/radio-group.directive';
import { RadioComponent } from './app-radio/radio/radio.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    IconComponent,
    RadioGroupDirective,
    RadioComponent,
  ],
  imports: [BrowserModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
