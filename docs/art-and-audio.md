# Lifesaver — art and audio plan

Status: draft for review, 2026-11-16. Nothing here has been bought, downloaded or generated yet. Everything on screen today is placeholder: emoji for characters and icons, plain colour boxes for scenes.

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
| Logo: "Life" in blue, "saver" in red, 3D bubble lettering, dark-blue shadow, light rays | Same name and layout in the pastel blue and coral, drawn flat: solid letters, pale outline, dark-blue offset |
| Loading screen: light rays, round white clouds, hospital, ambulance, helicopter, running character | Same elements, drawn as flat shapes |
| Environments: fresh colours, bright lighting, soft shadows | Pastel fills; soft shadows are fine now that blur is allowed |
| Chibi characters with big heads and strong expressions | Kept |
| Sticker icons with a white outline | Kept |
| Style reference image (bright blue, red and yellow) | Used for subject matter only; its colours are replaced by the pastel palette |

Please confirm this reading, or say which parts of section 9 should stay as written. If you agree, section 9 should be updated to match.

## 2. Graphics

### What I can and cannot do

I can write code, so I can build the interface (cards, buttons, bars, layout, motion) and draw vector art as SVG. I have no image-generation tool in this environment, so painted or richly detailed illustrations would need an outside service or you.

The flat direction changes the picture: simple solid-colour shapes are exactly what can be drawn well in SVG code, so I can now make most of the art myself.

### Recommended approach

| Layer | What it covers | How | Cost |
| --- | --- | --- | --- |
| Interface | Cards, buttons, pills, clock, progress bar, star rows | Built in code | Free; in place |
| Characters | Player, guide, side characters, six expressions each | Drawn as SVG in code: one body shape per character, with swappable eyes, mouths and brows for the expressions | Free |
| Scenes and map | Level viewpoints, world map, town intro, loading screen | Drawn as SVG in code from flat shapes | Free |
| Icons and props | First-aid kit, siren, phone, lock, bandage, ice pack and so on | Drawn as SVG in code in the same style, so they match the characters | Free |

Why this fits: every image comes from one hand and one palette, so the set is consistent; files are tiny and stay sharp on any screen; expressions and, later, outfits are just swapped parts; and clue spots line up exactly because scenes and spots are both positioned in code.

The limit: my SVG drawings will be clean and simple, not as charming as a professional illustrator's. That is acceptable for this style only if the characters come out appealing, which is why the first step is a sample.

### First step: a sample for you to judge

Before drawing everything, I will draw one small set and stop for your verdict: the player character, the guide character with all six expressions, and the classroom scene for level 1 with its clues in place. If you like it, I continue through the list below. If not, we switch to the fallback.

### Fallback: AI-generated images

| | Route A: I generate through an API | Route B: you generate from my briefs |
| --- | --- | --- |
| How | You create an account with an image service and give me an API key; I script the generation and retry misses | I write a prompt for each image; you run them in your own tool and drop the files into the project |
| Cost | Roughly 4.50–7.50 USD for about 150 generations | Free if your existing tool covers it |
| Risk | Style drifts between images; flat vector style is among the easier ones to keep consistent | Same, and it takes an hour or two of your time |

The cost figure assumes about 0.03–0.05 USD per standard image, taken from third-party price comparison sites dated mid-2026. Those sites disagree with each other, and reference images add input cost on some models, so I would check the official price page and run a three-image test before spending more.

### Art list for the MVP

| Group | Count |
| --- | --- |
| Level scenes (12 levels, some with a second viewpoint) | about 18 |
| World map, five area pictures, town intro | about 8 |
| Logo and loading screen | 2 |
| Player character | 1 |
| Guide character with six expressions | 1 |
| Side characters with six expressions each | about 8 |
| Icons and mini-game props | about 25 |

### What I need from you

1. Confirmation of the art-direction reading in section 1.
2. The original logo and loading screen as files, if they exist, or confirmation that I should draw flat versions.
3. Any existing designs for the player and guide characters, including the guide's name (placeholder: "Bông").

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

| Item | Planned | Spent |
| --- | --- | --- |
| Art drawn in code, fonts, sound, music | 0 | 0 |
| Image generation (fallback only) | up to 8 USD | 0 |
| Hosting on a free tier | 0 | 0 |

A custom domain name is not in this budget; the free hosting address will be used unless you say otherwise. I will ask before each purchase or paid sign-up.

## Sources checked

- [Image generation API pricing by model, developersdigest.tech](https://www.developersdigest.tech/models/image-generation)
- [AI image generation API pricing, buildmvpfast.com](https://www.buildmvpfast.com/api-costs/ai-image)
- [Kenney Interface Sounds](https://kenney.nl/assets/interface-sounds), [UI Audio](https://kenney.nl/assets/ui-audio), [Digital Audio](https://kenney.nl/assets/digital-audio)
