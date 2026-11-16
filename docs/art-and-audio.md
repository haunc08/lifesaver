# Lifesaver — art and audio plan

Status: 2026-11-16. The art is generated and in the game; it needs your verdict. Sound effects, the town tune and one background recording per area are in the game; they need your ear, because I cannot listen to audio. Money spent so far: 0.59 USD of Kie credits.

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
| Close-ups | The spot being handled in a gesture mini-game: a forearm to bandage, a hand with a ring, a sting | Generated like a scene, one each, named `closeup-<level id>` |
| Items | Objects the player drags, holds, rubs with or turns in a mini-game | Generated six to a sheet on a transparent background and cut apart, like the guide. The gas valve is one larger picture, because it is shown big and turned |
| Interface | Cards, buttons, bars, pins, line icons | Built in code with the palette above |
| Logo | "Lifesaver" wordmark | Still set in type in code; image models are unreliable at lettering |

Every prompt ends with one shared style description (pastel palette, flat fills, no gradients, chibi people, no text in the picture), which is what keeps the set consistent. Pictures never contain writing, because image models garble Vietnamese text.

### Making or changing a picture

1. Add or edit the entry in `art/manifest.json`.
2. Run `node --env-file=.env scripts/gen-art.mjs <id>` (or `--missing` for every picture not yet made). The API key is read from `KIE_API_KEY` in `.env`, which is not in git.
3. The script saves the original to `art/raw/` (not in git), a compressed copy to `src/assets/art/<id>.webp` (in git), and the credits used to `art/spend.json`.
4. Look at the picture. For a level scene or a close-up, run `node scripts/scene-grid.mjs <id>` to get a copy with a 10% grid, and set the clue and mini-game positions in the level file from it.

### What exists

| Picture | Count | Where it shows |
| --- | --- | --- |
| Level scenes | 12 | Every phase of a level, and the level list |
| Town | 1 | Loading screen, town intro, home screen (as the map) |
| Area pictures | 5 | Top of each area's level list |
| Player | 1 | Character creation, town intro, and cropped to the face as the home screen's profile picture |
| Close-ups | 5 | The gesture mini-games of five levels: a finger and a forearm to bandage, a stung arm, an overheated runner's head and shoulders, a scalded hand |
| Item pictures | 26 | Things dragged, held, rubbed with or turned in mini-games: gauze, cold pack, water bottle, backpack, gas valve, card, ring, soap and so on. Three are not used yet (plaster, phone, hand fan) |
| Call operator | 1 | The person who answers in the phone-call mini-game |
| Guide expressions | 6 | Dialogue, outcome, result, home screen, town intro |

### Known limits

- Side characters appear only inside their scene; they have no separate portraits or expressions. The requirements ask for expressive characters, so say if you want portraits for them.
- A scene is one fixed picture. It does not change when the player acts (the victim does not visibly move to the shade, for example). In the gesture mini-games the change is drawn in code on top of the close-up: the bandage, the stinger, the ring.
- The first finger close-up drew the skin creases in coral, which read as wounds; it was generated again with a stricter prompt. Look at every new picture for this kind of thing.
- Text-to-image cannot keep one person identical across different pictures. The guide avoids this by being one sheet. If the player or a victim must appear in several pictures, Kie's image-to-image model would be needed (about 0.025 USD per picture).
- I have not read Kie's or the model's terms on ownership and commercial use of generated images. Check them before a public release.

### What I need from you

1. Your verdict on the generated art, and on the art-direction reading in section 1.
2. The original logo and loading screen as files, if they exist.
3. The guide's real name and look (placeholder: "Bông", drawn as a cotton ball with a first-aid satchel).

## 3. Sound and music

Sound effects, music and background recordings come from public sources under CC0 or as public-domain works, as you asked; nothing was composed or synthesised. You approved the first four downloads and then the five area recordings on 2026-11-16. Every file is listed in [credits.md](credits.md).

Each area has its own background sound, which plays in that area's level list and in its levels (your instruction: a sound that fits the place is better than more music). The town tune plays everywhere else. The piano track that used to play inside levels is gone.

I cannot listen to audio. I chose the files from their names, tags and descriptions, and from measurements (length, loudness, and whether the pitch rises or falls). Please listen to the game once and tell me which sounds to swap; swapping one is a one-line change.

### What is in the game

