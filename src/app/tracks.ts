export type ComposerId =
  | 'vivaldi'
  | 'bach'
  | 'handel'
  | 'beethoven'
  | 'mozart'
  | 'chopin'
  | 'liszt'
  | 'wagner'
  | 'tchaikovsky'
  | 'verdi'
  | 'puccini'
  | 'rachmaninoff'
  | 'schubert'
  | 'ravel'
  | 'debussy'
  | 'schoenberg';

export interface Composer {
  id: ComposerId;
  name: string;
  fullName: string;
  era: string;
  /** What to listen for when trying to recognize this composer. */
  hint: string;
  /** CSS colour used for the composer's chip/accent. */
  color: string;
}

export interface Track {
  id: string;
  title: string;
  composer: ComposerId;
  /** Recording / performer note, shown after answering. */
  performer: string;
  /** YouTube video id. */
  videoId: string;
  /** Approximate video length in seconds, used to pick random start points. */
  duration: number;
}

export const COMPOSERS: Composer[] = [
  {
    id: 'vivaldi',
    name: 'Vivaldi',
    fullName: 'Antonio Vivaldi',
    era: 'Baroque · Italy',
    hint: 'Bright string orchestra with a flashy solo violin, fast repeated notes and harpsichord underneath. Everything on the list is from The Four Seasons.',
    color: '#4caf7a',
  },
  {
    id: 'bach',
    name: 'Bach',
    fullName: 'Johann Sebastian Bach',
    era: 'Baroque · Germany',
    hint: 'Interweaving lines (counterpoint): several melodies at once chasing each other. Pipe organ, or calm strings over a steady walking bass.',
    color: '#5b8def',
  },
  {
    id: 'handel',
    name: 'Handel',
    fullName: 'George Frideric Handel',
    era: 'Baroque · Germany / England',
    hint: 'Grand and ceremonial: big choirs, trumpets and timpani (Zadok, Hallelujah). The Passacaglia is the odd one out, a dramatic piano piece.',
    color: '#d4a72c',
  },
  {
    id: 'beethoven',
    name: 'Beethoven',
    fullName: 'Ludwig van Beethoven',
    era: 'Classical to Romantic · Germany',
    hint: 'Dramatic contrasts and short punchy motifs repeated obsessively (da-da-da-DUM). Ode to Joy is the big sing-along tune from the 9th Symphony.',
    color: '#e0603f',
  },
  {
    id: 'mozart',
    name: 'Mozart',
    fullName: 'Wolfgang Amadeus Mozart',
    era: 'Classical · Austria',
    hint: 'Elegant, clean, balanced phrases that sound "polite" and tuneful. Also opera (Queen of the Night\'s high coloratura) and the Requiem: his Dies irae is fast, tight and driving, without Verdi\'s giant drum hits.',
    color: '#c45bd6',
  },
  {
    id: 'chopin',
    name: 'Chopin',
    fullName: 'Frédéric Chopin',
    era: 'Romantic · Poland',
    hint: 'Solo piano only. Singing, song-like melody with flexible tempo (rubato): waltzes and dreamy nocturnes. Poetic rather than showy.',
    color: '#2bb3b1',
  },
  {
    id: 'liszt',
    name: 'Liszt',
    fullName: 'Franz Liszt',
    era: 'Romantic · Hungary',
    hint: 'Solo piano fireworks: insanely fast runs, leaps, and glittering high repeated notes (La Campanella\'s "bell"). Hungarian Rhapsody starts slow and gloomy, then turns into a wild fast dance.',
    color: '#e5487a',
  },
  {
    id: 'wagner',
    name: 'Wagner',
    fullName: 'Richard Wagner',
    era: 'Romantic · Germany',
    hint: 'Massive orchestra with heavy, blazing brass. Ride of the Valkyries: whirling strings and woodwinds, then the famous galloping tune blasted out by horns and trombones.',
    color: '#a1887f',
  },
  {
    id: 'tchaikovsky',
    name: 'Tchaikovsky',
    fullName: 'Pyotr Ilyich Tchaikovsky',
    era: 'Romantic · Russia',
    hint: 'Lush, sweeping melodies and colourful ballet music. The Nutcracker March is light and toy-like; Swan Lake has the haunting oboe theme over trembling strings. June (Barcarolle) is a gentle, sad solo piano song, easy to mistake for Chopin.',
    color: '#7b6cf0',
  },
  {
    id: 'verdi',
    name: 'Verdi',
    fullName: 'Giuseppe Verdi',
    era: 'Romantic · Italy',
    hint: 'Italian opera composer, big and theatrical. His Requiem\'s Dies Irae is pure terror: huge bass drum blows, crashing full orchestra and a screaming choir. Much louder and more violent than Mozart\'s.',
    color: '#c94a5a',
  },
  {
    id: 'puccini',
    name: 'Puccini',
    fullName: 'Giacomo Puccini',
    era: 'Late Romantic · Italy',
    hint: 'Italian opera: a solo tenor soaring over a lush orchestra, long emotional melodies that swell to a huge high climax. E lucevan le stelle opens with a sad clarinet solo; Nessun dorma builds to the famous "Vincerò!"',
    color: '#7fa83a',
  },
  {
    id: 'rachmaninoff',
    name: 'Rachmaninoff',
    fullName: 'Sergei Rachmaninoff',
    era: 'Late Romantic · Russia',
    hint: 'Vocalise is a song with no words: a soprano sings one long, slow, melancholy melody on "ah" over piano or orchestra. If a woman is singing and you can\'t hear any words, it\'s Rachmaninoff.',
    color: '#4f9fd1',
  },
  {
    id: 'schubert',
    name: 'Schubert',
    fullName: 'Franz Schubert',
    era: 'Early Romantic · Austria',
    hint: 'Gentle art song. Ave Maria is a slow, peaceful prayer over a softly rippling, harp-like accompaniment, and you can hear the words "Ave Maria". Pavarotti sings it too, but unlike his Puccini arias it stays calm and never builds to a huge climax.',
    color: '#d17a4f',
  },
  {
    id: 'ravel',
    name: 'Ravel',
    fullName: 'Maurice Ravel',
    era: 'Impressionist · France',
    hint: 'Boléro: one snare drum rhythm repeated nonstop from start to finish while the same Spanish-sounding melody passes from instrument to instrument, growing from almost silent to a huge, crashing ending.',
    color: '#2f8f5b',
  },
  {
    id: 'debussy',
    name: 'Debussy',
    fullName: 'Claude Debussy',
    era: 'Impressionist · France',
    hint: 'Dreamy, floating and hazy, with no strong beat. Clair de Lune on harp: soft, shimmering plucked notes, slow and moonlit. A harp playing alone with no singer is Debussy.',
    color: '#6c8cb8',
  },
  {
    id: 'schoenberg',
    name: 'Schoenberg',
    fullName: 'Arnold Schoenberg',
    era: 'Modern · Austria',
    hint: 'Atonal and unsettling: no clear key, a spiky small group (flute, clarinet, violin, cello, piano) and a woman half speaking, half singing in German (Sprechstimme). If it sounds creepy and "wrong", it\'s Schoenberg.',
    color: '#a35fa0',
  },
];

