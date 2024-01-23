import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  coerceBooleanProperty,
  coerceNumberProperty,
} from '@angular/cdk/coercion';

import { RadioChange } from './radio.change';
import { _RadioGroupBase } from './radio-group.base';
import { RadioColor, UNIQE_ID_STORE } from './radio.config';

abstract class RadioBase {
  abstract disabled: boolean;
  constructor(public _elementRef: ElementRef) {}
}

@Directive()
export abstract class _RadioBase
  extends RadioBase
  implements OnInit, AfterViewInit, OnDestroy
{
  private _uniqueId: string = `app-radio-${++UNIQE_ID_STORE.nextUniqueId}`;

  @Input() id: string = this._uniqueId;
  @Input() name!: string;
  @Input() label?: string;
  @Input() infoTooltip?: string;

  @Input()
  get checked(): boolean {
    return this._checked;
  }
  set checked(value: boolean) {
    const newCheckedState = coerceBooleanProperty(value);
    if (this._checked !== newCheckedState) {
      this._checked = newCheckedState;
      if (
        newCheckedState &&
        this.radioGroup &&
        this.radioGroup.value !== this.value
      ) {
        this.radioGroup.selected = this;
      } else if (
        !newCheckedState &&
        this.radioGroup &&
        this.radioGroup.value === this.value
      ) {
        this.radioGroup.selected = null;
      }

      if (newCheckedState) {
        this._radioDispatcher.notify(this.inputId, this.name);
      }
      this._changeDetector.markForCheck();
    }
  }

  @Input()
  get value(): any {
    return this._value;
  }
  set value(value: any) {
    if (this._value !== value) {
      this._value = value;
      if (this.radioGroup !== null) {
        if (!this.checked) {
          this.checked = this.radioGroup.value === value;
        }
        if (this.checked) {
          this.radioGroup.selected = this;
        }
      }
    }
  }

  @Input()
  get labelPosition(): 'before' | 'after' {
    return (
      this._labelPosition ||
      (this.radioGroup && this.radioGroup.labelPosition) ||
      'after'
    );
  }
  set labelPosition(value) {
    this._labelPosition = value;
  }
  private _labelPosition!: 'before' | 'after';

  @Input()
  get disabled(): boolean {
    return (
      this._disabled || (this.radioGroup !== null && this.radioGroup.disabled)
    );
  }
  set disabled(value: boolean) {
    this._setDisabled(coerceBooleanProperty(value));
  }

  @Input()
  get required(): boolean {
    return this._required || (this.radioGroup && this.radioGroup.required);
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
  }

  /** The color of this radio button. Default value is "primary" */
  @Input()
  get color(): RadioColor {
    return (
      this._color || (this.radioGroup && this.radioGroup.color) || 'primary'
    );
  }
  set color(newValue: RadioColor) {
    this._color = newValue;
  }
  private _color!: RadioColor;

  @Output() readonly change: EventEmitter<RadioChange> =
    new EventEmitter<RadioChange>();

  radioGroup: _RadioGroupBase<_RadioBase>;

  get inputId(): string {
    return `${this.id || this._uniqueId}-input`;
  }

  private defaultTabIndex: number = 0;
  private _tabIndex: number = this.defaultTabIndex;

  get tabIndex(): number {
    return this.disabled ? -1 : this._tabIndex;
  }
  set tabIndex(value: number) {
    this._tabIndex =
      value != null ? coerceNumberProperty(value) : this.defaultTabIndex;
  }

  private _checked: boolean = false;
  private _disabled!: boolean;
  private _required!: boolean;
  private _value: any = null;

  private _removeUniqueSelectionListener: () => void = () => {};

  @ViewChild('input') _inputElement!: ElementRef<HTMLInputElement>;

  constructor(
    radioGroup: _RadioGroupBase<_RadioBase>,
    elementRef: ElementRef,
    protected _changeDetector: ChangeDetectorRef,
    private _focusMonitor: FocusMonitor,
    private _radioDispatcher: UniqueSelectionDispatcher,
    tabIndex?: string
  ) {
    super(elementRef);
    this.radioGroup = radioGroup;

    if (tabIndex) {
      this.tabIndex = coerceNumberProperty(tabIndex, 0);
    }

    this._removeUniqueSelectionListener = _radioDispatcher.listen(
      (id: string, name: string) => {
        if (id !== this.inputId && name === this.name) {
          this.checked = false;
        }
      }
    );
  }

  focus(options?: FocusOptions, origin?: FocusOrigin): void {
    if (origin) {
      this._focusMonitor.focusVia(this._inputElement, origin, options);
    } else {
      this._inputElement.nativeElement.focus(options);
    }
  }

  _markForCheck(): void {
    this._changeDetector.markForCheck();
  }

  ngOnInit(): void {
    if (this.radioGroup) {
      this.checked = this.radioGroup.value === this._value;

      if (this.checked) {
        this.radioGroup.selected = this;
      }

      this.name = this.radioGroup.name;
    }
  }

  ngAfterViewInit(): void {
    this._focusMonitor
      .monitor(this._elementRef, true)
      .subscribe((focusOrigin) => {
        if (!focusOrigin && this.radioGroup) {
          this.radioGroup._touch();
        }
      });
  }

  ngOnDestroy(): void {
    this._focusMonitor.stopMonitoring(this._elementRef);
    this._removeUniqueSelectionListener();
  }

  /** Dispatch change event with current value. */
  private _emitChangeEvent(): void {
    this.change.emit(new RadioChange(this, this._value));
  }

  _onInputClick(event: Event): void {
    event.stopPropagation();
  }

  _onInputInteraction(event: Event): void {
    event.stopPropagation();

    if (!this.checked && !this.disabled) {
      const groupValueChanged =
        this.radioGroup && this.value !== this.radioGroup.value;

      this.checked = true;
      this._emitChangeEvent();

      if (this.radioGroup) {
        this.radioGroup._controlValueAccessorChangeFn(this.value);
        if (groupValueChanged) {
          this.radioGroup._emitChangeEvent();
        }
      }
    }
  }

  /** Sets the disabled state and marks for check if a change occurred. */
  protected _setDisabled(value: boolean): void {
    if (this._disabled !== value) {
      this._disabled = value;
      this._changeDetector.markForCheck();
    }
  }
}
