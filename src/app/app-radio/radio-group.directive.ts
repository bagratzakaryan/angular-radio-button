import {
  ContentChildren,
  Directive,
  forwardRef,
  QueryList,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { _RadioGroupBase } from './radio-group.base';
import { _RadioBase } from './radio.base';
import { APP_RADIO_GROUP } from './radio.token';
import { RadioComponent } from './radio/radio.component';

@Directive({
  selector: 'app-radio-group',
  exportAs: 'appRadioGroup',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupDirective),
      multi: true,
    },
    { provide: APP_RADIO_GROUP, useExisting: RadioGroupDirective },
  ],
  host: {
    role: 'radiogroup',
    class: 'app-radio-group',
  },
})
export class RadioGroupDirective extends _RadioGroupBase<RadioComponent> {
  @ContentChildren(forwardRef(() => RadioComponent), { descendants: true })
  _radios!: QueryList<RadioComponent>;
}
