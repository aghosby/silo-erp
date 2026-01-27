import { Component, Input, OnInit } from '@angular/core';
// import { SharedModule } from '../../../assets/img/project';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-lottie',
  standalone: false,
  template: `
    <ng-lottie
      [options]="{
        path: this.path,
        loop: this.loop,
        autoplay: this.autoplay,
      }"
      [width]="width"
      [height]="height"
      [style]="style"
    ></ng-lottie>
  `,
})
export class LottieAnimationComponent implements OnInit {

  @Input() autoplay = true;
  @Input() loop = true;
  @Input() path = '';
  @Input() width = '100px';
  @Input() height = '100px';
  @Input() style = '';
  @Input() options: Partial<AnimationOptions> = {};

  ngOnInit(): void {
    console.log('Options', this.lottieOptions)
  }

  get lottieOptions(): AnimationOptions {
    return {
      path: this.path,
      loop: this.loop,
      autoplay: this.autoplay,
      ...this.options
    };
  }

}
