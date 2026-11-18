# Infinity HI-FI · Wave Studio (local-first prototype)

This is a bounded implementation of the existing Infinity HI-FI architecture (README.md). It is not a new audio platform or an alternate Solidify database.

## Working source
- lab/index.html: browser user-selected local audio, Android-readable controls, waveform, RMS/peak/spectral-bin observations.
- lab/signal-core.mjs: measured PCM RMS/sample peaks and reversible audio profiles. Original is dry pass-through; processed modes use Web Audio filter and compression.
- lab/wave-core.mjs: validated branching blips, bounded JSON import and draft-only candidate envelope.
- lab/studio.mjs: user-initiated audio playback, textContent for untrusted notebook content, explicit JSON export, no microphone or file upload.
- test/studio-core.test.mjs and test/studio-source.test.mjs: Node v22 behavioral and privacy source checks.

## Verify
Run:
- node --test test/studio-core.test.mjs test/studio-source.test.mjs
- node --check lab/signal-core.mjs
- node --check lab/wave-core.mjs
- node --check lab/studio.mjs

Serve with HTTPS or localhost static server. Select your own audio file, Play, change profiles, add parent-linked blips, export JSON, and verify no network requests by this app.

## Explicit non-features / gates
- Not yet Yjs collaboration, remote rooms, identity, a signed agent executor or an IndexedDB outbox.
- Not generative media or actual noise cancellation. No model subscription, external API, microphone or audio capture.
- Web Audio RMS/peak metrics are not ITU loudness measurements, true-peak oversampling or production mastering.
- No release was deployed merely by committing files or passing local tests.
- The separate unverified matter-assembly proposal is not an established DNA production method and requires separate nonhazardous research review; no radioactive/gas/high-voltage controls are integrated.
- All actual release steps require exact-head CI, independent review, authorized merge, site readback and real Android/playback acceptance.

Track V1 using Infinity-HiFi issue #2. This candidate export is not a Solidify promotion.
