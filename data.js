/* ============================================================
   data.js
   ------------------------------------------------------------
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
   linkLabel   - hover tooltip text for the title link
   icon        - path to the project thumbnail image
   genres      - array of tags, e.g. ["chiptune"], ["orchestral"]
                 used to build the genre filter buttons automatically
   category    - what kind of project this is. Pick ONE of:
                   "Game Jam"  - made for a game jam
                   "Full Game" - a complete, released game (e.g. Dear Clarent)
                   "Game OST"  - a game soundtrack that isn't a jam entry
                                 or a full game you personally shipped
                   "Film"      - music made for a film/video
                   "Release"   - standalone music not tied to a game --
                                 singles, EPs, albums, whatever
                 This builds the category filter buttons automatically,
                 same as genres -- add a project with a new category
                 (e.g. "Film") and a button for it appears on its own.
   jamName     - if category is "Game Jam", the jam's name (e.g. "GMTK 2024")
                 shown next to the category tag. null otherwise.
   year        - release year (number) or null if unknown/TBD
   description - short blurb shown under the title
   audioPath   - folder that all this project's audio files live in
   tracks      - array of { title, file, description }
                 "file" is just the filename inside audioPath
   ============================================================ */

const projects = [
  {
    id: "haunted-house",
    title: "Haunted House",
    link: "https://open.spotify.com/album/12nSM7gKCUaJKXMuFVejiz",
    linkLabel: "Listen on Spotify!!",
    icon: "media/haunted-house.png",
    genres: ["chiptune"],
    category: "Release",
    jamName: null,
    year: null, // TODO: fill in release year
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
    id: "kindled-core",
    title: "Kindled Core (Official Soundtrack)",
    link: "https://obliosworld.itch.io/kindled-core",
    linkLabel: "Play the game!!",
    icon: "media/kindled-core.png",
    genres: ["chiptune"],
    category: "Game Jam",
    jamName: "1-Bit Jam",
    year: null, // TODO: fill in release year
    description:
      "Created for the 1-Bit game jam. It is a top-down arena styled game where you charge really large attacks with your growing sword in order to decimate enemies on screen.",
    audioPath: "audio/kindled-core/",
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
    year: null, // TODO: fill in release year
    description:
      'Orchestral music made for the Dear Clarent Rpg. The game is about a ship based on the Titanic that sunk due to unknown causes, and the mysterious cover story that happened shortly after. The songbook tells the story of two people from the 1920s who fall in love, but ultimately realizing their relationship isn\'t what it used to be. Each instrument relates to a different in-game character: the piano represents Isodore, the cello represents his father, and the violin represents Phoebe.',
    audioPath: "audio/",
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
    year: null, // TODO: fill in release year
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