export const COMPOSER_BY_ID = Object.fromEntries(COMPOSERS.map((c) => [c.id, c])) as Record<
  ComposerId,
  Composer
>;

export const TRACKS: Track[] = [
  {
    id: 'vivaldi-spring',
    title: 'The Four Seasons: Spring, 1st movement',
    composer: 'vivaldi',
    performer: 'Classical Concert Chamber Orchestra',
    videoId: 'e3nSvIiBNFo',
    duration: 197,
  },
  {
    id: 'vivaldi-summer',
    title: 'The Four Seasons: Summer, 3rd movement',
    composer: 'vivaldi',
    performer: 'Nigel Kennedy',
    videoId: 'YuF4oYRktcA',
    duration: 208,
  },
  {
    id: 'vivaldi-winter',
    title: 'The Four Seasons: Winter, 1st movement',
    composer: 'vivaldi',
    performer: 'Cynthia Freivogel & Voices of Music',
    videoId: 'UWg5ugyMjIc',
    duration: 225,
  },
  {
    id: 'bach-toccata',
    title: 'Toccata and Fugue in D minor',
    composer: 'bach',
    performer: 'Liene Andreta Kalnciema, Riga Cathedral organ',
    videoId: 'erXG9vnN-GI',
    duration: 557,
  },
  {
    id: 'bach-double',
    title: 'Double Violin Concerto in D minor',
    composer: 'bach',
    performer: 'Sato & Deans, Netherlands Bach Society',
    videoId: 'ILKJcsET-NM',
    duration: 854,
  },
  {
    id: 'bach-air',
    title: 'Air on the G String',
    composer: 'bach',
    performer: 'Orchestral Suite No. 3',
    videoId: '1PkD47rNkfY',
    duration: 363,
  },
  {
    id: 'handel-zadok',
    title: 'Zadok the Priest',
    composer: 'handel',
    performer: 'The English Concert',
    videoId: '5xWhclVLQyI',
    duration: 374,
  },
  {
    id: 'handel-hallelujah',
    title: 'Hallelujah Chorus (Messiah)',
    composer: 'handel',
    performer: 'Royal Choral Society',
    videoId: 'IUZEtVbJT5c',
    duration: 263,
  },
  {
    id: 'handel-passacaglia',
    title: 'Passacaglia',
    composer: 'handel',
    performer: 'Relaxing piano version (arr. Halvorsen)',
    videoId: 'NoQiIslp0pw',
    duration: 192,
  },
  {
    id: 'beethoven-elise',
    title: 'Für Elise',
    composer: 'beethoven',
    performer: 'Piano',
    videoId: 'wfF0zHeU3Zs',
    duration: 175,
  },
  {
    id: 'beethoven-5',
    title: 'Symphony No. 5 in C minor, I. Allegro con brio',
    composer: 'beethoven',
    performer: 'Volumina Art & Media',
    videoId: 'niEV462i0RE',
    duration: 90,
  },
  {
    id: 'beethoven-ode',
    title: 'Ode to Joy (Symphony No. 9)',
    composer: 'beethoven',
    performer: 'Singalong Concert for Everyone, Young Euro Classic',
    videoId: 'ah-5wLaTwME',
    duration: 177,
  },
  {
    id: 'mozart-eine',
    title: 'Eine kleine Nachtmusik',
    composer: 'mozart',
    performer: 'String orchestra',
    videoId: 'oy2zDJPIgwc',
    duration: 348,
  },
  {
    id: 'mozart-40',
    title: 'Symphony No. 40 in G minor',
    composer: 'mozart',
    performer: 'Rattle · Berliner Philharmoniker',
    videoId: '0sGqkMU-mGQ',
    duration: 187,
  },
  {
    id: 'mozart-turkish',
    title: 'Turkish March (Rondo alla Turca)',
    composer: 'mozart',
    performer: 'Piano',
    videoId: 'aeEmGvm7kDk',
    duration: 212,
  },
  {
    id: 'mozart-dies-irae',
    title: 'Requiem: Dies irae',
    composer: 'mozart',
    performer: 'Claudio Abbado',
    videoId: '0T7eMctuJLQ',
    duration: 121,
  },
  {
    id: 'mozart-queen',
    title: 'The Magic Flute: Queen of the Night aria',
    composer: 'mozart',
    performer: 'Diana Damrau, The Royal Opera',
    videoId: 'YuBeBjqKSGQ',
    duration: 181,
  },
  {
    id: 'chopin-waltz-am',
    title: 'Waltz in A minor',
    composer: 'chopin',
    performer: 'Kassia',
    videoId: 'eN5z1mu6j4M',
    duration: 164,
  },
  {
    id: 'chopin-nocturne-19',
    title: 'Nocturne No. 19 in E minor',
    composer: 'chopin',
    performer: 'Kassia',
    videoId: 'i5XgcakgWf4',
    duration: 259,
  },
  {
    id: 'chopin-grande-valse',
    title: 'Grande Valse Brillante in E♭ major',
    composer: 'chopin',
    performer: 'Kassia',
    videoId: 'dJP0GtpgPrU',
    duration: 331,
  },
  {
    id: 'liszt-campanella',
    title: 'La Campanella in G♯ minor',
    composer: 'liszt',
    performer: 'Rousseau',
    videoId: 'H1Dvg2MxQn8',
    duration: 318,
  },
  {
    id: 'liszt-rhapsody-2',
    title: 'Hungarian Rhapsody No. 2',
    composer: 'liszt',
    performer: 'Valentina Lisitsa',
    videoId: 'LdH1hSWGFGU',
    duration: 586,
  },
  {
    id: 'wagner-valkyries',
    title: 'Ride of the Valkyries',
    composer: 'wagner',
    performer: 'London Symphony Orchestra, Yondani Butt',
    videoId: 'bsJDHukyefA',
    duration: 284,
  },
  {
    id: 'tchaikovsky-nutcracker-march',
    title: 'The Nutcracker: March',
    composer: 'tchaikovsky',
    performer: 'Simon Rattle, Berliner Philharmoniker',
    videoId: 'FG6G1VuTTzA',
    duration: 146,
  },
  {
    id: 'tchaikovsky-june',
    title: 'The Seasons: June (Barcarolle)',
    composer: 'tchaikovsky',
    performer: 'Mikhail Pletnev',
    videoId: 'qMDNiGM1IdY',
    duration: 325,
  },
  {
    id: 'tchaikovsky-swan-lake',
    title: 'Swan Lake, Act 2: No. 10, Scene (Moderato)',
    composer: 'tchaikovsky',
    performer: 'André Previn, London Symphony Orchestra',
    videoId: 'mkfRbCs15Jc',
    duration: 167,
  },
  {
    id: 'verdi-dies-irae',
    title: 'Requiem: Dies Irae',
    composer: 'verdi',
    performer: 'Carmen Giannattasio',
    videoId: 'bu3Q68qFths',
    duration: 135,
  },
  {
    id: 'puccini-lucevan',
    title: 'Tosca, Act 3: E lucevan le stelle',
    composer: 'puccini',
    performer: 'Luciano Pavarotti',
    videoId: 'Zw9vkxcw3vM',
    duration: 192,
  },
  {
    id: 'puccini-nessun-dorma',
    title: 'Turandot: Nessun dorma',
    composer: 'puccini',
    performer: 'Luciano Pavarotti',
    videoId: 'IDchaeJ-u6E',
    duration: 181,
  },
  {
    id: 'rachmaninoff-vocalise',
    title: 'Vocalise',
    composer: 'rachmaninoff',
    performer: 'Dilber (arr. Zhao Peiyi)',
    videoId: 'PplIUSwn31I',
    duration: 380,
  },
  {
    id: 'schubert-ave-maria',
    title: 'Ave Maria, D. 839',
    composer: 'schubert',
    performer: 'Luciano Pavarotti, National Philharmonic Orchestra',
    videoId: 'mAZ_lwJpY4M',
    duration: 290,
  },
  {
    id: 'ravel-bolero',
    title: 'Boléro',
    composer: 'ravel',
    performer: 'West-Eastern Divan Orchestra, BBC Proms 2014',
    videoId: 's_pSJOkmYBA',
    duration: 858,
  },
  {
    id: 'debussy-clair-de-lune',
    title: 'Clair de Lune (harp)',
    composer: 'debussy',
    performer: 'Héloïse de Jenlis',
    videoId: 'vVTPbLhlbfI',
    duration: 272,
  },
  {
    id: 'schoenberg-pierrot',
    title: 'Pierrot Lunaire',
    composer: 'schoenberg',
    performer: 'Chicago Symphony Orchestra, Beyond the Score',
    videoId: 'bd2cBUJmDr8',
    duration: 2294,
  },
];
