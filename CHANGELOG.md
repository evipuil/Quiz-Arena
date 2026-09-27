# Version history

These four versions preserve the original commits from September 8, 2026. Version tags and GitHub releases were added on September 27, 2026.

## v1.3 — Five-point scoring

Commit: `9aee8707963b756525fec384400dbea3f0f1b049`

- Changed the head-to-head reward for a correct answer from 10 to 5 points.
- Kept the incorrect-answer penalty at 5 points.
- Updated the score banner, rules, and answer tool description to match.

## v1.2 — Player pass controls

Commit: `3179641760e87d15adc59a12f383450a9917d6c6`

- Added Q and P keyboard shortcuts for Player 1 and Player 2 to pass.
- Prevented a player who passed from buzzing on that question.
- Advanced to the next question without score changes when both players passed.
- Added pass status to the interface and a player-pass tool.

This snapshot awards 10 points for a correct answer and deducts 5 for an incorrect answer.

## v1.1 — Buzzer input fix

Commit: `f838a11e961d5b98b1b003465ea9a4aeffc23791`

- Prevented the A and L buzzer keystrokes from appearing in the answer field.
- Added static-export and Vercel configuration updates.

## v1.0 — Initial game

Commit: `14b672c`

- Added solo practice and local head-to-head quiz modes.
- Included a sample question bank, answer checking, scoring, and match reset controls.
- Added the React and TypeScript interface and build configuration.

## Publication notes

The release tags point to the original application commits. The README and this history were added afterward on `main`. Historical versions retain their original behavior and configuration.

Checks run on the latest application snapshot on September 27, 2026:

- TypeScript (`npx tsc --noEmit`): passed.
- Lint (`npm run lint`): failed with existing accessibility, React hook, and TypeScript lint findings.
- Build (`npm run build`): generated the static routes, then exited with a Windows `UV_HANDLE_CLOSING` assertion. The command did not pass.
- Git object integrity: passed.

The earlier snapshots were reviewed through their commit diffs but were not individually built or runtime-tested during publication.
