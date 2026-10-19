import { Injectable, computed, signal } from '@angular/core';

// Minimal typings for the parts of the YouTube IFrame API we use.
interface YTPlayer {
  loadVideoById(opts: { videoId: string; startSeconds?: number }): void;
  playVideo(): void;
  pauseVideo(): void;
  stopVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  setVolume(volume: number): void;
}

interface YTNamespace {
  Player: new (
    el: HTMLElement,
    opts: {
      width: string;
      height: string;
      playerVars: Record<string, number | string>;
      events: {
        onReady: () => void;
        onStateChange: (e: { data: number }) => void;
        onError: (e: { data: number }) => void;
      };
    },
  ) => YTPlayer;
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const PLAYING = 1;
const ENDED = 0;
const BUFFERING = 3;

function loadApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  return new Promise((resolve, reject) => {
    window.onYouTubeIframeAPIReady = () => resolve(window.YT!);
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.onerror = () => reject(new Error('Could not load the YouTube player'));
    document.head.appendChild(script);
  });
}

/**
 * A single, visually hidden YouTube player shared by the whole app,
 * so the video title never gives the answer away.
 */
@Injectable({ providedIn: 'root' })
export class PlayerService {
  readonly ready = signal(false);
  readonly loadFailed = signal(false);
  readonly playing = signal(false);
  readonly buffering = signal(false);
  /** YouTube error code for the current video (100 = removed, 101/150 = embedding blocked). */
  readonly error = signal<number | null>(null);
  readonly videoId = signal<string | null>(null);
  /** Seconds played since the segment started. */
  readonly elapsed = signal(0);
  /** Segment length in seconds; 0 means play until the end. */
  readonly limit = signal(0);
  readonly progress = computed(() => {
    const limit = this.limit();
    return limit ? Math.min(1, this.elapsed() / limit) : 0;
  });

  private player?: YTPlayer;
  private segmentStart = 0;
  private timer?: ReturnType<typeof setInterval>;

  async attach(el: HTMLElement): Promise<void> {
    try {
      const YT = await loadApi();
      this.player = new YT.Player(el, {
        width: '200',
        height: '200',
        playerVars: { playsinline: 1, controls: 0, disablekb: 1, rel: 0, iv_load_policy: 3 },
        events: {
          onReady: () => this.ready.set(true),
          onStateChange: (e) => this.onStateChange(e.data),
          onError: (e) => {
            this.error.set(e.data);
            this.setPlaying(false);
          },
        },
      });
    } catch {
      this.loadFailed.set(true);
    }
  }

  /** Load a video and play `limit` seconds from `start` (limit 0 = no limit). */
  play(videoId: string, start = 0, limit = 0): void {
    if (!this.player) return;
    this.error.set(null);
    this.videoId.set(videoId);
    this.segmentStart = start;
    this.elapsed.set(0);
    this.limit.set(limit);
    this.player.setVolume(100);
    this.player.loadVideoById({ videoId, startSeconds: start });
    this.buffering.set(true);
  }

  /** Replay the current segment from its start point. */
  replay(): void {
    if (!this.player || !this.videoId()) return;
    this.elapsed.set(0);
    this.player.setVolume(100);
    this.player.seekTo(this.segmentStart, true);
    this.player.playVideo();
  }

  toggle(): void {
    if (!this.player) return;
    if (this.playing()) {
      this.player.pauseVideo();
    } else if (this.limit() && this.elapsed() >= this.limit()) {
      this.replay();
    } else {
      this.player.playVideo();
    }
  }

  /** Remove the segment limit so the piece keeps playing. */
  unlimit(): void {
    this.limit.set(0);
    this.player?.setVolume(100);
    if (!this.playing()) this.player?.playVideo();
  }

  pause(): void {
    this.player?.pauseVideo();
  }

  stop(): void {
    this.player?.stopVideo();
    this.videoId.set(null);
    this.setPlaying(false);
  }

  private onStateChange(state: number): void {
    this.buffering.set(state === BUFFERING);
    this.setPlaying(state === PLAYING);
    if (state === ENDED) this.elapsed.set(this.limit() || this.elapsed());
  }

  private setPlaying(playing: boolean): void {
    this.playing.set(playing);
    clearInterval(this.timer);
    if (playing) this.timer = setInterval(() => this.tick(), 200);
  }

  private tick(): void {
    if (!this.player) return;
    const elapsed = Math.max(0, this.player.getCurrentTime() - this.segmentStart);
    this.elapsed.set(elapsed);
    const limit = this.limit();
    if (!limit) return;
    // Fade out over the last second so the cut isn't abrupt.
    const remaining = limit - elapsed;
    if (remaining <= 0) {
      this.player.pauseVideo();
      this.elapsed.set(limit);
    } else if (remaining < 1) {
      this.player.setVolume(Math.round(remaining * 100));
    }
  }
}
