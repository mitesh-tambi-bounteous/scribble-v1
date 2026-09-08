---
project: scribl
updated: 2026-09-01
---

# /share

The exit screen for taking one Scribl response out of the app. It builds a
branded share card from the response's drawing, caption and prompt, then
offers four target tiles to send it somewhere else. It is reached only from
`/response/[id]`.

## At a glance

| Property | Value |
|----------|-------|
| Route | `/share` |
| Router file | `app/share.tsx` |
| Flows | F6 Share outside the app |
| Position in flow | the only screen in the flow, entered from `/response/[id]` |
| Data calls | one read, `listChannelDays`, used only to resolve the caption's prompt text. No write call |
| Shared surface | `ShareCardForExport` (`components/share/ShareCard.tsx`), the off-screen export tree that produces the shared PNG |

Cited to hs2studio/scribl-app at `c1b3c2d` on `main`, clean tree.

## The capture

<figure class="tile-single"><a href="/assets/prototype/22-share.png"><img src="/assets/prototype/22-share.png" alt="Share screen: a grey card headed 'scribl' and dated Aug 31, a white square holding an orange sun-shape glyph rather than the person's own drawing, a caption 'Sketching the sunrise over the backyard fence.' and a prompt line, then four target tiles: Share, Instagram, Copy link, More, and a pink Done button"></a><figcaption>Open the tile. From <code>npm run capture:board</code> at scribl-app <code>72c3ab8</code>, captured 2026-08-31.</figcaption></figure>

