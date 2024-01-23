import { FocusMonitor } from '@angular/cdk/a11y';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import {
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Optional,
  ViewEncapsulation,
} from '@angular/core';

import { _RadioBase } from '../radio.base';
import { _RadioGroupBase } from '../radio-group.base';
import { APP_RADIO_GROUP } from '../radio.token';
import { RadioGroupDirective } from '../radio-group.directive';

@Component({
  selector: 'app-radio',
  exportAs: 'appRadio',
  templateUrl: 'radio.component.html',
  styleUrls: ['./radio.component.scss'],
  host: {
    class: 'app-radio',
    '[attr.id]': 'id',
    '[attr.tabindex]': 'null',
    '(focus)': '_inputElement.nativeElement.focus()',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioComponent extends _RadioBase {
  constructor(
    @Optional() @Inject(APP_RADIO_GROUP) radioGroup: RadioGroupDirective,
    elementRef: ElementRef,
    focusMonitor: FocusMonitor,
    changeDetector: ChangeDetectorRef,
    radioDispatcher: UniqueSelectionDispatcher,
    @Attribute('tabindex') tabIndex?: string
  ) {
    super(
      radioGroup,
      elementRef,
      changeDetector,
      focusMonitor,
      radioDispatcher,
      tabIndex
    );
  }

  @HostBinding('class') get radioClasses() {
    return {
      'app-radio__checked': this.checked,
      'app-radio__disabled': this.disabled,
      'app-radio__label-before': this.labelPosition === 'before',
      [`app-radio__${this.color}`]: this.color,
    };
  }
}
