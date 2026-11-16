# Lifesaver — art and audio plan

Status: 2026-11-16. The art is generated and in the game; it needs your verdict. No sound yet. Money spent so far: 0.36 USD of Kie credits.

## 1. Art direction

Your instructions on 2026-11-16, in order: no gradients, and take the visual approach of flat casual games such as Dumb Ways to Die; then, after seeing the result, blur is fine, and the colours must be muted, soft pastel tones.

### Rules I am following

- Muted pastel colours. No saturated or neon colours anywhere.
- Solid colour fills. No gradients, no glossy or 3D shading. Blur is allowed, for example behind the hint and pause panels.
- Simple shapes with rounded corners, little detail, large readable silhouettes.
- Dark text on pastel shapes, never white text, so everything stays readable.
- One strong element per screen (for example the play button); everything else stays quiet.
- Big expressive faces carry the emotion; humour comes from pose and expression.

### Palette

The colours are named after what is in a first-aid kit. They are defined once, in [src/index.css](../src/index.css).

| Name | Colour | Used for |
| --- | --- | --- |
| Mist | `#dde9f1` | Page background |
| Cotton | `#fffcf7` | Cards, panels, plain buttons |
| Ink | `#2f3e57` | Text |
| Blue | `#a9c8ec` | Main buttons, selected items, "Life" in the logo |
| Coral | `#f4aaa1` | Warnings, unsafe choices, "saver" in the logo |
| Mint | `#a9dbc3` | Correct, done, confirm |
| Butter | `#f7dc93` | Play button, stars, clue spots |

Each of blue, coral, mint and butter also has a darker shade for the strip under buttons and for coloured text. I measured the text colours against their backgrounds: every combination in use is at least 4.7 to 1, above the 4.5 to 1 accessibility guideline for normal text.

### What I will not do

I follow the flat, minimal direction, not that game's actual artwork. Lifesaver keeps its own characters, palette, logo and scenes, and none of that game's characters or images will be copied or imitated closely.

### Where this conflicts with the requirements

Section 9 of the requirements and the earlier style reference image describe a softer look. I am reading the new instruction as changing how things are drawn, not what is shown:

| Requirement says | How I will treat it |
| --- | --- |
| Logo: "Life" in blue, "saver" in red, 3D bubble lettering, dark-blue shadow, light rays | Same name and layout in the pastel blue and coral, set in type: solid letters, pale outline, dark-blue offset |
| Loading screen: light rays, round white clouds, hospital, ambulance, helicopter, running character | The town picture with clouds, hospital and ambulance. No helicopter, running character or light rays yet |
| Environments: fresh colours, bright lighting, soft shadows | Pastel fills; soft shadows are fine now that blur is allowed |
| Chibi characters with big heads and strong expressions | Kept |
| Sticker icons with a white outline | Kept |
| Style reference image (bright blue, red and yellow) | Used for subject matter only; its colours are replaced by the pastel palette |

Please confirm this reading, or say which parts of section 9 should stay as written. If you agree, section 9 should be updated to match.

## 2. Graphics

### How the art is made

You chose image generation through Kie on 2026-11-16, with the `seedream/5-5-text-to-image` model. That replaced my earlier proposal to draw everything as SVG in code.

| Layer | What it covers | How |
| --- | --- | --- |
| Scenes | One picture per level, the town, five area pictures | Generated; one prompt each in [art/manifest.json](../art/manifest.json) |
| Characters | The player, and the guide with six expressions | Generated on a transparent background. The guide is one image with six poses in a grid, cut into six files, so all six match |
| Interface | Cards, buttons, bars, pins, line icons | Built in code with the palette above |
| Logo | "Lifesaver" wordmark | Still set in type in code; image models are unreliable at lettering |

Every prompt ends with one shared style description (pastel palette, flat fills, no gradients, chibi people, no text in the picture), which is what keeps the set consistent. Pictures never contain writing, because image models garble Vietnamese text.

### Making or changing a picture

