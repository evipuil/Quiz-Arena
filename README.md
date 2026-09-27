# Quiz Arena

Academic team practice with solo quizzes and local two-player buzzer matches. The question bank includes ten sample questions across science, history, literature, mathematics, geography, and art.

## Play

- Solo practice: answer questions at your own pace. Correct answers earn **10 points**; incorrect answers lose **5 points**.
- Head-to-head: Player 1 presses **A** to buzz or **Q** to pass. Player 2 presses **L** to buzz or **P** to pass.
- The first player to buzz can answer. A correct answer earns **5 points**; an incorrect answer loses **5 points**.
- When both players pass, the game advances without changing scores.

## Project work and dependencies

The application history records Eshan Vipuil's work on the solo and head-to-head game, the buzzer input fix, player pass controls, and five-point head-to-head scoring. The [version history](CHANGELOG.md) links each change to its original commit.

The project uses the OpenAI Sites scaffold and build integration, React, vinext, Tailwind CSS, Lucide icons, and shadcn/Base UI components. Those frameworks and shared components are maintained by their respective authors. Application code is in [components/solo-quiz.tsx](components/solo-quiz.tsx) and [components/head-to-head-game.tsx](components/head-to-head-game.tsx); the ten-question sample bank and answer matching are in [lib/questions.ts](lib/questions.ts).

Both players use the same browser. Scores are held in component state for the current session.

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

## Research papers

[Research papers attached here](papers/) cover Eshan Vipuil's separate research projects and are not evaluations of this quiz software. The [profile research collection](https://github.com/evipuil/evipuil/tree/main/papers) also contains the papers.
