# Lifesaver

A Vietnamese-language web game for phone screens that teaches first-aid skills through short everyday situations.

The game is in early development. Its first-aid content is draft text that has not been checked by a qualified reviewer, and the game is not a substitute for first-aid training.

## Run it

Developed with Node 24 and pnpm 10.

```sh
pnpm install
pnpm dev
```

Open the address it prints. On a computer, narrow the window or use the browser's phone view; the game is laid out for a phone held upright.

## Check it

```sh
pnpm test        # game rules
pnpm test:e2e    # a full playthrough in Chrome
pnpm build       # typecheck and production build
```

## Read more

- [Requirements](high-level-req.md)
- [MVP plan](docs/plan.md)
- [Art and audio plan](docs/art-and-audio.md)
- [Current status and next steps](docs/status.md)
- [Credits and licences](docs/credits.md)
- [Guide for coding agents](CLAUDE.md)