1. Add or edit the entry in `art/manifest.json`.
2. Run `node --env-file=.env scripts/gen-art.mjs <id>` (or `--missing` for every picture not yet made). The API key is read from `KIE_API_KEY` in `.env`, which is not in git.
3. The script saves the original to `art/raw/` (not in git), a compressed copy to `src/assets/art/<id>.webp` (in git), and the credits used to `art/spend.json`.
4. Look at the picture. For a level scene, run `node scripts/scene-grid.mjs <level-id>` to get a copy with a 10% grid, and set the clue and mini-game positions in the level file from it.

### What exists

| Picture | Count | Where it shows |
| --- | --- | --- |
| Level scenes | 12 | Every phase of a level, and the level list |
| Town | 1 | Loading screen, town intro, lobby, world map |
| Area pictures | 5 | Top of each area's level list |
| Player | 1 | Lobby, character creation, town intro |
| Guide expressions | 6 | Dialogue, outcome, result, lobby, town intro |

### Known limits

- Side characters appear only inside their scene; they have no separate portraits or expressions. The requirements ask for expressive characters, so say if you want portraits for them.
- A scene is one fixed picture. It does not change when the player acts (the victim does not visibly move to the shade, for example).
- Text-to-image cannot keep one person identical across different pictures. The guide avoids this by being one sheet. If the player or a victim must appear in several pictures, Kie's image-to-image model would be needed (about 0.025 USD per picture).
- I have not read Kie's or the model's terms on ownership and commercial use of generated images. Check them before a public release.

### What I need from you

1. Your verdict on the generated art, and on the art-direction reading in section 1.
2. The original logo and loading screen as files, if they exist.
3. The guide's real name and look (placeholder: "Bông", drawn as a cotton ball with a first-aid satchel).

## 3. Sound and music

Yes: I will take sound effects and music from public sources with licences that allow free use, and will not compose or synthesise them. Every file gets an entry in [credits.md](credits.md) with its source and licence.

### Sources

| Need | Source | Licence |
| --- | --- | --- |
| Interface and feedback sounds | Kenney: Interface Sounds, UI Audio, Digital Audio packs | CC0 (stated on each pack's page at kenney.nl) |
| Specific effects not in those packs | Freesound, filtered to CC0 only | CC0 |
| Background music loops | OpenGameArt, filtered to CC0; Pixabay Music as a second choice | CC0; Pixabay's own licence |

I will only use CC0 or an equally permissive licence, and will re-check the licence on the source page at download time.

### Sounds the MVP needs

| Type | List |
| --- | --- |
| Effects | Button tap, clue found, right answer, wrong answer, unsafe option blocked, mini-game target hit, clock running low, star awarded, level passed, level failed |
| Music | One loop for the lobby and map, one calmer loop for levels, one short result jingle |

### Rules

- Music stops being playful once someone in the scene is hurt; level music stays calm.
- No mini-game is timed to the music, so the music cannot teach a wrong first-aid rhythm.
- Sound starts only after the player's first tap, which phone browsers require anyway.
- The music and sound-effect switches in Settings already save their state; they will control playback once audio is added.

## 4. Budget

Total allowed for outside costs: about 10 USD.

| Item | Spent | Notes |
| --- | --- | --- |
| Image generation (Kie credits) | 0.36 USD | 20 pictures at 3.6 credits (0.018 USD) each. The account held 573.7 credits (about 2.87 USD) before and 501.7 after |
| Fonts, sound, music | 0 | Free licences only |
| Hosting on a free tier | 0 | Not set up yet |

The credits were already on the Kie account you provided; I have not bought anything. A custom domain name is not in this budget. I will ask before any purchase or paid sign-up.

## Sources checked

- Kie model catalogue and price for `seedream/5-5-text-to-image`, read from the Kie API on 2026-11-16
- [Kenney Interface Sounds](https://kenney.nl/assets/interface-sounds), [UI Audio](https://kenney.nl/assets/ui-audio), [Digital Audio](https://kenney.nl/assets/digital-audio)
