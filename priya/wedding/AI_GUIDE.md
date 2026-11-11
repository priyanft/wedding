# AI workflow: bring your real photos to life

The code handles layout, typography, timing, transitions and the website. AI handles the parts code can't do well: making still photos *move*, cleaning up images, and creating music.

```
 Real photos ──► 1. Clean & upscale (AI) ──► 2. Animate photos (AI image-to-video)
                                                     │
 Music (AI or licensed) ─────────────────────────────┤
                                                     ▼
                         3. config.js ──► Video Studio (code) ──► final .mp4
                                     └──► Website (code)       ──► shareable link
```

---

## 1 · Choose and prepare photos

- Pick **8–12 photos**: 1 hero (best portrait), 3 for "Our Story", 6 for the gallery, and 4–5 for the video.
- Prefer **portrait (vertical)** photos for the hero and the video, and ones with space around faces so the zoom and pan don't crop heads.
- **Upscale and restore** older or phone photos: Upscayl (free, desktop), Topaz Photo AI, or Magnific.
- **Remove distractions** (strangers, signboards): Google Photos Magic Editor, Photoshop Generative Fill, or Canva Magic Eraser.
- **Make the colours match**: apply the same warm or film preset to every photo in Lightroom (free mobile app) so the edit feels cinematic.
- Export as JPG, about 1600 px on the long side, under 500 KB each (squoosh.app works well), so the website loads fast.

Save them into `photos/` with the names used in `config.js` (`hero.jpg`, `g1.jpg`, …, `s1.jpg`, …).

## 2 · Animate photos with AI image-to-video (the "cinematic" part)

Upload a still photo and the tool returns a 5–10 second clip with real motion: hair moving, a dupatta flowing, a slow dolly-in, candles flickering.

| Tool | Good at |
|---|---|
| **Kling AI** | Natural movement of people; keeps faces closest to the original |
| **Google Veo** (in Gemini / Flow) | Very cinematic camera moves and lighting |
| **Runway** (Gen-4) | Precise camera control and consistent style |
| **Hailuo (MiniMax)**, **Luma Dream Machine** | Good free tiers for experimenting |

Tools change quickly, so try 2 of them on your hero photo and keep whichever preserves your faces best.

**Settings:** 9:16 aspect, 5 s, 1080p if offered, and the *lowest* motion strength. Strong motion distorts faces.

**Prompts.** Describe only *motion and camera*, never the people's appearance, because the photo already defines that:

- Hero: `Slow cinematic dolly-in, the couple gently smile at each other, soft wind moves her dupatta and hair, warm golden-hour light, shallow depth of field, film grain. Subtle natural motion, faces unchanged.`
- Walking shot: `Smooth tracking shot following the couple, gentle breeze, rose petals drifting through the air, warm evening light, cinematic.`
- Close-up / hands: `Extreme slow motion, soft focus pull from the mehendi hands to the rings, bokeh fairy lights twinkling in the background.`
- Venue / decor: `Slow aerial push-in, diyas and candles flicker, light mist over the water, magical twilight atmosphere.`
- Negative prompt (if supported): `face distortion, extra fingers, morphing, warping, text, watermark`

Generate 3–4 versions of each shot and keep the best. Download them as MP4.

### Plug the clips into the code

1. Save the clips in `clips/` (for example `clips/hero.mp4`).
2. In `config.js`, swap a photo for the clip in `video.shots`:
   ```js
   shots: [
     { src: "clips/hero.mp4", line: "" },          // AI-animated
     { src: "photos/g1.jpg",  line: "Two hearts" },// still photo with Ken Burns
     ...
   ]
   ```
3. Open the Video Studio and click **Record**. The code adds the names, gold text, letterbox bars, crossfades, film grain and music over your AI clips.

Mixing **2–3 AI clips** with still photos (which the code animates with slow zoom and pan) looks more cinematic and more "real" than making every shot AI.

## 3 · Music

- **AI-made song with your names:** Suno or Udio. Example prompt:
  `Romantic Indian wedding instrumental, soft shehnai and sitar over piano and strings, slow build, cinematic, 45 seconds`
- **Licensed track:** Instagram and YouTube may mute copyrighted film songs. Royalty-free sources: YouTube Audio Library, Pixabay Music.
- Save the file as `music/theme.mp3`. The website uses it as background music and the video records it in.
- The video is about 38 seconds long (more with extra shots), so trim the song to start at its best moment.

## 4 · Optional extras

- **Wording:** ask Claude to write the invitation text, story captions and event descriptions in English, Hindi or Gujarati, then paste them into `config.js`.
- **Voice-over:** a short "Join us…" line in your own voice reads warmer than an AI voice. Record it on your phone.
- **Final polish:** to add sound effects or a voice-over track, import the exported MP4 into CapCut and add them there. The visuals are already finished.

## Privacy note

Read each AI tool's terms before uploading photos of yourselves and your family, since some use uploads for training. Prefer tools with an opt-out, and only upload photos of guests with their permission.
