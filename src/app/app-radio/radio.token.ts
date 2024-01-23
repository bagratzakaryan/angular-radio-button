import { InjectionToken } from '@angular/core';

import { _RadioGroupBase } from './radio-group.base';
import { _RadioBase } from './radio.base';

export const APP_RADIO_GROUP = new InjectionToken<_RadioGroupBase<_RadioBase>>(
  'RadioGroup'
);
