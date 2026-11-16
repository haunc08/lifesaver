/**
 * Generated artwork, by id. Files live in src/assets/art and are produced by
 * scripts/gen-art.mjs from art/manifest.json. `art()` returns undefined for an
 * image that has not been generated yet, so callers can fall back to a placeholder.
 */
const files = import.meta.glob<string>('./assets/art/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
})

const byId: Record<string, string | undefined> = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [
    path.slice(path.lastIndexOf('/') + 1, -'.webp'.length),
    url,
  ]),
)

export function art(id: string): string | undefined {
  return byId[id]
}

/** Start loading these pictures now, so they are ready by the time they are shown. */
export function preloadArt(ids: string[]) {
  for (const id of new Set(ids)) {
    const src = byId[id]
    if (src) new Image().src = src
  }
}
