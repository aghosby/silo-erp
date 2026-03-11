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

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true,
    },
  ],
})
export class SliderComponent
  implements ControlValueAccessor, AfterViewInit
{
  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;
  @Input() label = '';
  @Input() showValue = true;
  @Input() disabled = false;

  @ViewChild('track', { static: true }) trackRef!: ElementRef<HTMLDivElement>;

  value = 0;
  isDragging = false;

  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};

  ngAfterViewInit(): void {
    this.value = this.clampAndSnap(this.value);
  }

  writeValue(value: number | null): void {
    if (value === null || value === undefined || Number.isNaN(value)) {
      this.value = this.min;
      return;
    }
    this.value = this.clampAndSnap(value);
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  get percentage(): number {
    if (this.max === this.min) return 0;
    return ((this.value - this.min) / (this.max - this.min)) * 100;
  }

  onTrackClick(event: MouseEvent): void {
    if (this.disabled) return;
    this.updateValueFromPointer(event.clientX);
    this.onTouched();
  }

  onThumbMouseDown(event: MouseEvent): void {
    if (this.disabled) return;
    event.stopPropagation();
    event.preventDefault();
    this.isDragging = true;
    this.onTouched();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging || this.disabled) return;
    this.updateValueFromPointer(event.clientX);
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.onTouched();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.disabled) return;

    let nextValue = this.value;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        nextValue = this.value + this.step;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        nextValue = this.value - this.step;
        break;
      case 'Home':
        nextValue = this.min;
        break;
      case 'End':
        nextValue = this.max;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.setValue(nextValue);
    this.onTouched();
  }

  private updateValueFromPointer(clientX: number): void {
    const track = this.trackRef.nativeElement;
    const rect = track.getBoundingClientRect();

    const rawRatio = (clientX - rect.left) / rect.width;
    const clampedRatio = Math.min(1, Math.max(0, rawRatio));
    const rawValue = this.min + clampedRatio * (this.max - this.min);

    this.setValue(rawValue);
  }

  private setValue(newValue: number): void {
    const snapped = this.clampAndSnap(newValue);

    if (snapped !== this.value) {
      this.value = snapped;
      this.onChange(this.value);
    }
  }

  private clampAndSnap(value: number): number {
    const clamped = Math.min(this.max, Math.max(this.min, value));
    const snapped =
      Math.round((clamped - this.min) / this.step) * this.step + this.min;

    const decimals = this.countDecimals(this.step);
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