| Sound | When it plays | Source file |
| --- | --- | --- |
| tap | Any button | Kenney Interface Sounds, `click_001` |
| clue | A clue is opened | Kenney Interface Sounds, `pluck_002` |
| right | Right assessment, plan accepted, hold finished, right quick-decision card | Kenney Interface Sounds, `confirmation_001` |
| wrong | Wrong assessment, irrelevant option, wrong card, hold released early, harmless spot or wrong place in a mini-game | Kenney Interface Sounds, `error_003` |
| warn | An unsafe option is blocked, or a wrong object is used in a mini-game | Kenney Interface Sounds, `question_002` |
| hit | A mini-game target, hazard or item placed correctly | Kenney Interface Sounds, `drop_002` |
| tick | Each of the last 10 seconds on the clock | Kenney Interface Sounds, `tick_002` |
| star | Each star as it lands on the result screen | Kenney Interface Sounds, `confirmation_002` |
| pass | Result screen, level passed | Kenney Music Jingles, `jingles_PIZZA02` (rising, plucked strings) |
| fail | Result screen, level not passed | Kenney Music Jingles, `jingles_PIZZA01` (falling, plucked strings) |
| Town music | Every screen outside the areas | "Cozy Puzzle Title" by MintoDog, 61 seconds |
| School | The school's level list and levels | "Ambient Classroom-Mono" by rcrossley: a classroom with very few distinct words, by its description |
| Dormitory | The dormitory's level list and levels | "Sound Atmosphere in a House" by Joseph Sardin: quiet room tone |
| Streets | The streets' level list and levels | "Street and Roads" by Joseph Sardin: traffic at a crossroads |
| Food district | The food district's level list and levels | "Restaurant #3" by Joseph Sardin and Axeline T.: about 40 people at brunch |
| Park | The park's level list and levels | "Birds in the City #1" by Joseph Sardin: garden birds |

None of the five recordings was made in Vietnam: I found no CC0 or public-domain street or market recording from South-East Asia. The school one is a computer classroom and the restaurant is French, so voices may sound foreign if they are clear enough to make out. Listen for that.

### How it works

- The downloads are converted by `node scripts/import-audio.mjs <folder>` into small MP3 files in `src/assets/audio/` (3.1 MB in total: the town tune, five area recordings of about 0.5 MB each, and the effects). The tables at the top of that script map each game sound to its source file. The original downloads are not in git.
- Effects are brought to the same peak level; music is levelled and given a short fade at its start and end, because an MP3 cannot loop without a tiny gap.
- Each area recording is cut to one minute (skipping its first three seconds), brought to about the same loudness as the others, faded at both ends and saved in mono. It loops with a two-second dip, not seamlessly.
- The code is in `src/audio/`. A sound with no file is skipped, so removing a file never breaks the game.
- Sound starts only after the player's first tap, which phone browsers require.
- The two switches in Settings control playback: one for music and background sound, one for effects. Background sound stops while the game is in the background.

### Rules

- Inside an area the background is the sound of the place, not music; the playful tune is for the town only.
- No mini-game is timed to the music, so the music cannot teach a wrong first-aid rhythm.
- Only CC0 or an equally permissive licence, checked on the source page at download time.

## 4. Budget

Total allowed for outside costs: about 10 USD.

| Item | Spent | Notes |
| --- | --- | --- |
| Image generation (Kie credits) | 0.59 USD | 33 generations at 3.6 credits (0.018 USD) each. The last nine were for the gesture mini-games: five close-ups (one made twice), the gas valve, a sheet of six items and the call operator. The account held 573.7 credits (about 2.87 USD) at the start and about 455 after |
| Fonts, sound, music | 0 | Free licences only (CC0 sound, Open Font License fonts) |
| Hosting on a free tier | 0 | GitHub Pages |

The credits were already on the Kie account you provided; I have not bought anything. A custom domain name is not in this budget. I will ask before any purchase or paid sign-up.

## Sources checked

- Kie model catalogue and price for `seedream/5-5-text-to-image`, read from the Kie API on 2026-11-16
- [Kenney Interface Sounds](https://kenney.nl/assets/interface-sounds) and [Music Jingles](https://kenney.nl/assets/music-jingles), downloaded from Kenney's uploads on OpenGameArt; each zip carries a CC0 licence file
- [Cozy Puzzle Title](https://opengameart.org/content/cozy-puzzle-title) on OpenGameArt, listed as CC0 on 2026-11-16
- [Bigsoundbank licences](https://bigsoundbank.com/licenses.html): every sound there is CC0, and each sound page repeats it under "License"
- [Ambient classroom mono](https://commons.wikimedia.org/wiki/File:Ambient_classroom_mono.ogg) on Wikimedia Commons, released into the public domain by its author
