/* ============================================================
   data.js
   ------------------------------------------------------------
   This is the ONLY place you should need to touch to add,
   remove, or edit a project or a track. Everything else
   (the portfolio cards, the filter buttons, and the music
   player) is generated automatically from this array in
   script.js.

   HOW TO ADD A NEW PROJECT
   ------------------------------------------------------------
   Copy one of the objects below, give it a unique "id", and
   fill in the fields. If it's a single with one song, give it
   just one entry in "tracks". If it's a game/soundtrack with
   several songs, list them all in "tracks" in the order you
   want them to appear.

   FIELDS
   ------------------------------------------------------------
   id          - unique slug, no spaces (used internally)
   title       - project name shown as the heading
   link        - URL the title links to (game page, Spotify, etc.)
                 leave as "" if you don't have one yet -- the title
                 just renders as plain (non-clickable) text instead
   linkLabel   - hover tooltip text for the title link (ignored if
                 link is empty)
   icon        - path to the project thumbnail image
   genres      - array of tags, e.g. ["chiptune"], ["orchestral"]
                 used to build the genre filter buttons automatically
   category    - what kind of project this is. Suggested values:
                   "Game Jam"  - made for a game jam
                   "Full Game" - a complete, released game (e.g. Dear Clarent)
                   "Game OST"  - a game soundtrack that isn't a jam entry
                                 or a full game you personally shipped
                   "Film"      - music made for a film/video
                   "Release"   - standalone music not tied to a game --
                                 singles, EPs, albums, whatever
                 This isn't a fixed list -- any string works (e.g. "Misc")
                 and a filter button appears for it automatically, same
                 as genres.
   jamName     - if category is "Game Jam", the jam's name (e.g. "GMTK 2024")
                 shown next to the category tag. null (not the text
                 "Null") otherwise.
   year        - release year (number) or null if unknown/TBD
   description - short blurb shown under the title
   audioPath   - folder that all this project's audio files live in
   theme       - OPTIONAL. Recolors the player bar while one of this
                 project's tracks is playing, to match its vibe. Leave
                 the whole field out for the normal site colors.
                   theme: { background: "#1a1a1a", accent: "#EDE0C8" }
                 "background" is the player bar's fill color, "accent"
                 is used for the song title, seek/volume fill, and
                 slider handle. There's also an optional "border" for
                 the top edge of the bar -- if you don't set one it
                 just uses "accent". Pick whichever of your two colors
                 is LIGHTER for "accent" (it's the text color, needs
                 to stay readable). Fades back to normal automatically
                 when a track without a theme starts playing.
   tracks      - array of { title, file, description }
                 "file" is just the filename inside audioPath

   Not ready to publish a project yet (missing audio/images)? Just
   wrap the whole object in a comment block, like cubase-misc-2026
   and minutes-to-meltdown below -- it'll be skipped entirely until
   you uncomment it.
   ============================================================ */