The card renders. This is not an empty state or a guard message. But the image
slot holds the same generic sun glyph called out in
[F2's note 2](/prototype/workflows/f2-first-run-onboarding#note-2-the-story-screen-thumbnail-is-not-your-drawing),
not the seeded creature drawing from onboarding. Whatever produces that
placeholder in this capture branch, it reaches `/share` too, by the same
`imageRef` path (`app/share.tsx:160`, `539-546`) that feeds
`EnhancedToggleImage`. Two screens showing the wrong drawing from the same
underlying cause is worth tracing once rather than twice.

## Features

One row per thing a person can do.

| Feature | Where it lives |
|---------|----------------|
| See the response as a branded card: drawing, caption or voice-note marker, prompt line, date badge | `app/share.tsx:524-560` |
| Tap "Share", dispatching the OS share sheet with the captured card image, falling back to a URL share on any capture or API failure | `app/share.tsx:406-456`, tile at `:501` |
| Tap "Copy link", copying the response URL to the clipboard on web, or falling back to `handleShare` where there is no clipboard API | `app/share.tsx:485-492`, tile at `:511` |
| Go back to the response, via the header's back control | `app/share.tsx:525`, `goBack("/home")` from `src/lib/nav` |
| Finish, returning to the wall it was composed from if `originChannelId` is set, else to `/home` | `app/share.tsx:657-666` |

Two of the four target tiles do nothing. "Instagram" is a bare `onPress`
with only a comment, `/* stub: Instagram share target not wired for POC */`
(`app/share.tsx:503-510`). "More" is the same shape,
`/* stub: additional share targets not wired for POC */`
(`app/share.tsx:512-520`). Both render as normal-looking, enabled buttons,
identical in weight to "Share" and "Copy link". A person tapping either sees
nothing happen: no toast, no log visible to them, no disabled state. Half the
share sheet is inert and looks exactly like the half that works.

## Data calls

**One read, and it is not what drives the share itself.**

| Client method | Endpoint | Handler |
|---------------|----------|---------|
| `listChannelDays(channelId)` | `GET /channels/{channelId}/days` | `backend/lambda/handlers/channel-days.ts:52` |

The client method is `src/data/http.ts:380-384`. The screen calls it directly
in an effect (`app/share.tsx:273-289`) only when `channelId` and `promptId`
are both present and the response is not a composition, matching this day's
`promptId` against the channel's day rows to get the prompt's text for the
caption line. It is a lookup, not a share action.

**No write call for the share itself.** Dispatching a share invokes the
device's native `Share.share` (native) or `navigator.share` /
`navigator.clipboard` (web) directly (`app/share.tsx:406-456`), and there is
no API call anywhere in this file that records a share having happened. The
target-tile taps read only route params passed in from `/response/[id]`
(`app/share.tsx:154-182`) and the local `promptsByDate` / `channelPromptText`
state built from the read above.

## State in, state out

**Reads on entry.** The full response, entirely via route params set by the
caller: `id`, `promptId`, `channelId`, `authorName`, `text`, `imageRef`,
`createdAt`, `enhancedImageRef`, `enhancementStatus`, `hasAudio`,
`audioDurationMs`, `composedFrom`, `originChannelId`
(`app/share.tsx:154-182`). `usePromptStore`'s `promptsByDate`
(`app/share.tsx:214`) is also read, for the legacy date-keyed prompt fallback.

**Writes on mount.** A module-level share-dispatch guard is reset
(`app/share.tsx:294-297`), so a fresh mount never inherits a stale in-flight
flag or cooldown from a previous visit to this screen.

**Writes on exit.** None to a store or the API. "Done" only navigates,
either `router.replace` to `/family` with `originChannelId` as `channelId`,
or to `/home` (`app/share.tsx:657-666`).

## Components

| Component | Path |
|-----------|------|
| `ShareCardForExport`, the off-screen tree captured into the shared PNG | `components/share/ShareCard.tsx`, imported at `app/share.tsx:14` |
| `EnhancedToggleImage`, renders the drawing (or its enhanced version) in both the on-screen preview and the export tree | `components/EnhancedToggleImage.tsx`, imported at `app/share.tsx:12` |
| `PaperSurface`, the canvas-card chrome around the preview image | `components/art/PaperSurface.tsx`, imported at `app/share.tsx:11` |
| `ScreenHeader` | `components/nav/ScreenHeader.tsx`, imported at `app/share.tsx:15` |
| `ViewShot`, the native/web capture wrapper around the export tree | `react-native-view-shot`, used at `app/share.tsx:594-616` |

`EnhancedToggleImage` appears twice on this one screen: once for the visible
preview and once inside the hidden export tree (`app/share.tsx:539-546`,
`:606-613`), each with its own `testID`. Both read the same `imageRef`, so the
placeholder problem noted above shows up in both places at once.

## Notes for planning

Authored here, not read out of the app.

### Two of four share targets are stubs, not features

"Instagram" and "More" are unlabeled no-ops behind a code comment
(`app/share.tsx:503-520`). They are visually indistinguishable from "Share"
and "Copy link". This is the finding to flag before anyone demos this screen:
a person will tap a live-looking button and get silence. For a POC that is a
defensible corner to cut, but it should not ship un-flagged to a client walk-
through without a caveat, and the fix is cheap: either grey them out or add a
"coming soon" toast.

### The share card is a genuinely engineered feature, not a stub

The dispatch path (`app/share.tsx:349-456`) captures a branded PNG on both
web (html2canvas with a manual scale fix, `app/share.tsx:375`, and a
real-height stabilizer, `app/share.tsx:104-130`) and native
(`react-native-view-shot`), with a
documented module-level dedup guard for a specific double-dispatch bug seen on
web (`app/share.tsx:54-78`). This is the most heavily commented file read in
this pass. The "Share" and "Copy link" tiles are real; only the other two are
stubbed. Worth saying plainly so the stub finding above does not read as "the
whole screen is fake."

### The wrong-drawing bug traced in F2 reaches this screen too

The capture shows the same sun-glyph placeholder as `/onboarding/story`
(see F2's note 2), on the response's actual `imageRef`, not a seeded draft.
Two independent-looking screens showing the same wrong image from the same
param name is a signal this is one bug with two symptoms, not two bugs. Not
diagnosed here; flagging so whoever picks up F2's note 2 checks this screen
in the same pass.
