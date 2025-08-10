import { Component, effect, input, signal } from '@angular/core';

@Component({
  selector: 'app-loading-bar',
  imports: [],
  templateUrl: './loading-bar.html',
  styleUrl: './loading-bar.scss',
})
export class LoadingBar {
  loading = input(false);
  progress = signal(0);
  visible = signal(false);
  private timer: any;

  constructor() {
    effect(() => {
      if (this.loading()) {
        this.start();
      } else {
        this.complete();
      }
    });
  }

  private start() {
    if (this.visible()) return;
    this.visible.set(true);
    this.progress.set(0);
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      const p = this.progress();
      if (p < 90) {
        const next = p + Math.max(1, (90 - p) * 0.1);
        this.progress.set(Math.min(next, 90));
      }
    }, 100);
  }

  private complete() {
    clearInterval(this.timer);
    this.progress.set(100);
    setTimeout(() => {
      this.visible.set(false);
      this.progress.set(0);
    }, 250);
  }
}
