import { Component, Input } from '@angular/core';

@Component({
  selector: 'ba-quota-gauge',
  standalone: true,
  template: `
    <section class="ba-card p-4">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="ba-label">{{ label }}</p>
          <p class="mt-2 font-data text-2xl font-semibold text-text">{{ used }} / {{ limit }}</p>
        </div>
        <span class="rounded-full border px-2 py-1 text-xs" [class]="toneClass">{{ percent }}%</span>
      </div>
      <div class="mt-4 h-2 overflow-hidden rounded-full bg-background">
        <div class="h-full rounded-full transition-all" [class]="barClass" [style.width.%]="percent"></div>
      </div>
      @if (caption) {
        <p class="mt-3 text-xs text-muted">{{ caption }}</p>
      }
    </section>
  `
})
export class QuotaGaugeComponent {
  @Input() label = 'Quota';
  @Input() used = 0;
  @Input() limit = 100;
  @Input() caption = '';

  get percent(): number {
    if (this.limit <= 0) {
      return 0;
    }

    return Math.min(100, Math.round((this.used / this.limit) * 100));
  }

  get toneClass(): string {
    if (this.percent >= 90) {
      return 'border-danger/40 bg-danger/10 text-danger';
    }

    if (this.percent >= 70) {
      return 'border-warning/40 bg-warning/10 text-warning';
    }

    return 'border-success/40 bg-success/10 text-success';
  }

  get barClass(): string {
    if (this.percent >= 90) {
      return 'bg-danger';
    }

    if (this.percent >= 70) {
      return 'bg-warning';
    }

    return 'bg-accent';
  }
}
