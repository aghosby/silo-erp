import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface RangeSliderValue {
  min: number;
  max: number;
}

type ActiveThumb = 'min' | 'max' | null;

@Component({
  selector: 'app-range-slider',
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeSliderComponent),
      multi: true,
    },
  ],
})
export class RangeSliderComponent
  implements ControlValueAccessor, AfterViewInit
{
  @Input() min: any = 0;
  @Input() max: any = 100;
  @Input() step: any = 1;
  @Input() label = '';
  @Input() showValue = true;
  @Input() disabled = false;

  @Input() prefix: any = '';
  @Input() suffix: any = '';

  @ViewChild('track', { static: true }) trackRef!: ElementRef<HTMLDivElement>;

  minValue = 0;
  maxValue = 100;

  isDragging = false;
  activeThumb: ActiveThumb = null;

  private onChange: (value: RangeSliderValue) => void = () => {};
  private onTouched: () => void = () => {};

  ngAfterViewInit(): void {
    this.initializeValues();
  }

  writeValue(value: RangeSliderValue | null): void {
    if (!value) {
      this.minValue = this.min;
      this.maxValue = this.max;
      return;
    }

    const nextMin = this.clampAndSnap(value.min ?? this.min);
    const nextMax = this.clampAndSnap(value.max ?? this.max);

    this.minValue = Math.min(nextMin, nextMax);
    this.maxValue = Math.max(nextMin, nextMax);
  }

  registerOnChange(fn: (value: RangeSliderValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  get minPercentage(): number {
    if (this.max === this.min) return 0;
    return ((this.minValue - this.min) / (this.max - this.min)) * 100;
  }

  get maxPercentage(): number {
    if (this.max === this.min) return 0;
    return ((this.maxValue - this.min) / (this.max - this.min)) * 100;
  }

  get fillLeft(): number {
    return this.minPercentage;
  }

  get fillWidth(): number {
    return this.maxPercentage - this.minPercentage;
  }

  get displayValue(): string {
    return `${this.formatValue(this.minValue)} - ${this.formatValue(this.maxValue)}`;
  }

  formatValue(value: number): string {
    const formatted = new Intl.NumberFormat().format(value);
    return `${this.prefix}${formatted}${this.suffix ?? ''}`;
  }

  onTrackClick(event: MouseEvent): void {
    if (this.disabled) return;

    const clickedValue = this.getValueFromPointer(event.clientX);
    const distanceToMin = Math.abs(clickedValue - this.minValue);
    const distanceToMax = Math.abs(clickedValue - this.maxValue);

    if (distanceToMin <= distanceToMax) {
      this.setMinValue(clickedValue);
    } else {
      this.setMaxValue(clickedValue);
    }

    this.onTouched();
  }

  onThumbMouseDown(event: MouseEvent, thumb: 'min' | 'max'): void {
    if (this.disabled) return;

    event.stopPropagation();
    event.preventDefault();

    this.isDragging = true;
    this.activeThumb = thumb;
    this.onTouched();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging || this.disabled || !this.activeThumb) return;

    const pointerValue = this.getValueFromPointer(event.clientX);

    if (this.activeThumb === 'min') {
      this.setMinValue(pointerValue);
    } else {
      this.setMaxValue(pointerValue);
    }
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.activeThumb = null;
    this.onTouched();
  }

  onKeyDown(event: KeyboardEvent, thumb: 'min' | 'max'): void {
    if (this.disabled) return;

    const currentValue = thumb === 'min' ? this.minValue : this.maxValue;
    let nextValue = currentValue;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        nextValue = currentValue + this.step;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        nextValue = currentValue - this.step;
        break;
      case 'Home':
        nextValue = this.min;
        break;
      case 'End':
        nextValue = this.max;
        break;
      case 'PageUp':
        nextValue = currentValue + this.step * 10;
        break;
      case 'PageDown':
        nextValue = currentValue - this.step * 10;
        break;
      default:
        return;
    }

    event.preventDefault();

    if (thumb === 'min') {
      this.setMinValue(nextValue);
    } else {
      this.setMaxValue(nextValue);
    }

    this.onTouched();
  }

  private initializeValues(): void {
    this.minValue = this.clampAndSnap(this.minValue || this.min);
    this.maxValue = this.clampAndSnap(this.maxValue || this.max);

    if (this.minValue > this.maxValue) {
      this.minValue = this.maxValue;
    }
  }

  private getValueFromPointer(clientX: number): number {
    const track = this.trackRef.nativeElement;
    const rect = track.getBoundingClientRect();

    const rawRatio = (clientX - rect.left) / rect.width;
    const clampedRatio = Math.min(1, Math.max(0, rawRatio));

    return this.min + clampedRatio * (this.max - this.min);
  }

  private setMinValue(value: number): void {
    const snapped = this.clampAndSnap(value);
    const bounded = Math.min(snapped, this.maxValue);

    if (bounded !== this.minValue) {
      this.minValue = bounded;
      this.emitChange();
    }
  }

  private setMaxValue(value: number): void {
    const snapped = this.clampAndSnap(value);
    const bounded = Math.max(snapped, this.minValue);

    if (bounded !== this.maxValue) {
      this.maxValue = bounded;
      this.emitChange();
    }
  }

  private emitChange(): void {
    this.onChange({
      min: this.minValue,
      max: this.maxValue,
    });
  }

  private clampAndSnap(value: number): number {
    const safeStep = this.step > 0 ? this.step : 1;
    const clamped = Math.min(this.max, Math.max(this.min, value));
    const snapped =
      Math.round((clamped - this.min) / safeStep) * safeStep + this.min;

    const decimals = this.countDecimals(safeStep);

    return Number(
      Math.min(this.max, Math.max(this.min, snapped)).toFixed(decimals)
    );
  }

  private countDecimals(value: number): number {
    if (Math.floor(value) === value) return 0;
    const parts = value.toString().split('.');
    return parts[1]?.length || 0;
  }
}