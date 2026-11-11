# Wedding Invitation: Website + Cinematic Video

Both are built from one file: **`config.js`**.

```
config.js          ← names, date, events, venue, RSVP number, photos, music
index.html         ← the invitation website
haldi.html         ← themed event pages (pastel carnival / neon dance night /
sangeet.html          maroon-and-gold mandap)
wedding.html
site/              ← website styles + animation (event.css/event.js = event pages)
site/art/          ← the couple illustrations for each celebration
shared/            ← themed decorations + calendar link used by every page
video/             ← Video Studio (renders the cinematic video in your browser)
photos/            ← your real photos go here
clips/             ← AI-animated clips (optional, see AI_GUIDE.md)
music/theme.mp3    ← background music (optional)
AI_GUIDE.md        ← how to use AI to animate photos and make music
```

## Run it

```bash
cd ~/priya/wedding
python3 -m http.server 8000
```

- Website: http://localhost:8000. Add `#open` to the URL to skip the door animation while editing.
- Event pages: http://localhost:8000/haldi.html, /sangeet.html, /wedding.html (also linked from the Celebrations cards).
- Video Studio: http://localhost:8000/video/. Add `?t=12` to jump to a frame.

Use a local server like the one above rather than double-clicking `index.html`, because browsers block video recording from `file://` pages.

## Steps

1. **Details:** edit `config.js` with your names, dates, events, venue, WhatsApp number and hashtag.
2. **Photos:** prepare them and drop them in `photos/` (see AI_GUIDE.md §1). Until you do, gradient placeholders show the file name each slot expects.
3. **AI clips:** animate 2–3 hero photos with Kling, Veo or Runway, and put the clips in `clips/` (AI_GUIDE.md §2).
4. **Music:** save it as `music/theme.mp3`.
5. **Video:** open the Video Studio, choose a format, then click **Record & Download**. Recording runs in real time (about 40 s), so keep the tab visible. Chrome saves MP4.
6. **Website:** publish it for free:
   - **Netlify Drop**: drag the `wedding` folder onto app.netlify.com/drop. You get a link in seconds.
   - Or GitHub Pages / Vercel. Buy a domain like `priya-weds-aarav.com` if you want a custom link.
7. **Link preview:** after publishing, change `og:image` in `index.html` to the full URL (for example `https://your-site.netlify.app/photos/hero.jpg`) so WhatsApp shows a photo preview.
8. **Share:** post the video on Reels, Status or in family groups, with the website link for details and RSVP.

## Celebrations & event pages

On the invitation, each celebration in `config.js` → `events` gets its own full-screen chapter with its illustration (`art`), themed background and animations, after a "Wedding Weekend" timeline. Each event also has its own page (`page`) with a countdown, "what to expect", dress code, Add to Calendar and RSVP.

- Edit the text in `config.js`: `tagline`, `about`, `expect`, `dress`, `palette`, and the `faq` list for the "Good to Know" section.
- To swap an illustration, replace the file in `site/art/` (keep the name) or point `art` at a new file.

## What's included

**Website:** door-opening gate with a wax-seal monogram, then a hero with slow zoom, letterbox bars, blur-in gold names and background music. Below that come a live countdown, a story timeline with photo reveals, a pinned horizontal gallery, a Wedding Weekend timeline, a themed chapter for each celebration, a map with directions, Good to Know FAQs, a hashtag to copy, and an RSVP that sends a WhatsApp message (no server needed). Falling petals throughout. Works on mobile and respects reduced-motion settings.

**Video (about 38 s):** gold-dust opening, names over the hero shot, story shots with captions, a "Save the Date" card, the list of celebrations, and a hashtag close. It uses Ken Burns moves, crossfades, film grain and vignette, and exports in 9:16, 16:9 or 1:1.
