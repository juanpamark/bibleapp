export interface OriginalWordRef {
  book: string;
  chapter: number;
  verse: number;
  label: string;
}

export interface OriginalWordEntry {
  id: string;
  greek: string;
  translit: string;
  spanish: string;
  summary: string;
  nuance: string;
  refs: OriginalWordRef[];
}

export const ORIGINAL_WORDS: OriginalWordEntry[] = [
  {
    id: 'logos',
    greek: 'Λόγος',
    translit: 'Lógos',
    spanish: 'Verbo · Palabra viva',
    summary: 'Designa no solo un vocablo hablado, sino la razón creadora y la autorrevelación personal de Dios.',
    nuance: 'En Juan 1 conecta la Palabra creadora del Génesis con la sabiduría divina hecha carne en Jesús.',
    refs: [
      { book: 'JHN', chapter: 1, verse: 1, label: 'Juan 1:1' },
      { book: 'JHN', chapter: 1, verse: 14, label: 'Juan 1:14' },
    ],
  },
  {
    id: 'charis',
    greek: 'Χάρις',
    translit: 'Cháris',
    spanish: 'Gracia · Favor inmerecido',
    summary: 'Favor generoso y libre que Dios derrama sin que el ser humano pueda ganarlo ni comprarlo.',
    nuance: 'En Pablo incluye tanto el perdón inicial como el poder cotidiano que sostiene en la debilidad.',
    refs: [
      { book: 'EPH', chapter: 2, verse: 8, label: 'Efesios 2:8' },
      { book: '2CO', chapter: 12, verse: 9, label: '2 Corintios 12:9' },
    ],
  },
  {
    id: 'agape',
    greek: 'Ἀγάπη',
    translit: 'Agápē',
    spanish: 'Amor incondicional',
    summary: 'Amor decidido y sacrificial que busca activamente el bien del otro por encima del interés propio.',
    nuance: 'Más que un impulso pasajero, en el NT se expresa en acciones concretas reveladas en la cruz.',
    refs: [
      { book: '1CO', chapter: 13, verse: 4, label: '1 Corintios 13:4' },
      { book: '1JN', chapter: 4, verse: 8, label: '1 Juan 4:8' },
      { book: 'JHN', chapter: 3, verse: 16, label: 'Juan 3:16' },
    ],
  },
  {
    id: 'metanoia',
    greek: 'Μετάνοια',
    translit: 'Metánoia',
    spanish: 'Arrepentimiento · Cambio de mente',
    summary: 'Transformación profunda de la manera de pensar, valorar y orientar la vida hacia Dios.',
    nuance: 'Va mucho más allá del remordimiento emocional: implica dar media vuelta y renovar la mente.',
    refs: [
      { book: 'MAT', chapter: 4, verse: 17, label: 'Mateo 4:17' },
      { book: 'ROM', chapter: 12, verse: 2, label: 'Romanos 12:2' },
    ],
  },
  {
    id: 'pistis',
    greek: 'Πίστις',
    translit: 'Pístis',
    spanish: 'Fe · Confianza fiel',
    summary: 'Convicción confiada que descansa en la fidelidad de Dios y se traduce en lealtad viva.',
    nuance: 'No es credulidad ciega, sino entrega relacional apoyada en el carácter probado de Cristo.',
    refs: [
      { book: 'HEB', chapter: 11, verse: 1, label: 'Hebreos 11:1' },
      { book: 'GAL', chapter: 2, verse: 20, label: 'Gálatas 2:20' },
    ],
  },
  {
    id: 'eirene',
    greek: 'Εἰρήνη',
    translit: 'Eirḗnē',
    spanish: 'Paz · Plenitud (Shalom)',
    summary: 'Armonía integral con Dios, consigo mismo y con los demás; refleja el shalom hebreo.',
    nuance: 'En Filipenses 4:7 esta paz actúa como una guarnición militar custodiando la mente y el corazón.',
    refs: [
      { book: 'PHP', chapter: 4, verse: 7, label: 'Filipenses 4:7' },
      { book: 'JHN', chapter: 14, verse: 27, label: 'Juan 14:27' },
    ],
  },
  {
    id: 'koinonia',
    greek: 'Κοινωνία',
    translit: 'Koinōnía',
    spanish: 'Comunión · Participación compartida',
    summary: 'Vínculo profundo de compañerismo donde se comparte vida, fe, mesa y generosidad mutua.',
    nuance: 'Subraya que el seguimiento de Jesús nunca fue diseñado como un proyecto solitario.',
    refs: [
      { book: 'ACT', chapter: 2, verse: 42, label: 'Hechos 2:42' },
      { book: '1JN', chapter: 1, verse: 3, label: '1 Juan 1:3' },
    ],
  },
  {
    id: 'soteria',
    greek: 'Σωτηρία',
    translit: 'Sōtēría',
    spanish: 'Salvación · Rescate integral',
    summary: 'Liberación completa del pecado y la muerte, restaurando al ser humano a comunión con Dios.',
    nuance: 'En el griego koiné abarca rescate, sanidad y preservación segura hasta la consumación final.',
    refs: [
      { book: 'ROM', chapter: 1, verse: 16, label: 'Romanos 1:16' },
      { book: 'ACT', chapter: 4, verse: 12, label: 'Hechos 4:12' },
    ],
  },
  {
    id: 'parakletos',
    greek: 'Παράκλητος',
    translit: 'Paráklētos',
    spanish: 'Consolador · Defensor al lado',
    summary: 'Quien es llamado para estar al lado: abogado, consejero, consolador y fortalecedor.',
    nuance: 'Jesús llama así al Espíritu Santo prometiendo su presencia cercana y permanente.',
    refs: [
      { book: 'JHN', chapter: 14, verse: 16, label: 'Juan 14:16' },
      { book: 'JHN', chapter: 14, verse: 26, label: 'Juan 14:26' },
    ],
  },
  {
    id: 'makarios',
    greek: 'Μακάριος',
    translit: 'Makários',
    spanish: 'Dichoso · Bienaventurado',
    summary: 'Estado profundo de plenitud y favor de Dios que no depende de circunstancias externas favorables.',
    nuance: 'Encabeza las Bienaventuranzas de Jesús invirtiendo los valores de poder del mundo antiguo.',
    refs: [
      { book: 'MAT', chapter: 5, verse: 3, label: 'Mateo 5:3' },
      { book: 'MAT', chapter: 5, verse: 8, label: 'Mateo 5:8' },
    ],
  },
  {
    id: 'hypomone',
    greek: 'Ὑπομονή',
    translit: 'Hypomonḗ',
    spanish: 'Perseverancia firme',
    summary: 'Capacidad activa de permanecer firme bajo presión sin rendirse ni perder la esperanza.',
    nuance: 'Literalmente «permanecer debajo» de una carga con constancia valiente, no resignación pasiva.',
    refs: [
      { book: 'JAS', chapter: 1, verse: 3, label: 'Santiago 1:3' },
      { book: 'HEB', chapter: 12, verse: 1, label: 'Hebreos 12:1' },
    ],
  },
  {
    id: 'dikaiosyne',
    greek: 'Δικαιοσύνη',
    translit: 'Dikaiosýnē',
    spanish: 'Justicia · Fidelidad al pacto',
    summary: 'Rectitud de Dios que cumple sus promesas, absuelve por gracia y forma vidas íntegras.',
    nuance: 'Une la declaración legal de absolución con la práctica concreta de compasión y verdad.',
    refs: [
      { book: 'ROM', chapter: 3, verse: 22, label: 'Romanos 3:22' },
      { book: 'MAT', chapter: 5, verse: 6, label: 'Mateo 5:6' },
    ],
  },
];
