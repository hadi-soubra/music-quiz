import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SettingsService } from '../settings.service';
import { COMPOSERS, TRACKS } from '../tracks';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly settings = inject(SettingsService);
  protected readonly composers = COMPOSERS;
  protected readonly snippets = [
    { value: 10, label: '10s' },
    { value: 20, label: '20s' },
    { value: 30, label: '30s' },
    { value: 0, label: 'Full' },
  ];
  protected readonly count = computed(
    () => TRACKS.filter((t) => this.settings.settings().composers.includes(t.composer)).length,
  );

  protected countFor(id: string): number {
    return TRACKS.filter((t) => t.composer === id).length;
  }
}
