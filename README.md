# Quiz Arena

Academic team practice with solo quizzes and local two-player buzzer matches. The question bank includes ten sample questions across science, history, literature, mathematics, geography, and art.

## Play

- Solo practice: answer questions at your own pace.
- Head-to-head: Player 1 presses **A** to buzz or **Q** to pass. Player 2 presses **L** to buzz or **P** to pass.
- The first player to buzz can answer. A correct answer earns **5 points**; an incorrect answer loses **5 points**.
- When both players pass, the game advances without changing scores.

## Run locally

Requires Node.js 22.13.0 or later and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by the development server. The app uses React, TypeScript, and vinext. The production build uses the Cloudflare Vite plugin.

```sh
npm run lint
npx tsc --noEmit
npm run build
```

## Versions

Each version has a separate Git tag and GitHub release, preserving its original source commit. See [CHANGELOG.md](CHANGELOG.md) for the changes and commit references.

```sh
git switch --detach v1.0
```

Use `git switch main` to return to the latest version. The release tags describe saved application snapshots; the original package metadata remains unchanged.
