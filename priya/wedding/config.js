// ─────────────────────────────────────────────────────────────
//  ONE FILE TO EDIT. Both the website and the video read from here.
// ─────────────────────────────────────────────────────────────
window.WEDDING = {
  bride: "Priya",
  groom: "Devang",
  hashtag: "#PriyaWedsDevang",
  intro: "Together with their families",
  invite: "joyfully invite you to celebrate their wedding",

  // Used for the countdown (include your timezone offset)
  // TODO: set the real muhurat time; 7:00 PM is a placeholder
  date: "2026-12-12T19:00:00+05:30",
  dateText: "Saturday · 12 December 2026",
  city: "Zundal, Ahmedabad",

  // Web-sized copies of your photos (originals are kept in /photos untouched)
  photos: {
    hero: "photos/hero.jpg",
    // only photos not already shown in the hero or Our Story
    gallery: ["photos/g1.jpg", "photos/m-bridge.jpg", "photos/g2.jpg"],
  },

  story: [
    { when: "THE BEGINNING", title: "Where It All Began", text: "Sunshine, a long drive and two smiles. That's where our story started.", photo: "photos/s2021.jpg" },
    { when: "TOGETHER",      title: "Every Little Moment", text: "In laughter and in quiet moments, we found our favourite person.", photo: "photos/s-sofa.jpg" },
    { when: "FOREVER",       title: "Forever Begins", text: "And now, we'd love for you to be there as we begin our forever.", photo: "photos/g3.jpg" },
  ],

  // Each event gets its own themed page (haldi.html, sangeet.html, wedding.html).
  // `start` drives that page's countdown and the "Add to calendar" button.
  // TODO: confirm the Haldi and Sangeet dates/times; these are placeholders
  events: [
    {
      name: "Haldi", slug: "haldi", page: "haldi.html", art: "site/art/haldi.jpg",
      when: "11 Dec 2026", time: "10:00 AM", start: "2026-12-11T10:00:00+05:30", hours: 3,
      place: "Raghav Farm & Party Plot",
      dress: "Pastel yellows, mint & peach",
      palette: ["#FFE89A", "#FFD2B8", "#C9EFDC", "#E6D7FF", "#FFFFFF"],
      tagline: "A pastel carnival of sunshine & turmeric",
      about: "Come dressed in soft sunshine colours, bring your brightest smile, and help us glow before the big day. Expect turmeric, giggles, flower showers and a little bit of mess.",
      expect: [
        { icon: "🌼", title: "Haldi Rasam", text: "Family blesses the couple with turmeric paste for that wedding glow." },
        { icon: "🎪", title: "Carnival Corner", text: "Ring toss, photo booth and pastel candy floss for every age." },
        { icon: "🌸", title: "Phoolon ki Holi", text: "A shower of marigold and rose petals. Wear clothes you love to get messy in." },
        // { icon: "🥭", title: "Brunch & Aam Panna", text: "Chaat counters, fresh juices and something sweet." },
      ],
    },
    {
      name: "Sangeet", slug: "sangeet", page: "sangeet.html", art: "site/art/sangeet.jpg",
      when: "11 Dec 2026", time: "7:30 PM", start: "2026-12-11T19:30:00+05:30", hours: 4,
      place: "Raghav Farm & Party Plot",
      dress: "Glam & sparkle: sequins, velvet, jewel tones",
      palette: ["#2A0F4F", "#7B2FBE", "#FF3D9A", "#FFC94A", "#C0C0D8"],
      tagline: "One night. Two families. Zero chill on the dance floor.",
      about: "Lights down, music up. Both families have been rehearsing in secret, so come ready to cheer, sing along, and dance until your feet give up.",
      expect: [
        { icon: "💃", title: "Family Face-off", text: "Bride's side vs Groom's side choreographed performances." },
        // { icon: "🎤", title: "Open Mic & Antakshari", text: "Old Bollywood classics. Everyone sings, nobody judges." },
        { icon: "🥁", title: "Dhol & DJ", text: "Live dhol into a DJ set that runs late." },
        { icon: "✨", title: "Couple's Surprise", text: "We have a little performance of our own. Don't miss it." },
      ],
    },
    {
      name: "Wedding", slug: "wedding", page: "wedding.html", art: "site/art/wedding.jpg",
      when: "12 Dec 2026", time: "7:00 PM", start: "2026-12-12T19:00:00+05:30", hours: 5,
      place: "Raghav Farm & Party Plot",
      dress: "Traditional: reds, golds & ivory",
      palette: ["#7A0F1E", "#B3132B", "#C9A35B", "#F0D79C", "#F7EFE4"],
      tagline: "Under the mandap, with all of you beside us",
      about: "The moment everything has led to. Join us for the baraat, the varmala and the seven pheras as we promise each other forever, followed by dinner under the stars.",
      expect: [
        { icon: "🐎", title: "Baraat", text: "The groom's procession arrives with dhol, dancing and fireworks." },
        { icon: "💐", title: "Varmala", text: "Garlands are exchanged. Place your bets on who gets lifted higher." },
        { icon: "🔥", title: "Saat Phere", text: "Seven rounds around the sacred fire, seven promises for life." },
        { icon: "🍽️", title: "Wedding Dinner", text: "A grand feast of flavours from every corner to end the night in celebration." },
      ],
    },
  ],

  // "Good to Know" questions on the invitation.
  // TODO: confirm parking and anything else specific to your venue
  faq: [
    { q: "When should I arrive?", a: "Around 30 minutes before each event, so you can settle in and not miss a moment." },
    { q: "What will the weather be like?", a: "December evenings around Ahmedabad get cool, around 13–15 °C at night. Bring a shawl or light jacket for the Sangeet and the Wedding." },
    { q: "How do I get to the venue?", a: "Raghav Farm is in Zundal, roughly 25 minutes by car from Ahmedabad airport (AMD). Tap Get Directions in the Venue section for the route." },
    { q: "Is there parking?", a: "Yes, there is parking at the venue." },
    { q: "Will the Haldi be messy?", a: "A little! Turmeric and flower petals are part of the fun, so wear something you don't mind getting a bit yellow." },
    { q: "Can we post photos?", a: "Please do! Tag them with our hashtag so we can find every one of them." },
  ],

  venue: {
    name: "Raghav Farm & Party Plot",
    address: "Gujarat State Highway 41, opp. Divine Child International School, Zundal, Gandhinagar, Gujarat 382421",
    mapsUrl: "https://www.google.com/maps/dir//Raghav+Farm+and+Party+Plot,+4HQQ%2BV8M,+Gujarat+State+Highway+41,+GJ+SH+41,+opp.+Divine+Child+International+School,+near+Raghav+Farm+and+Party+Plot,+Zundal,+Gandhinagar,+Gujarat+382421/@23.117824,72.5745664,14z/data=!4m8!4m7!1m0!1m5!1m1!1s0x395e8384bcbc22b5:0xd92970c64361ab58!2m2!1d72.5878138!2d23.1407258?entry=ttu",
    mapEmbed: "https://maps.google.com/maps?q=23.1407258,72.5878138&z=15&output=embed",
  },

  rsvp: {
    whatsapp: "919999999999",   // TODO: your number: country code + number, no "+" or spaces
    deadline: "30 November 2026",
  },

  music: "music/theme.mp3",      // optional; leave the file out for silence
  website: "",                   // shown at the end of the video once the site is published

  // ── Video settings ────────────────────────────────────────
  video: {
    // Scenes use these in order. Any entry can be an AI-animated clip
    // (.mp4/.webm) from Kling/Veo/Runway; see AI_GUIDE.md.
    shots: [
      { src: "photos/hero.jpg", line: "" },
      { src: "photos/s2021.jpg", line: "Since 2021" },
      { src: "photos/g1.jpg",   line: "Two hearts" },
      { src: "photos/g2.jpg",   line: "One promise" },
      { src: "photos/g3.jpg",   line: "A lifetime together" },
    ],
  },
};