const projects = [
  {
    id: "spinning-records-inc",
    title: "Spinning Records Inc. (Official Soundtrack)",
    link: "https://killacook93.itch.io/spinning-records-inc",
    linkLabel: "Play the game!!",
    icon: "media/spinning-records-inc.png",
    genres: ["chiptune"],
    category: "Game Jam",
    jamName: "The Very Serious Juniper Dev Game Jam",
    year: 2026,
    description:
      "Submission to The Very Serious Juniper Dev Game Jam. This concept was you own a vinyl decorating shop, and you fullfill requests for customers, and as such you need a lot of different vinyl music tracks for the immersion. Btw we placed #6 in audio out of 3500+ games.",
    audioPath: "audio/spinning-records-inc/",
    theme: { background: "#3B2A1F", accent: "#5FD9C4" }, // dark brown + aquamarine, vinyl-shop vibe
    tracks: [
      {
        title: "Rock A",
        file: "vinyl_jam_rock_1.ogg",
        description: ""
      },
      {
        title: "Rock B",
        file: "vinyl_jam_rock_2.ogg",
        description: ""
      },
      {
        title: "Classical A",
        file: "vinyl_jam_classical_1.ogg",
        description: ""
      },
      {
        title: "Classical B",
        file: "vinyl_jam_classical_2.ogg",
        description: ""
      },
      {
        title: "Jazz A",
        file: "vinyl_jam_jazz_1.ogg",
        description: ""
      }
    ]
  },

  /*{
    id: "cubase-misc-2026",
    title: "Miscellanious Cinematic Music 2026",
    link: "",
    linkLabel: "",
    icon: "media/cubase-misc-2026.png",
    genres: ["cinematic"],
    category: "Misc",
    jamName: null,
    year: 2026,
    description:
      "I bought a new music program, Cubase, in 2026 and have been messing around with it to make music.",
    audioPath: "audio/cubase-misc-2026/",
    tracks: [
      {
        title: "Insert Cool Song Here",
        file: "song.mp3",
        description: "I'll upload all of this later probably"
      }
    ]
  },*/

  {
    id: "solar-drift",
    title: "Solar Drift (Official Soundtrack)",
    link: "https://killacook93.itch.io/solar-drift",
    linkLabel: "Play the game!!",
    icon: "media/solar-drift.png",
    genres: ["chiptune"],
    category: "Game Jam",
    jamName: "Brackeys Jam",
    year: 2025,
    description:
      "Submission to Novice Summer Jam Series 2025, you fly through space, hiding from the sun behind asteroids to prevent your ship from overheating. If it seems hard at first, it's because you havn't bought some of the various upgrades from the shop!!",
    audioPath: "audio/solar-drift/",
    theme: { background: "#0A0E24", accent: "#E0475F" }, // dark navy + crimson
    tracks: [
      {
        title: "Meteor Shower",
        file: "meteor-shower.mp3",
        description: "Main Menu theme"
      },
      {
        title: "Asteroid Shooter",
        file: "astroid-shooter.mp3",
        description: "The main gameplay theme, it's meant to capture the fast-paced gameplay, and it's sort of on homage to old NES-era games."
      },
      {
        title: "Breath of Space Air",
        file: "breath-of-space-air.mp3",
        description: "This is when you have a break from the action and get to shop for some upgrades!"
      }
    ]
  },

  /*{
    id: "minutes-to-meltdown",
    title: "Minutes to Meltdown (Official Soundtrack)",
    link: "https://jaidentfs.itch.io/minutes-to-meltdown",
    linkLabel: "Play the game!!",
    icon: "media/minutes-to-meltdown.png",
    genres: ["cinematic"],
    category: "Game Jam",
    jamName: "Brackeys Jam",
    year: 2025,
    description:
      "Created for the Brackey's game jam, you traverse through a nuclear reactor making sure all systems are still working, while avoiding a mutated beast. As part of this, I worked with the programmer to make one track that changes depending on what is happening in game.",
    audioPath: "audio/minutes-to-meltdown/",
    tracks: [
      {
        title: "Main Theme",
        file: "main-theme.mp3",         // what plays by default
        description:
          'The main theme for "Minutes to Meltdown." ' +
          "When close enough to the enemy, drums will play to amplify the intensity of that moment. " +
          "While doing mini games there would be a slight variation to the main theme with different melodies.",
        interactive: {
          mainLabel: "Main",             // label for the default button (optional, defaults to "Main")
          variations: [
            // each needs its own audio file, same folder (audioPath above),
            // ideally the same length/tempo so a loopable layer stays lined up
            { label: "Tunnel", file: "tunnel-variation.mp3" },
            { label: "Mini Games", file: "mini-game-variation.mp3" }
          ],
          layer: {
            // optional -- omit this whole "layer" key if you don't want
            // a toggleable instrument layer on this track
            label: "Enemy Drums",
            file: "enemy-drums-layer.mp3"
          }
        }
      }
    ]
  },*/

  {
    id: "kindled-core",
    title: "Kindled Core (Official Soundtrack)",
    link: "https://obliosworld.itch.io/kindled-core",
    linkLabel: "Play the game!!",
    icon: "media/kindled-core.png",
    genres: ["chiptune"],
    category: "Game Jam",
    jamName: "1-Bit Jam",
    year: 2025,
    description:
      "Created for the 1-Bit game jam. It is a top-down arena styled game where you charge really large attacks with your growing sword in order to decimate enemies on screen.",
    audioPath: "audio/kindled-core/",
    theme: { background: "#1a1a1a", accent: "#EDE0C8" }, // matches the 1-bit jam's dark/cream look
    tracks: [
      {
        title: "Intro Theme",
        file: "intro-theme.mp3",
        description: 'The Main Menu theme for the game: "Kindled Core"'
      },
      {
        title: "The Hollow Winter",
        file: "hollow-winter.mp3",
        description:
          "A theme accompanying the introduction monologue. Starting with a light-hearted waltz and turning unsettling as the story gets told. It has a leitmotif from the sadly unused boss theme."
      },
      {
        title: "House Theme",
        file: "house-theme.mp3",
        description:
          "After waking up, you're home. But you're not alone, and the cold morning air is starting to affect you."
      },
      {
        title: "City Theme",
        file: "city-theme.mp3",
        description:
          "This theme is supposed to emulate the cold and dark winter in this isolating world. In your search for food you find yourself trapped in a maze of buildings outside. The wind blows strong and the creatures get faster and scarier."
      },
      {
        title: "Amanita's Wrath",
        file: "amanitas-wrath.wav",
        description:
          "A scrapped boss theme for the end of the game, sadly we didn't have time to implement the boss fight between the main character and the witch who cause this whole mess, amanita!! It's okay because you can listen to it here."
      }
    ]
  },

  {
    id: "haunted-house",
    title: "Haunted House",
    link: "https://open.spotify.com/album/12nSM7gKCUaJKXMuFVejiz",
    linkLabel: "Listen on Spotify!!",
    icon: "media/haunted-house.png",
    genres: ["chiptune"],
    category: "Release",
    jamName: null,
    year: 2024,
    description: "Chiptune-Esque single posted on Spotify and other streaming services.",
    audioPath: "audio/starburn/",
    tracks: [
      {
        title: "Haunted House",
        file: "haunted-house.mp3",
        description:
          "Haunted House is a remake of a song from my first album that I made in 2023. It is supposed to have a spooky vibe with instruments to convey the hauntedness of it. This reworked version has a lot more dynamic contrast, as well as better sound mixing."
      }
    ]
  },

  {
    id: "little-guy-big-sword",
    title: "Little Guy, Big Sword (Official Soundtrack)",
    link: "https://fredder.itch.io/little-guy-big-sword",
    linkLabel: "Play the game!!",
    icon: "media/little-guy-big-sword.jpg",
    genres: ["chiptune"],
    category: "Game Jam",
    jamName: "GMTK 2024",
    year: 2024,
    description:
      "Submission for the 2024 GMTK game jam. It is a top-down arena styled game where you charge really large attacks with your growing sword in order to decimate enemies on screen.",
    audioPath: "audio/little-guy-big-sword/",
    tracks: [
      {
        title: "Journey Start (Intro Theme)",
        file: "journey-start.mp3",
        description: 'The Main Menu theme for the game: "Little Guy, Big Sword"'
      },
      {
        title: "Into the Pit (Battle Theme)",
        file: "into-the-pit.mp3",
        description: "The theme when you start the game. It's meant to be exciting, ear-catching, and replayable."
      },
      {
        title: "Second Chances (Death Theme)",
        file: "second-chances.mp3",
        description:
          "When you take too much damage you'll hear this slower, almost bittersweet composition. You may have lost, but you can always try again."
      },
      {
        title: "Waiting Arena (Pause Theme)",
        file: "waiting-arena.mp3",
        description: "Almost a sort of elevator music showing that you aren't in play anymore."
      },
      {
        title: "The Rooster (Boss Theme)",
        file: "the-rooster.mp3",
        description:
          "The boss is threatening, and the music should represent that. The theme that plays keeps you nervous and unsettled while you fight the final fight."
      },
      {
        title: "You Did It!! (Win Theme)",
        file: "you-did-it.mp3",
        description:
          "High tempo and fun theme to reward you for winning, and to thank you for playing. The final chord progression is a nice final sound to show that you've completed the game."
      }
    ]
  },

  {
    id: "dear-clarent",
    title: "Seawright Line Songbook",
    link: "https://dearclarent.com/#slsongbook",
    linkLabel: "Play the game!!",
    icon: "media/dear-clarent-songbook.png",
    genres: ["orchestral"],
    category: "Full Game",
    jamName: null,
    year: 2024,
    description:
      'Orchestral music made for the Dear Clarent Rpg. The game is about a ship based on the Titanic that sunk due to unknown causes, and the mysterious cover story that happened shortly after. The songbook tells the story of two people from the 1920s who fall in love, but ultimately realizing their relationship isn\'t what it used to be. Each instrument relates to a different in-game character: the piano represents Isodore, the cello represents his father, and the violin represents Phoebe.',
    audioPath: "audio/",
    theme: { background: "#211C14", accent: "#E8DCC0" }, // ink background, old-paper text
    tracks: [
      {
        title: "Ruckkehrunruhe",
        file: "Seawright Line Songbook Audio Mixing - 4-rückkehrunruhe.wav (1).wav",
        description:
          "This is about the main character, Isodore, being pressured by his father into inheriting his company. His father is also hesitant because Isodore wants to marry a girl, Phoebe. Towards the end of the song the \"Proposal\" waltz melody was referenced in the song."
      },
      {
        title: "Birth and Beloiter",
        file: "Seawright Line Songbook Audio Mixing - 9-birth-and-beloiter.wav (1).wav",
        description:
          "Towards the beginning of the song, Phoebe is thinking about her simple life at home with her 3 kids. However, she also feels her longing to return to her old life as an opera singer. Halfway through, the music is supposed to represent Phoebe and Isodore getting into a fight. Isodore is never home and Phoebe wants more out of her life."
      },
      {
        title: "Enoument",
        file: "Seawright Line Songbook Audio Mixing - 10-énoument.wav (1).wav",
        description:
          "Enoument: \"It's you worrying about the future or the outcome of something but you look back and realise you're living in the said future. You wish you could tell your past self to not worry so much but sadly, you can't.\" This song represents both Phoebe and Isodore acknowledging that their life could have been better, and it could have been worse, but that they are happy with what they have in the present."
      }
    ]
  },

  {
    id: "attack-on-saturn",
    title: "Attack On Saturn",
    link: "https://open.spotify.com/album/7hTEt49WhQyVw3OXxY1zyy",
    linkLabel: "Play the game!!",
    icon: "media/attack-on-saturn.png",
    genres: ["chiptune"],
    category: "Release",
    jamName: null,
    year: 2024,
    description: "Chiptune-Esque single posted on Spotify and other streaming services.",
    audioPath: "audio/starburn/",
    tracks: [
      {
        title: "Attack On Saturn",
        file: "attack-on-saturn.wav",
        description:
          "Attack On Saturn is a chiptune-styled piece of music made for a now-discontinued game. It is meant to be a battle theme that would loop as you fought enemies left and right."
      }
    ]
  }

  /* Example of a "Film" project -- copy this in and fill it out
     whenever you have one, the "Film" filter button will appear
     on its own once a project uses it:

  ,{
    id: "some-film",
    title: "Some Film Title",
    link: "https://example.com/watch",
    linkLabel: "Watch the film!!",
    icon: "media/some-film.png",
    genres: ["orchestral"],
    category: "Film",
    jamName: null,
    year: 2026,
    description: "Score written for [film name].",
    audioPath: "audio/some-film/",
    tracks: [
      { title: "Main Theme", file: "main-theme.mp3", description: "..." }
    ]
  }
  */
];
