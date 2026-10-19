# Who Composed It?

Practice quiz for the music exam: a piece from the playlist plays (title and video hidden) and you guess the composer.

- **Practice**: pick random spot or beginning, 10s/20s/30s/full clips, and which composers to include. Missed pieces can be retried at the end.
- **Study**: every piece grouped by composer, with listening hints.

Audio comes from embedded YouTube videos; the list lives in [src/app/tracks.ts](src/app/tracks.ts). To swap a recording, change its `videoId` (the part after `watch?v=` in a YouTube URL) and `duration` (seconds).

## Run locally

```bash
npm install
npm start          # http://localhost:4200
```

## Deploy to Cloudflare

The site auto-deploys from GitHub: every push to `main` rebuilds and publishes it.

One-time setup in the Cloudflare dashboard: *Workers & Pages → Create → Import a repository*, pick this repo, and use:

| Setting        | Value               |
| -------------- | ------------------- |
| Build command  | `npm run build`     |
| Deploy command | `npx wrangler deploy` |

[wrangler.jsonc](wrangler.jsonc) tells Cloudflare to serve `dist/composer-quiz/browser`, and [.node-version](.node-version) pins the build to Node 24.

Manual deploy from your machine instead: `npx wrangler login`, then `npm run deploy`.
