import { Component, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { PlayerService } from './player.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly player = inject(PlayerService);
  private readonly host = viewChild.required<ElementRef<HTMLElement>>('playerHost');
  protected readonly onStudy = toSignal(
    inject(Router).events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects.startsWith('/study')),
    ),
    { initialValue: false },
  );

  constructor() {
    afterNextRender(() => this.player.attach(this.host().nativeElement));
  }
}
